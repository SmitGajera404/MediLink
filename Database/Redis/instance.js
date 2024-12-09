import Redis from 'ioredis';
export const redisInstance = new Redis();
redisInstance.ping().then((result) => {
    console.log("Redis is connected: "+result);
}).catch((error) => {
    console.log("Redis connection failed: "+error);
})