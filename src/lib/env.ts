import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ENVIRONMENT = NODE_ENV;
export const AUTH_PUBLIC_KEY = process.env.AUTH_PUBLIC_KEY || '';
