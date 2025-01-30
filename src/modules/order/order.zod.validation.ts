import { z } from "zod";

// Zod validation schema for the Order
const product = z.object({
  product: z.string(),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be greater than 0" }),
  price: z.number().nonnegative({ message: "Price cannot be negative" }),
});
const transactionSchema = z.object({
  id: z.string(),
  transactionStatus: z.string(),
  bank_status: z.string(),
  sp_code: z.string(),
  sp_message: z.string(),
  method: z.string(),
});
const createOrderValidationSchema = z.object({
  body: z.object({
    products: z.array(product).min(1, "At least one product is required"),
    user: z.string(),
    totalPrice: z
      .number()
      .nonnegative({ message: "Total price cannot be negative" }),
    transaction: transactionSchema.optional(),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    products: z
      .array(product)
      .min(1, "At least one product is required")
      .optional(),
    user: z.string().optional(),
    totalPrice: z
      .number()
      .nonnegative({ message: "Total price cannot be negative" })
      .optional(),
    status: z
      .enum(["Pending", "Paid", "Shipped", "Completed", "Cancelled"])
      .optional(),
    transaction: transactionSchema.optional(),
  }), // Ensure totalPrice is a positive number
});

export const orderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
