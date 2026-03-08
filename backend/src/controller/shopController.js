import { redis } from '../redis/redis.js';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const SHOP_PRODUCTS_CACHE_KEY = 'shop:products:v1';

const parseCachedValue = (value) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  return value;
};

export const getProducts = async (req, res) => {
  try {
    if (redis) {
      const cachedProducts = await redis.get(SHOP_PRODUCTS_CACHE_KEY);
      const parsedProducts = parseCachedValue(cachedProducts);
      if (parsedProducts) {
        return res.json({ products: parsedProducts, cache: true });
      }
    }

    const products = await Product.find({}).sort({ createdAt: 1 }).lean();
    const formattedProducts = products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      rating: product.rating,
    }));

    if (redis) {
      await redis.set(SHOP_PRODUCTS_CACHE_KEY, formattedProducts, { ex: 120 });
    }

    return res.json({ products: formattedProducts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, image, category, description, rating } = req.body;

    if (!name || !image || !category || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const normalizedPrice = Number(price);
    const normalizedRating = Number(rating);
    if (Number.isNaN(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }

    if (
      Number.isNaN(normalizedRating) ||
      normalizedRating < 0 ||
      normalizedRating > 5
    ) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const keyBase = String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const key = `${keyBase}-${Date.now()}`;

    const product = await Product.create({
      key,
      name: String(name).trim(),
      price: Number(normalizedPrice.toFixed(2)),
      image: String(image).trim(),
      category: String(category).trim(),
      description: String(description).trim(),
      rating: Number(normalizedRating.toFixed(1)),
    });

    if (redis) {
      await redis.del(SHOP_PRODUCTS_CACHE_KEY);
    }

    return res.status(201).json({
      message: 'Product added successfully',
      product: {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        rating: product.rating,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add product' });
  }
};

export const getProtectedShopData = async (req, res) => {
  const email = req.user.email;
  const cacheKey = `shop:protected:${email}`;

  try {
    if (redis) {
      const cachedData = await redis.get(cacheKey);
      const parsedData = parseCachedValue(cachedData);
      if (parsedData) {
        return res.json({
          ...parsedData,
          cache: true,
        });
      }
    }

    const responsePayload = {
      message: 'You can access protected shop data',
      user: { email },
    };

    if (redis) {
      await redis.set(cacheKey, responsePayload, { ex: 120 });
    }

    return res.json(responsePayload);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch protected shop data' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const normalizedItems = items
      .map((item) => ({
        productId: String(item.productId || '').trim(),
        quantity: Number(item.quantity) || 0,
      }))
      .filter((item) => item.productId && item.quantity > 0);

    if (normalizedItems.length === 0) {
      return res.status(400).json({ message: 'Order items are invalid' });
    }

    const hasInvalidProductId = normalizedItems.some(
      (item) => !mongoose.isValidObjectId(item.productId),
    );
    if (hasInvalidProductId) {
      return res.status(400).json({ message: 'One or more product IDs are invalid' });
    }

    const productIds = normalizedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    if (products.length !== normalizedItems.length) {
      return res.status(400).json({ message: 'One or more products were not found' });
    }

    const orderItems = normalizedItems.map((item) => {
      const product = productMap.get(item.productId);
      const lineTotal = Number((product.price * item.quantity).toFixed(2));
      return {
        product: product._id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const totalAmount = Number(
      orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
    );

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
    });

    if (redis) {
      await redis.del(`shop:orders:${req.user.id}`);
    }

    return res.status(201).json({
      message: 'Order confirmed successfully',
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        confirmedAt: order.confirmedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getMyOrders = async (req, res) => {
  const cacheKey = `shop:orders:${req.user.id}`;

  try {
    if (redis) {
      const cachedOrders = await redis.get(cacheKey);
      const parsedOrders = parseCachedValue(cachedOrders);
      if (parsedOrders) {
        return res.json({ orders: parsedOrders, cache: true });
      }
    }

    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    const formattedOrders = orders.map((order) => ({
      id: order._id.toString(),
      totalAmount: order.totalAmount,
      status: order.status,
      confirmedAt: order.confirmedAt,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.product.toString(),
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    }));

    if (redis) {
      await redis.set(cacheKey, formattedOrders, { ex: 120 });
    }

    return res.json({ orders: formattedOrders });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
