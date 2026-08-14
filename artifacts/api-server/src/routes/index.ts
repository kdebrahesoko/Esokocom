import { Router, type IRouter } from "express";
import healthRouter from "./health";
import submissionsRouter from "./submissions";
import farmDataRouter from "./farm-data";
import jobsRouter from "./jobs";
import storageRouter from "./storage";
import authRouter from "./auth";
import resourcesRouter from "./resources";
import adminStatsRouter from "./adminStats";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(submissionsRouter);
router.use(farmDataRouter);
router.use(jobsRouter);
router.use(storageRouter);
router.use(resourcesRouter);
router.use(adminStatsRouter);

export default router;
