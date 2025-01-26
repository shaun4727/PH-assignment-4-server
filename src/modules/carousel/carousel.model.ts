import { Schema, model } from "mongoose";
import { TCarousel } from "./carousel.interface";

const carouselSchema = new Schema<TCarousel>(
  {
    image: { type: String, required: [true, "Image is required"] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CarouselModel = model<TCarousel>("Carousel", carouselSchema);
