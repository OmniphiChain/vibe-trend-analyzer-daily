import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { users, type User, type InsertUser } from "../../shared/schema";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// PostgreSQL Storage Implementation
export class PostgresStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);
    this.db = drizzle(sql);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return result[0]!;
  }
}

// In-Memory Storage (Fallback for development)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

// Initialize storage based on environment
function initializeStorage(): IStorage {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    console.log("✅ Using PostgreSQL database");
    return new PostgresStorage(databaseUrl);
  } else {
    console.warn("⚠️  DATABASE_URL not found, using in-memory storage (data will be lost on restart)");
    return new MemStorage();
  }
}

export const storage = initializeStorage();
