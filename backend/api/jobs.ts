// ============================================================================
// BACKGROUND JOB PROCESSING SERVICE - PHASE 3
// ============================================================================

export interface Job {
  id: string;
  type: string;
  data: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: any;
  delay?: number; // milliseconds
  scheduledFor?: Date;
}

export interface JobProcessor {
  (job: Job): Promise<any>;
}

export interface JobStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalProcessed: number;
  avgProcessingTime: number;
}

export class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private processors: Map<string, JobProcessor> = new Map();
  private isProcessing = false;
  private concurrency = 5;
  private processingJobs = new Set<string>();

  constructor() {
    this.registerDefaultProcessors();
  }

  // Register job processors
  registerProcessor(type: string, processor: JobProcessor) {
    this.processors.set(type, processor);
    console.log(`📋 Registered job processor: ${type}`);
  }

  // Add job to queue
  async addJob(
    type: string,
    data: Record<string, any>,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      delay?: number;
      maxAttempts?: number;
      scheduledFor?: Date;
    } = {}
  ): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: Job = {
      id: jobId,
      type,
      data,
      priority: options.priority || 'normal',
      status: 'pending',
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date(),
      delay: options.delay,
      scheduledFor: options.scheduledFor,
    };

    this.jobs.set(jobId, job);
    
    console.log(`➕ Job added: ${type} (${jobId})`);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }

    return jobId;
  }

  // Get job by ID
  getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  // Get jobs by status
  getJobsByStatus(status: Job['status']): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  // Get job statistics
  getStats(): JobStats {
    const jobs = Array.from(this.jobs.values());
    const completed = jobs.filter(j => j.status === 'completed');
    
    const totalProcessingTime = completed
      .filter(j => j.processedAt && j.completedAt)
      .reduce((sum, j) => sum + (j.completedAt!.getTime() - j.processedAt!.getTime()), 0);

    return {
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: completed.length,
      failed: jobs.filter(j => j.status === 'failed').length,
      totalProcessed: completed.length,
      avgProcessingTime: completed.length > 0 ? totalProcessingTime / completed.length : 0,
    };
  }

  // Start job processing
  private async startProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log("🚀 Starting job processing...");

    while (this.isProcessing) {
      try {
        // Get next jobs to process
        const availableJobs = this.getNextJobs();
        
        if (availableJobs.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          continue;
        }

        // Process jobs concurrently
        const processingPromises = availableJobs.map(job => this.processJob(job));
        await Promise.allSettled(processingPromises);
        
      } catch (error) {
        console.error("Job processing error:", error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds on error
      }
    }
  }

  // Get next jobs to process
  private getNextJobs(): Job[] {
    const now = new Date();
    const availableSlots = this.concurrency - this.processingJobs.size;
    
    if (availableSlots <= 0) return [];

    const pendingJobs = Array.from(this.jobs.values())
      .filter(job => {
        // Must be pending
        if (job.status !== 'pending') return false;
        
        // Check if scheduled for future
        if (job.scheduledFor && job.scheduledFor > now) return false;
        
        // Check delay
        if (job.delay) {
          const delayedUntil = new Date(job.createdAt.getTime() + job.delay);
          if (delayedUntil > now) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by priority, then by creation time
        const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return a.createdAt.getTime() - b.createdAt.getTime();
      })
      .slice(0, availableSlots);

    return pendingJobs;
  }

  // Process individual job
  private async processJob(job: Job): Promise<void> {
    const processor = this.processors.get(job.type);
    if (!processor) {
      console.error(`❌ No processor found for job type: ${job.type}`);
      job.status = 'failed';
      job.error = `No processor found for job type: ${job.type}`;
      return;
    }

    this.processingJobs.add(job.id);
    job.status = 'processing';
    job.processedAt = new Date();
    job.attempts++;

    console.log(`⚙️  Processing job: ${job.type} (${job.id}) - Attempt ${job.attempts}`);

    try {
      const result = await processor(job);
      
      job.status = 'completed';
      job.completedAt = new Date();
      job.result = result;
      
      console.log(`✅ Job completed: ${job.type} (${job.id})`);
      
    } catch (error) {
      console.error(`❌ Job failed: ${job.type} (${job.id})`, error);
      
      job.error = error instanceof Error ? error.message : String(error);
      
      if (job.attempts >= job.maxAttempts) {
        job.status = 'failed';
        console.log(`💀 Job permanently failed: ${job.type} (${job.id})`);
      } else {
        job.status = 'pending'; // Will be retried
        job.delay = Math.min(30000 * Math.pow(2, job.attempts - 1), 300000); // Exponential backoff, max 5 minutes
        console.log(`🔄 Job will be retried: ${job.type} (${job.id}) in ${job.delay}ms`);
      }
    } finally {
      this.processingJobs.delete(job.id);
    }
  }

  // Stop job processing
  stopProcessing() {
    this.isProcessing = false;
    console.log("⏹️  Stopping job processing...");
  }

  // Clean up old jobs
  cleanup(olderThanHours = 24) {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    let cleaned = 0;

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === 'completed' || job.status === 'failed') {
        const completedAt = job.completedAt || job.createdAt;
        if (completedAt < cutoff) {
          this.jobs.delete(jobId);
          cleaned++;
        }
      }
    }

    console.log(`🧹 Cleaned up ${cleaned} old jobs`);
    return cleaned;
  }

  // Register default job processors
  private registerDefaultProcessors() {
    
    // Email sending job
    this.registerProcessor('send_email', async (job) => {
      const { to, template, data } = job.data;
      console.log(`📧 Sending email to ${to} using template ${template}`);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      if (Math.random() < 0.1) { // 10% failure rate for demo
        throw new Error('Email service temporarily unavailable');
      }
      
      return { messageId: `msg_${Date.now()}`, status: 'sent' };
    });

    // Data export job
    this.registerProcessor('export_data', async (job) => {
      const { userId, format, dateRange } = job.data;
      console.log(`📊 Exporting data for user ${userId} in ${format} format`);
      
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 10000));
      
      return {
        fileUrl: `/exports/user_${userId}_${Date.now()}.${format}`,
        recordCount: Math.floor(Math.random() * 10000) + 1000,
        fileSize: Math.floor(Math.random() * 5000000) + 100000,
      };
    });

    // Analytics calculation job
    this.registerProcessor('calculate_analytics', async (job) => {
      const { type, period } = job.data;
      console.log(`📈 Calculating ${type} analytics for ${period}`);
      
      // Simulate analytics calculation
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 5000));
      
      return {
        calculatedAt: new Date().toISOString(),
        metrics: {
          users: Math.floor(Math.random() * 1000) + 100,
          posts: Math.floor(Math.random() * 5000) + 500,
          engagement: Math.random() * 0.5 + 0.1,
        },
      };
    });

    // Notification delivery job
    this.registerProcessor('send_notification', async (job) => {
      const { userId, type, message, channels } = job.data;
      console.log(`🔔 Sending ${type} notification to user ${userId}`);
      
      // Simulate notification sending
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const results = channels.map((channel: string) => ({
        channel,
        status: Math.random() < 0.95 ? 'delivered' : 'failed',
        timestamp: new Date().toISOString(),
      }));
      
      return { results, totalSent: results.filter(r => r.status === 'delivered').length };
    });

    // File processing job
    this.registerProcessor('process_file', async (job) => {
      const { fileId, operations } = job.data;
      console.log(`📁 Processing file ${fileId} with operations: ${operations.join(', ')}`);
      
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 8000));
      
      return {
        processedFileId: `processed_${fileId}`,
        operations: operations,
        outputFiles: operations.map((op: string) => `${fileId}_${op}.jpg`),
      };
    });

    // Database maintenance job
    this.registerProcessor('database_maintenance', async (job) => {
      const { operation } = job.data;
      console.log(`🗄️  Running database maintenance: ${operation}`);
      
      // Simulate database maintenance
      await new Promise(resolve => setTimeout(resolve, 10000 + Math.random() * 20000));
      
      return {
        operation,
        tablesProcessed: Math.floor(Math.random() * 20) + 5,
        recordsProcessed: Math.floor(Math.random() * 100000) + 10000,
        duration: Math.floor(Math.random() * 30000) + 5000,
      };
    });
  }
}

// Singleton instance
export const jobQueue = new JobQueue();

// Helper functions for common job types
export const JobHelpers = {
  
  // Schedule email
  async scheduleEmail(to: string, template: string, data: Record<string, any>, delay?: number) {
    return jobQueue.addJob('send_email', { to, template, data }, { 
      priority: 'normal',
      delay 
    });
  },

  // Schedule data export
  async scheduleDataExport(userId: number, format: 'csv' | 'json' | 'pdf', dateRange: { start: Date; end: Date }) {
    return jobQueue.addJob('export_data', { userId, format, dateRange }, { 
      priority: 'low',
      maxAttempts: 1 // Don't retry exports
    });
  },

  // Schedule analytics calculation
  async scheduleAnalytics(type: string, period: string) {
    return jobQueue.addJob('calculate_analytics', { type, period }, { 
      priority: 'low' 
    });
  },

  // Schedule notification
  async scheduleNotification(userId: number, type: string, message: string, channels: string[]) {
    return jobQueue.addJob('send_notification', { userId, type, message, channels }, { 
      priority: 'high' 
    });
  },

  // Schedule file processing
  async scheduleFileProcessing(fileId: string, operations: string[]) {
    return jobQueue.addJob('process_file', { fileId, operations }, { 
      priority: 'normal' 
    });
  },

  // Schedule database maintenance
  async scheduleDatabaseMaintenance(operation: string, scheduledFor?: Date) {
    return jobQueue.addJob('database_maintenance', { operation }, { 
      priority: 'low',
      scheduledFor 
    });
  },
};