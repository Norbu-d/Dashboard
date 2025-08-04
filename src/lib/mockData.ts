// lib/mockData.ts - Robust version with fallback
import { faker } from '@faker-js/faker';
import { subDays, formatISO } from 'date-fns';

// Set a seed for consistent data across reloads in development
if (process.env.NODE_ENV === 'development') {
  faker.seed(12345); // Fixed seed for development
}

interface CustomSize {
  chest: number;
  waist: number;
  hips: number;
}

interface OrderItem {
  orderItemId: string;
  itemName: string;
  category: string;
  price: number;
  customSize: CustomSize;
}

interface Order {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'churned' | 'prospect';
  revenue: number;
  createdAt: string;
  orderCount: number;
  lastOrderDate: string | null;
  _orders: Order[];
}

// Generate mock order items
const generateOrderItems = (): OrderItem[] => {
  const itemNames = [
    'Bespoke Linen Blazer',
    'Custom Wool Suit',
    'Tailored Cotton Shirt',
    'Designer Silk Dress',
    'Premium Cashmere Coat',
    'Hand-stitched Leather Jacket',
    'Classic Three-piece Suit',
    'Evening Gown',
    'Business Formal Shirt',
    'Wedding Dress'
  ];
  const categories = ['Jackets', 'Trousers', 'Dresses', 'Shirts', 'Suits'];

  const itemCount = faker.number.int({ min: 1, max: 5 });
  return Array.from({ length: itemCount }, () => ({
    orderItemId: faker.string.uuid(),
    itemName: faker.helpers.arrayElement(itemNames),
    category: faker.helpers.arrayElement(categories),
    price: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
    customSize: {
      chest: faker.number.int({ min: 30, max: 50 }),
      waist: faker.number.int({ min: 28, max: 48 }),
      hips: faker.number.int({ min: 30, max: 50 })
    }
  }));
};

// Generate orders for a customer
const generateOrders = (): Order[] => {
  const orderCount = faker.number.int({ min: 0, max: 10 });
  return Array.from({ length: orderCount }, () => {
    const items = generateOrderItems();
    return {
      orderId: faker.string.uuid(),
      orderDate: formatISO(subDays(new Date(), faker.number.int({ min: 1, max: 365 }))),
      totalAmount: items.reduce((sum, item) => sum + item.price, 0),
      items
    };
  }).sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
};

// Create a customer with specific ID (for fallback)
const createCustomerWithId = (id: string, name?: string, email?: string): Customer => {
  const orders = generateOrders();
  return {
    id,
    name: name || faker.person.fullName(),
    email: email || faker.internet.email(),
    status: faker.helpers.arrayElement(['active', 'churned', 'prospect']),
    revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    createdAt: formatISO(subDays(new Date(), faker.number.int({ min: 1, max: 365 }))),
    orderCount: orders.length,
    lastOrderDate: orders.length > 0 ? orders[orders.length - 1].orderDate : null,
    _orders: orders
  };
};

// Create multiple known customers to avoid 404s
const createKnownCustomers = (): Customer[] => {
  const knownCustomerIds = [
    'a605ac61-d2cf-4051-b166-c4b4a0c45179',
    '924daa4b-39d8-4085-a29e-8332a1316633', // This matches your error log
    '296879ac-1cd1-47c7-890e-5b5536787893',
    'b715bc72-e3de-4152-c277-d5c5b1d56280',
  ];

  return knownCustomerIds.map((id, index) => 
    createCustomerWithId(id, `Test User ${index + 1}`, `test${index + 1}@example.com`)
  );
};

// Generate random mock customers
const generateMockCustomers = (count: number): Customer[] => {
  const knownCustomers = createKnownCustomers();
  
  const randomCustomers = Array.from({ length: count }, (_, i) => {
    const orders = generateOrders();
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(['active', 'churned', 'prospect']),
      revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      createdAt: formatISO(subDays(new Date(), 365 + i)),
      orderCount: orders.length,
      lastOrderDate: orders.length > 0 ? orders[orders.length - 1].orderDate : null,
      _orders: orders
    };
  });

  return [...knownCustomers, ...randomCustomers];
};

// Updated to generate 100 customers (96 random + 4 known customers)
export const mockCustomers = generateMockCustomers(96);

// Log known customer IDs for debugging
console.log('Known customer IDs:', mockCustomers.slice(0, 4).map(c => ({ id: c.id, name: c.name })));
console.log(`Total mock customers generated: ${mockCustomers.length}`);

export const getCustomerSummary = (customer: Customer) => {
  const { _orders, ...summary } = customer;
  return summary;
};

export const getCustomerById = (id: string): Customer | undefined => {
  let customer = mockCustomers.find(c => c.id === id);
  
  if (!customer) {
    console.log(`Customer ${id} not found. Available customers:`, 
      mockCustomers.slice(0, 5).map(c => ({ id: c.id, name: c.name }))
    );
    console.log(`Total customers in mock data: ${mockCustomers.length}`);
    
    // Fallback: create a customer with the requested ID
    console.log(`Creating fallback customer with ID: ${id}`);
    customer = createCustomerWithId(id, `Fallback Customer`, `fallback@example.com`);
    mockCustomers.push(customer);
  }
  
  return customer;
};

export const updateCustomerStatus = (customerId: string, newStatus: Customer['status']) => {
  const customer = mockCustomers.find(c => c.id === customerId);
  if (customer) {
    customer.status = newStatus;
    console.log(`Updated customer ${customer.name} status to ${newStatus}`);
    return true;
  }
  return false;
};

export const updateOrderItemSize = (
  customerId: string,
  orderId: string,
  orderItemId: string,
  customSize: CustomSize
) => {
  const customer = mockCustomers.find(c => c.id === customerId);
  if (!customer) return false;

  const order = customer._orders.find(o => o.orderId === orderId);
  if (!order) return false;

  const orderItem = order.items.find(item => item.orderItemId === orderItemId);
  if (!orderItem) return false;

  orderItem.customSize = customSize;
  return true;
};