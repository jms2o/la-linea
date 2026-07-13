import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  productVariantId: z.string().min(1).optional(),
  quantity: z.number().int().positive()
});

export const deliveryOptionSchema = z.enum(["Recoger en tienda", "A domicilio"]);

export type DeliveryOption = z.infer<typeof deliveryOptionSchema>;

export const paymentMethodSchema = z.enum(["WHATSAPP", "CARD"]);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const createOrderInputSchema = z
  .object({
    deliveryMethod: deliveryOptionSchema,
    paymentMethod: paymentMethodSchema,
    address: z.string().max(240).optional(),
    neighborhood: z.string().max(120).optional(),
    city: z.string().max(120).optional(),
    state: z.string().max(120).optional(),
    zipCode: z.string().max(10).optional(),
    reference: z.string().max(240).optional(),
    items: z.array(orderItemInputSchema).min(1)
  })
  .refine(
    (data) =>
      data.deliveryMethod !== "A domicilio" ||
      [data.address, data.neighborhood, data.city, data.state, data.zipCode].every((field) =>
        Boolean(field?.trim())
      ),
    {
      message: "Completa todos los datos de envio para entrega a domicilio.",
      path: ["address"]
    }
  );

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);

export const updateOrderStatusInputSchema = z.object({
  status: orderStatusSchema
});

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
