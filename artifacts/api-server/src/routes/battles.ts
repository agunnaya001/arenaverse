import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { battlesTable, playersTable } from "@workspace/db";
import { eq, desc, or, sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/battles
router.get("/", async (req, res) => {
  try {
    const { address } = req.query;
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    let query = db.select().from(battlesTable).orderBy(desc(battlesTable.timestamp)).limit(limit);

    if (address && typeof address === "string") {
      const addr = address.toLowerCase();
      const battles = await db
        .select()
        .from(battlesTable)
        .where(
          or(
            eq(battlesTable.playerAddress, addr),
            eq(battlesTable.opponentAddress, addr)
          )
        )
        .orderBy(desc(battlesTable.timestamp))
        .limit(limit);

      return res.json(battles);
    }

    const battles = await query;
    res.json(battles);
  } catch (err) {
    console.error("Battles fetch error:", err);
    res.status(500).json({ message: "Failed to fetch battles" });
  }
});

// POST /api/battles
router.post("/", async (req, res) => {
  try {
    const {
      txHash,
      playerAddress,
      opponentAddress,
      winner,
      playerFighterId,
      opponentFighterId,
      tokensStaked,
      tokensRewarded,
    } = req.body;

    if (!txHash || !playerAddress || !opponentAddress || !winner) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const playerAddr = playerAddress.toLowerCase();
    const opponentAddr = opponentAddress.toLowerCase();
    const winnerAddr = winner.toLowerCase();

    // Insert battle record
    const [battle] = await db
      .insert(battlesTable)
      .values({
        txHash,
        playerAddress: playerAddr,
        opponentAddress: opponentAddr,
        winner: winnerAddr,
        playerFighterId: Number(playerFighterId),
        opponentFighterId: Number(opponentFighterId),
        tokensStaked: String(tokensStaked),
        tokensRewarded: String(tokensRewarded),
      })
      .returning();

    // Upsert player stats
    await upsertPlayerStats(playerAddr, winnerAddr === playerAddr, tokensRewarded);
    await upsertPlayerStats(opponentAddr, winnerAddr === opponentAddr, winnerAddr === opponentAddr ? tokensRewarded : "0");

    res.status(201).json(battle);
  } catch (err: any) {
    if (err.code === "23505") {
      // Duplicate tx hash
      return res.status(409).json({ message: "Battle already recorded" });
    }
    console.error("Battle record error:", err);
    res.status(500).json({ message: "Failed to record battle" });
  }
});

async function upsertPlayerStats(address: string, won: boolean, tokensRewarded: string) {
  const [existing] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.address, address))
    .limit(1);

  if (existing) {
    await db
      .update(playersTable)
      .set({
        wins: won ? existing.wins + 1 : existing.wins,
        losses: won ? existing.losses : existing.losses + 1,
        totalBattles: existing.totalBattles + 1,
        tokensEarned: won
          ? String(BigInt(existing.tokensEarned) + BigInt(tokensRewarded))
          : existing.tokensEarned,
        updatedAt: new Date(),
      })
      .where(eq(playersTable.address, address));
  } else {
    await db.insert(playersTable).values({
      address,
      wins: won ? 1 : 0,
      losses: won ? 0 : 1,
      totalBattles: 1,
      tokensEarned: won ? String(tokensRewarded) : "0",
    });
  }
}

export default router;
