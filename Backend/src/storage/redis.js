import redis from 'redis'

const redisClient = redis.createClient()

//connecting to redis
redisClient.on('connect', () =>{
    console.log('Connected to Redis')
})

redisClient.on('error', (err) => {
    console.log('there is a redis client: ', err)
})

export { redisClient }