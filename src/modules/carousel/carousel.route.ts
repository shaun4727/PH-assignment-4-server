import express from "express";
import auth from "../../app/middleware/auth";
import { upload } from "../../app/utils/sendImageToCloudinary";
import { USER_ROLE } from "../user-auth/user_auth.constant";
import { CarouselController } from "./carousel.controller";

const router = express.Router();

router.post(
  "/create-carousel",
  auth(USER_ROLE.admin),
  upload.array("file"),

  CarouselController.createCarousel
);

export const CarouselRoutes = router;
