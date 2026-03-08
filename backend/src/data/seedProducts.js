import Product from '../models/Product.js';

const PRODUCTS = [
  {
    key: 'wireless-headphones',
    name: 'Wireless Headphones',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Premium wireless headphones with noise cancellation',
    rating: 4.5,
  },
  {
    key: 'smart-watch',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Advanced smartwatch with fitness tracking',
    rating: 4.7,
  },
  {
    key: 'laptop-backpack',
    name: 'Laptop Backpack',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    category: 'Accessories',
    description: 'Durable backpack perfect for laptops',
    rating: 4.3,
  },
  {
    key: 'usb-c-hub',
    name: 'USB-C Hub',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Multi-port USB-C hub for connectivity',
    rating: 4.4,
  },
  {
    key: 'mechanical-keyboard',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829191301-e33b1c7f47c1?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'RGB mechanical keyboard with custom switches',
    rating: 4.8,
  },
  {
    key: 'wireless-mouse',
    name: 'Wireless Mouse',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with precision tracking',
    rating: 4.2,
  },
  {
    key: '4k-monitor',
    name: '4K Monitor',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Stunning 4K display monitor for professionals',
    rating: 4.6,
  },
  {
    key: 'webcam-hd',
    name: 'Webcam HD',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Crystal clear HD webcam for video calls',
    rating: 4.1,
  },
];

export const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count > 0) {
    return;
  }

  await Product.insertMany(PRODUCTS);
  console.log(`Seeded ${PRODUCTS.length} products`);
};
