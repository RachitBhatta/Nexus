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
    attempts:number,
    blockedUntil?:number,
    resetTime:number
}
function getKey(identifier:string,endpoint:string){
  return `rate:${endpoint}:${identifier}`;
}


export async function checkRateLimit(identifier:string,config:RatelimitConfig,endpoint:string)
:Promise<{allowed:boolean,remaining:number,resetTime:number,blockedUntil?:number}>{
    try {
      const key=getKey(identifier,endpoint)
      const now=Date.now();
      let entry=await redis.get<RatelimitEntry>(key);
      if(entry?.blockedUntil && entry.blockedUntil > now){
        return{
          allowed:false,
          remaining:0,
          resetTime:entry.resetTime,
          blockedUntil:entry.blockedUntil
        }
      }
      if(!entry || entry.resetTime <=now){
        entry={attempts:0,resetTime:now+config.windowMS}
      }
      entry.attempts+=1
      if(entry.attempts>config.maxLimits){
        const blockedUntil=config.blockdurationMS?now+config.blockdurationMS:entry.resetTime;
        entry.blockedUntil=blockedUntil;
        await redis.set(key,entry,{ex:Math.ceil(config.windowMS/1000)});
        return { allowed: false, remaining: 0, resetTime: entry.resetTime, blockedUntil };
      }
      await redis.set(key,entry,{ex:Math.ceil(config.windowMS/1000)});
      return {
        allowed:true,
        remaining:config.maxLimits-entry.attempts,
        resetTime:entry.resetTime,
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true, remaining: config.maxLimits, resetTime: Date.now() + config.windowMS };
    }
}



export async function resetRateLimit(identifier:string,endpoint:string){
  const key=getKey(identifier,endpoint)
  await redis.del(key);
}
export async function getRateLimitStatus(identifier: string, endpoint: string): Promise<RatelimitEntry | null> {
  const key = getKey(identifier, endpoint);
  return (await redis.get<RatelimitEntry>(key)) || null;
}
