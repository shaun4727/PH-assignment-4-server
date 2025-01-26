import { z } from "zod";

const TReviewSchema = z.object({
  review: z.string({ required_error: "Review can't be empty" }),
  user: z.string(),
});

const createBookValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    author: z.string({
      required_error: "Author is required",
    }),
    price: z.number({
      required_error: "Price is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    quantity: z.number({
      required_error: "Quantity is required",
    }),
    reviews: z.array(TReviewSchema).optional(),
    inStock: z
      .boolean({
        required_error: "Stock is required",
      })
      .default(true),
  }),
});

const updateBookValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .optional(),
    author: z
      .string({
        required_error: "Author is required",
      })
      .optional(),
    price: z
      .number({
        required_error: "Price is required",
      })
      .optional(),
    category: z
      .string({
        required_error: "Category is required",
      })
      .optional(),
    description: z
      .string({
        required_error: "Description is required",
      })
      .optional(),
    quantity: z
      .number({
        required_error: "Quantity is required",
      })
      .optional(),
    inStock: z
      .boolean({
        required_error: "Stock is required",
      })
      .default(true)
      .optional(),
  }),
});

export const bookValidation = {
  createBookValidationSchema,
  updateBookValidationSchema,
};
