import express from "express";
import { TestControllers } from ".";

const router = express.Router();

router.get("/generate-file", TestControllers.generateBooks);

export const TestRoutes = router;
