import { Router } from "express";
import { signInUser, signupUser } from "../controllers/auth.controllers";
import { verifyToken } from "../middleware/verifyToken.middleware";

const authRouter: Router = Router();

authRouter.post("/signup", signupUser);
authRouter.post("/signin", verifyToken, signInUser);

export default authRouter;
