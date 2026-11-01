import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const MenuItemSchema = z.object({
  id: z.string().uuid().optional(),
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  basePrice: z.number().int().nonnegative(), // in Satang
  isActive: z.boolean().default(true),
  manualSoldOut: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const OrderStatusEnum = z.enum(['RECEIVED', 'PREPARING', 'SERVED', 'CANCELED']);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const CreateOrderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  choiceIds: z.array(z.string()).default([]),
  note: z.string().optional().nullable(),
});
export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;

export const CreateOrderSchema = z.object({
  tableNo: z.string().min(1),
  token: z.string().min(1),
  items: z.array(CreateOrderItemSchema).min(1),
  note: z.string().optional().nullable(),
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
  cancelReason: z.string().optional().nullable(),
  treatPreparingAsWaste: z.boolean().optional().default(false),
});
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

export const StoreStatusEnum = z.enum(['OPEN', 'CLOSED', 'HOLIDAY']);
export type StoreStatus = z.infer<typeof StoreStatusEnum>;

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginSchema>;
