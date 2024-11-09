import { RequestHandler, Router } from "express";
import { register, confirmEmail, login } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register as unknown as RequestHandler);
router.get("/confirm/:token", confirmEmail as unknown as RequestHandler);
router.post("/login", login as unknown as RequestHandler);

export default router;
