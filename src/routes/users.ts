import { Router } from "express";
import { UsersControllers } from "../controllers/users.controller.js";

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", UsersControllers.get);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/:id", UsersControllers.getOne);

export default router;
