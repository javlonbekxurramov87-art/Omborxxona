import { Product, Transaction, UnitType, User } from '../types';

const PRODUCTS_KEY = 'ombor_products';
const TRANSACTIONS_KEY = 'ombor_transactions';
const USERS_KEY = 'ombor_users';

// Empty initial products as requested
const initialProducts: Product[] = [];

// Default Admin User
const initialUsers: User[] = [
  {
    id: 'admin_1',
    username: 'admin',
    password: '123',
    fullName: 'Bosh Administrator',
    permissions: ['dashboard', 'kirim', 'chiqim', 'inventory', 'admin']
  }
];

// --- Product Logic ---

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : initialProducts;
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Update product details (without changing stock logic necessarily)
export const updateProductDetails = (updatedProduct: Product): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
};

export const deleteProduct = (productId: string): void => {
  let products = getProducts();
  products = products.filter(p => p.id !== productId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getProductByBarcode = (barcode: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.barcode === barcode);
};

export const updateStock = (productId: string, quantityChange: number, type: 'kirim' | 'chiqim', username: string = 'System'): boolean => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product) return false;

  if (type === 'chiqim' && product.quantity < quantityChange) {
    return false; // Not enough stock
  }

  if (type === 'kirim') {
    product.quantity += quantityChange;
  } else {
    product.quantity -= quantityChange;
  }
  
  product.lastUpdated = new Date().toISOString();
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  
  // Save transaction
  const transaction: Transaction = {
    id: Date.now().toString(),
    productId: product.id,
    productName: product.name,
    type,
    quantity: quantityChange,
    timestamp: new Date().toISOString(),
    user: username
  };
  
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  
  return true;
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getAllCategories = (): string[] => {
  const products = getProducts();
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
};

// --- User Logic ---

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    // Initialize default admin if no users exist
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(data);
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (userId: string): void => {
  let users = getUsers();
  // Prevent deleting the last admin
  const userToDelete = users.find(u => u.id === userId);
  if (userToDelete?.username === 'admin') return; 

  users = users.filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loginUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};