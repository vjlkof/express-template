import { Router } from "express";
import routerUsers from "./users.route.ts";

const router = Router();

router.get("/", (req, res, next) => {
  res.send("Home page");
  next();
});

router.get("/crash", (req, res) => {
  res.send("Crashing server!");
  process.exit(1);
});

router.use("/users", routerUsers);

export default router;
