import { Router, type IRouter } from "express";
import healthRouter from "./health";
import submissionsRouter from "./submissions";
import farmDataRouter from "./farm-data";

const router: IRouter = Router();

router.use(healthRouter);
router.use(submissionsRouter);
router.use(farmDataRouter);

export default router;
