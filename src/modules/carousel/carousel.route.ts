import express, { NextFunction, Request, Response } from "express";
import auth from "../../app/middleware/auth";
import { upload } from "../../app/utils/sendImageToCloudinary";
import { USER_ROLE } from "../user-auth/user_auth.constant";
import { CarouselController } from "./carousel.controller";
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post(
  "/create-carousel",
  auth(USER_ROLE.admin),
  (req: Request, res: Response, next: NextFunction) => {
    const folderName = "uploads";
    // Create the full path to the folder
    const folderPath = path.join(process.cwd(), folderName);

    // Create the folder if it doesn't already exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Proceed to the next middleware
    next();
  },

  upload.array("file"),

  CarouselController.createCarousel
);

router.get("/get-carousel", CarouselController.getCarousel);

export const CarouselRoutes = router;
