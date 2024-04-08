import { Router } from "express";
import routerUsers from "./users.route.ts";
import { HomeController } from "../controllers/home.controller.ts";

const router = Router();

router.get("/", HomeController.get);

router.use("/users", routerUsers);

export default router;
