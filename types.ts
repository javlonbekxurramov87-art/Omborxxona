export enum UnitType {
  DONA = 'dona',
  KG = 'kg',
  LITR = 'litr',
  METR = 'metr',
  KVADRAT = 'kv.m'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  quantity: number;
  unit: UnitType;
  price?: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'kirim' | 'chiqim';
  quantity: number;
  timestamp: string;
  user?: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  value: number;
}

export type Permission = 'dashboard' | 'kirim' | 'chiqim' | 'inventory' | 'admin';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed!
  fullName: string;
  permissions: Permission[];
}