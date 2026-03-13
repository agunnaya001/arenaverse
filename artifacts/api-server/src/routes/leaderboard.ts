import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/leaderboard
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);

    const players = await db
      .select()
      .from(playersTable)
      .orderBy(desc(playersTable.wins), desc(playersTable.totalBattles))
      .limit(limit);

    const leaderboard = players.map((player, index) => ({
      rank: index + 1,
      address: player.address,
      wins: player.wins,
      losses: player.losses,
      totalBattles: player.totalBattles,
      winRate: player.totalBattles > 0 ? Math.round((player.wins / player.totalBattles) * 100) / 100 : 0,
      tokensEarned: player.tokensEarned,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

// GET /api/leaderboard/player/:address
router.get("/player/:address", async (req, res) => {
  try {
    const { address } = req.params;

    const [player] = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.address, address.toLowerCase()))
      .limit(1);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Get rank
    const rankResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(playersTable)
      .where(sql`${playersTable.wins} > ${player.wins} OR (${playersTable.wins} = ${player.wins} AND ${playersTable.totalBattles} > ${player.totalBattles})`);

    const rank = (rankResult[0]?.count ?? 0) + 1;

    res.json({
      address: player.address,
      wins: player.wins,
      losses: player.losses,
      totalBattles: player.totalBattles,
      winRate: player.totalBattles > 0 ? Math.round((player.wins / player.totalBattles) * 100) / 100 : 0,
      tokensEarned: player.tokensEarned,
      rank,
    });
  } catch (err) {
    console.error("Player stats error:", err);
    res.status(500).json({ message: "Failed to fetch player stats" });
  }
});

export default router;
