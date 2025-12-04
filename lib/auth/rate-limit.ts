import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


interface RatelimitConfig{
    maxLimits:number,
    windowMS:number,
    blockdurationMS?:number
}
interface RatelimitEntry{
    attemps:number,
    blockedUntil?:number,
    resetTime:number
}
