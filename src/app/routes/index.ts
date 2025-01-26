import { Router } from "express";
import { UserRoutes } from "../../modules/user-auth/user_auth.route";
import { BookRoutes } from "../../modules/book/book.route";
import { TestRoutes } from "../../modules/delete-this-folder/test.route";
import { CarouselRoutes } from "../../modules/carousel/carousel.route";
import { OrderRoutes } from "../../modules/order/order.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/products",
    route: BookRoutes,
  },
  {
    path: "/test",
    route: TestRoutes,
  },
  {
    path: "/carousel",
    route: CarouselRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
