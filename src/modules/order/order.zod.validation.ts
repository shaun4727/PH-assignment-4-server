import { z } from "zod";

// Zod validation schema for the Order
const createOrderValidationSchema = z.object({
  body: z.object({
    product: z.string(),
    user: z.string(),
    quantity: z
      .number({
        required_error: "Quantity is required",
      })
      .min(1, { message: "Quantity must be greater than 0" }) // Ensure quantity is a positive integer
      .int("Quantity must be an integer"), // Ensure quantity is an integer
    totalPrice: z
      .number({
        required_error: "Total Price is required",
      })
      .min(0, { message: "Total Price must be a positive number" }), // Ensure totalPrice is a positive number
  }),
});
const updateOrderValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"), // Email validation
  product: z.string(),
  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .min(1, { message: "Quantity must be greater than 0" }) // Ensure quantity is a positive integer
    .int("Quantity must be an integer"), // Ensure quantity is an integer
  totalPrice: z
    .number({
      required_error: "Total Price is required",
    })
    .min(0, { message: "Total Price must be a positive number" }), // Ensure totalPrice is a positive number
});

export const orderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
