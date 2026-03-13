import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leaderboardRouter from "./leaderboard";
import battlesRouter from "./battles";
import fightersRouter from "./fighters";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/battles", battlesRouter);
router.use("/fighters", fightersRouter);

export default router;
