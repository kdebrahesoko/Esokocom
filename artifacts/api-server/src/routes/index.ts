import { Router, type IRouter } from "express";
import healthRouter from "./health";
import submissionsRouter from "./submissions";
import farmDataRouter from "./farm-data";
import jobsRouter from "./jobs";
import storageRouter from "./storage";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(submissionsRouter);
router.use(farmDataRouter);
router.use(jobsRouter);
router.use(storageRouter);

export default router;
