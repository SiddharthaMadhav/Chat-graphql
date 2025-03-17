import { Request, Response, NextFunction } from 'express';

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly limit: number;
  private readonly window: number; 

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit;
    this.window = windowMs;
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const identifier = req.ip || 'unknown';
      
      const timestamps = this.requests.get(identifier) || [];
      
      const now = Date.now();
      const recentTimestamps = timestamps.filter(
        timestamp => timestamp > now - this.window
      );
      
      if (recentTimestamps.length >= this.limit) {
        res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.'
        });
        return;
      }
      
      recentTimestamps.push(now);
      this.requests.set(identifier, recentTimestamps);
      
      next();
    };
  }
}
