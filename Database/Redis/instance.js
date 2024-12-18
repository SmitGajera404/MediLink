import Redis from 'ioredis';
export const redisInstance = new Redis('redis://default:buvXFY4BXeMvYMinTWrXHZx2zl3ZgCJ1@redis-17712.c212.ap-south-1-1.ec2.redns.redis-cloud.com:17712');
// export const redisInstance = new Redis({
//     host: '13.233.163.98',
//     port: 6379
// })
redisInstance.ping().then((result) => {
    console.log("Redis is connected: "+result);
}).catch((error) => {
    console.log("Redis connection failed: "+error);
})