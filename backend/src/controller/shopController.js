import { redis } from '../redis/redis.js';

export const getProtectedShopData = async (req, res) => {
  const email = req.user.email;
  const cacheKey = `shop:protected:${email}`;

  try {
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return res.json({
          ...JSON.parse(cachedData),
          cache: true,
        });
      }
    }

    const responsePayload = {
      message: 'You can access protected shop data',
      user: { email },
    };

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(responsePayload), { ex: 120 });
    }

    return res.json(responsePayload);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch protected shop data' });
  }
};
