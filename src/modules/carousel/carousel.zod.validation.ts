import { z } from "zod";

const createImageValidationSchema = z.object({
  body: z.object({
    image: z.string({
      required_error: "Image is required",
    }),
  }),
});

const updateImageValidationSchema = z.object({
  body: z.object({
    image: z.string({
      required_error: "Image is required",
    }),
  }),
});

export const carouselValidation = {
  createImageValidationSchema,
  updateImageValidationSchema,
};
