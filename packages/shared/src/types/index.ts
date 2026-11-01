import { z } from 'zod';
import * as schemas from '../schemas/index.js';

export type Category = z.infer<typeof schemas.CategorySchema>;
export type MenuItem = z.infer<typeof schemas.MenuItemSchema>;
export type OrderRequest = z.infer<typeof schemas.CreateOrderSchema>;

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
