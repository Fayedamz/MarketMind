import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => {
    if (times > 3) {
      return null
    }
    return Math.min(times * 50, 2000)
  },
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

export { redis }

export async function cached<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    const data = await fetchFn()
    await redis.setex(key, ttl, JSON.stringify(data))
    return data
  } catch (error) {
    // If cache fails, just fetch directly
    return fetchFn()
  }
}
