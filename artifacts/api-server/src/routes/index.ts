import { Router, type IRouter } from "express";
import healthRouter from "./health";
import submissionsRouter from "./submissions";
import farmDataRouter from "./farm-data";
import jobsRouter from "./jobs";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(submissionsRouter);
router.use(farmDataRouter);
router.use(jobsRouter);
router.use(storageRouter);

export default router;
