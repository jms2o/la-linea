import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  productVariantId: z.string().min(1).optional(),
  quantity: z.number().int().positive()
});

export const createOrderInputSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(120),
    phone: z.string().min(7).max(30),
    address: z.string().max(240).optional(),
    city: z.string().max(120).optional(),
    notes: z.string().max(500).optional()
  }),
  deliveryMethod: z.string().min(2).max(80),
  notes: z.string().max(500).optional(),
  items: z.array(orderItemInputSchema).min(1)
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const genderInputSchema = z.enum(["MALE", "FEMALE", "OTHER"]);

export const registerCustomerInputSchema = z.object({
  name: z.string().min(2).max(120),
  gender: genderInputSchema,
  phone: z.string().min(7).max(30),
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export type RegisterCustomerInputPayload = z.infer<typeof registerCustomerInputSchema>;
