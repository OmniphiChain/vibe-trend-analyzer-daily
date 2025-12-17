// Geo-Sentiment Service
import { CountrySentiment, FilterOptions, GeoSentimentAnalytics } from '@/types/geoSentiment';

class GeoSentimentService {
  private static instance: GeoSentimentService;
  private cache = new Map<string, any>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static getInstance(): GeoSentimentService {
    if (!GeoSentimentService.instance) {
      GeoSentimentService.instance = new GeoSentimentService();
    }
    return GeoSentimentService.instance;
  }

  // Get geo-sentiment data with filtering
  async getGeoSentimentData(filters: FilterOptions): Promise<CountrySentiment[]> {
    const cacheKey = `geo-sentiment-${JSON.stringify(filters)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    // Simulate API call with mock data
    const data = await this.fetchMockGeoSentimentData(filters);
    
    // Cache the result
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  // Get analytics for dashboard
  async getGeoSentimentAnalytics(filters: FilterOptions): Promise<GeoSentimentAnalytics> {
    const data = await this.getGeoSentimentData(filters);
    
    return {
      totalCountries: data.length,
      averageMoodScore: Math.round(data.reduce((acc, country) => acc + country.moodScore, 0) / data.length),
      totalDiscussions: data.reduce((acc, country) => acc + country.discussions, 0),
      averageMarketReturn: Number((data.reduce((acc, country) => acc + country.marketReturn, 0) / data.length).toFixed(2)),
      topBullishCountries: data.slice().sort((a, b) => b.moodScore - a.moodScore).slice(0, 5),
      topBearishCountries: data.slice().sort((a, b) => a.moodScore - b.moodScore).slice(0, 5),
      sentimentDistribution: {
        bullish: Math.round(data.reduce((acc, country) => acc + country.bullish, 0) / data.length),
        neutral: Math.round(data.reduce((acc, country) => acc + country.neutral, 0) / data.length),
        bearish: Math.round(data.reduce((acc, country) => acc + country.bearish, 0) / data.length)
      },
      topTickers: this.getTopTickers(data),
      regionalBreakdown: this.getRegionalBreakdown(data)
    };
  }

  // Export data to CSV
  exportToCSV(data: CountrySentiment[]): string {
    const headers = ['Country', 'Country Code', 'Continent', 'Bullish %', 'Bearish %', 'Neutral %', 'Mood Score', 'Top Tickers', 'Discussions', 'Market Return %'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(country => [
        country.country,
        country.countryCode,
        country.continent,
        country.bullish,
        country.bearish,
        country.neutral,
        country.moodScore,
        country.topTickers.join(';'),
        country.discussions,
        country.marketReturn
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Get sentiment correlations
  async getSentimentCorrelations(filters: FilterOptions): Promise<{ country: string; correlation: number }[]> {
    const data = await this.getGeoSentimentData(filters);
    
    return data.map(country => ({
      country: country.country,
      correlation: Number((country.moodScore / 100 * country.marketReturn / 10).toFixed(3))
    })).sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }

  private async fetchMockGeoSentimentData(filters: FilterOptions): Promise<CountrySentiment[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const baseData: CountrySentiment[] = [
      {
        country: 'United States',
        countryCode: 'US',
        continent: 'americas',
        bullish: 68,
        bearish: 22,
        neutral: 10,
        moodScore: 78,
        topTickers: ['AAPL', 'NVDA', 'MSFT'],
        discussions: 15420,
        marketReturn: 2.4,
        coordinates: [39.8283, -98.5795],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 35,
          social: 45,
          community: 20
        },
        economicIndicators: {
          gdpGrowth: 2.1,
          inflation: 3.2,
          unemployment: 3.8
        }
      },
      {
        country: 'China',
        countryCode: 'CN',
        continent: 'asia',
        bullish: 45,
        bearish: 38,
        neutral: 17,
        moodScore: 52,
        topTickers: ['BABA', 'BIDU', 'JD'],
        discussions: 8930,
        marketReturn: -1.2,
        coordinates: [35.8617, 104.1954],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 40,
          social: 35,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 5.2,
          inflation: 2.1,
          unemployment: 5.1
        }
      },
      {
        country: 'Germany',
        countryCode: 'DE',
        continent: 'europe',
        bullish: 58,
        bearish: 28,
        neutral: 14,
        moodScore: 65,
        topTickers: ['SAP', 'ASML', 'ADBE'],
        discussions: 4250,
        marketReturn: 1.8,
        coordinates: [51.1657, 10.4515],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 45,
          social: 30,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 1.4,
          inflation: 5.8,
          unemployment: 3.0
        }
      },
      {
        country: 'Japan',
        countryCode: 'JP',
        continent: 'asia',
        bullish: 62,
        bearish: 25,
        neutral: 13,
        moodScore: 69,
        topTickers: ['TSM', 'SONY', 'NKE'],
        discussions: 6780,
        marketReturn: 1.5,
        coordinates: [36.2048, 138.2529],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 50,
          social: 25,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 1.8,
          inflation: 2.8,
          unemployment: 2.4
        }
      },
      {
        country: 'United Kingdom',
        countryCode: 'GB',
        continent: 'europe',
        bullish: 55,
        bearish: 32,
        neutral: 13,
        moodScore: 61,
        topTickers: ['SHELL', 'AZN', 'BP'],
        discussions: 3540,
        marketReturn: 0.8,
        coordinates: [55.3781, -3.4360],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 40,
          social: 35,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 0.5,
          inflation: 6.7,
          unemployment: 3.7
        }
      },
      {
        country: 'India',
        countryCode: 'IN',
        continent: 'asia',
        bullish: 72,
        bearish: 18,
        neutral: 10,
        moodScore: 82,
        topTickers: ['INFY', 'TCS', 'RELIANCE'],
        discussions: 7200,
        marketReturn: 3.2,
        coordinates: [20.5937, 78.9629],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 30,
          social: 50,
          community: 20
        },
        economicIndicators: {
          gdpGrowth: 6.8,
          inflation: 4.2,
          unemployment: 7.1
        }
      },
      {
        country: 'Brazil',
        countryCode: 'BR',
        continent: 'americas',
        bullish: 48,
        bearish: 35,
        neutral: 17,
        moodScore: 56,
        topTickers: ['VALE', 'PETR4', 'ITUB'],
        discussions: 2890,
        marketReturn: 0.2,
        coordinates: [-14.2350, -51.9253],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 35,
          social: 40,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 2.9,
          inflation: 5.8,
          unemployment: 8.9
        }
      },
      {
        country: 'Canada',
        countryCode: 'CA',
        continent: 'americas',
        bullish: 64,
        bearish: 24,
        neutral: 12,
        moodScore: 72,
        topTickers: ['SHOP', 'TD', 'RY'],
        discussions: 4100,
        marketReturn: 1.9,
        coordinates: [56.1304, -106.3468],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 40,
          social: 35,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 3.1,
          inflation: 3.4,
          unemployment: 5.2
        }
      },
      {
        country: 'France',
        countryCode: 'FR',
        continent: 'europe',
        bullish: 53,
        bearish: 31,
        neutral: 16,
        moodScore: 59,
        topTickers: ['LVMH', 'ASML', 'SAP'],
        discussions: 3720,
        marketReturn: 1.1,
        coordinates: [46.2276, 2.2137],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 45,
          social: 30,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 2.6,
          inflation: 4.9,
          unemployment: 7.3
        }
      },
      {
        country: 'Australia',
        countryCode: 'AU',
        continent: 'oceania',
        bullish: 59,
        bearish: 27,
        neutral: 14,
        moodScore: 66,
        topTickers: ['BHP', 'CSL', 'WBC'],
        discussions: 2240,
        marketReturn: 1.4,
        coordinates: [-25.2744, 133.7751],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 35,
          social: 40,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 3.2,
          inflation: 7.8,
          unemployment: 3.5
        }
      },
      {
        country: 'South Korea',
        countryCode: 'KR',
        continent: 'asia',
        bullish: 61,
        bearish: 26,
        neutral: 13,
        moodScore: 68,
        topTickers: ['SAMSUNG', 'LG', 'SK'],
        discussions: 4890,
        marketReturn: 2.1,
        coordinates: [35.9078, 127.7669],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 40,
          social: 35,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 3.1,
          inflation: 5.1,
          unemployment: 2.9
        }
      },
      {
        country: 'Netherlands',
        countryCode: 'NL',
        continent: 'europe',
        bullish: 63,
        bearish: 24,
        neutral: 13,
        moodScore: 71,
        topTickers: ['ASML', 'ADYEN', 'SHELL'],
        discussions: 1980,
        marketReturn: 2.2,
        coordinates: [52.1326, 5.2913],
        lastUpdated: new Date(),
        sentimentSources: {
          news: 50,
          social: 25,
          community: 25
        },
        economicIndicators: {
          gdpGrowth: 4.5,
          inflation: 10.0,
          unemployment: 3.5
        }
      }
    ];

    // Apply filters
    let filteredData = baseData;

    // Filter by region
    if (filters.region !== 'all') {
      filteredData = filteredData.filter(country => country.continent === filters.region);
    }

    // Apply timeframe adjustments (mock data variation)
    if (filters.timeframe === '7d') {
      filteredData = filteredData.map(country => ({
        ...country,
        moodScore: Math.max(0, Math.min(100, country.moodScore + (Math.random() - 0.5) * 10)),
        discussions: Math.round(country.discussions * (0.8 + Math.random() * 0.4))
      }));
    } else if (filters.timeframe === '30d') {
      filteredData = filteredData.map(country => ({
        ...country,
        moodScore: Math.max(0, Math.min(100, country.moodScore + (Math.random() - 0.5) * 20)),
        discussions: Math.round(country.discussions * (0.6 + Math.random() * 0.8))
      }));
    }

    // Apply asset type filters (mock ticker filtering)
    if (filters.assetType !== 'all') {
      const assetTypeMap: { [key: string]: string[] } = {
        stocks: ['AAPL', 'NVDA', 'MSFT', 'BABA', 'BIDU', 'SAP', 'ASML', 'TSM', 'SONY', 'SHELL', 'AZN', 'BP'],
        crypto: ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOGE', 'MATIC', 'AVAX'],
        etfs: ['SPY', 'QQQ', 'VTI', 'IVV', 'VOO', 'EFA', 'EEM', 'GLD']
      };

      const relevantTickers = assetTypeMap[filters.assetType] || [];
      
      filteredData = filteredData.map(country => ({
        ...country,
        topTickers: country.topTickers.filter(ticker => 
          relevantTickers.some(relevant => ticker.includes(relevant.slice(0, 3)))
        ).slice(0, 3).concat(
          relevantTickers.slice(0, 3 - country.topTickers.length)
        ).slice(0, 3)
      }));
    }

    return filteredData;
  }

  private getTopTickers(data: CountrySentiment[]): { ticker: string; mentions: number }[] {
    const tickerCounts = new Map<string, number>();
    
    data.forEach(country => {
      country.topTickers.forEach(ticker => {
        tickerCounts.set(ticker, (tickerCounts.get(ticker) || 0) + country.discussions);
      });
    });

    return Array.from(tickerCounts.entries())
      .map(([ticker, mentions]) => ({ ticker, mentions }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);
  }

  private getRegionalBreakdown(data: CountrySentiment[]): { [key: string]: { moodScore: number; countries: number } } {
    const regions = ['americas', 'europe', 'asia', 'africa', 'oceania'];
    
    return regions.reduce((acc, region) => {
      const regionCountries = data.filter(country => country.continent === region);
      
      acc[region] = {
        moodScore: regionCountries.length > 0 
          ? Math.round(regionCountries.reduce((sum, country) => sum + country.moodScore, 0) / regionCountries.length)
          : 0,
        countries: regionCountries.length
      };
      
      return acc;
    }, {} as { [key: string]: { moodScore: number; countries: number } });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const geoSentimentService = GeoSentimentService.getInstance();
