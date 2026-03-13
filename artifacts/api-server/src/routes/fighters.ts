import { Router, type IRouter } from "express";

const router: IRouter = Router();

// GET /api/fighters/:address
// This endpoint provides fighter metadata from on-chain data
// For a real app, you'd call the blockchain or an indexer here
// We return mock fighter structure that the frontend augments with on-chain data
router.get("/:address", async (req, res) => {
  try {
    const { address } = req.params;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ message: "Invalid address" });
    }

    // The frontend reads fighters directly from the blockchain via wagmi
    // This endpoint serves as a fallback/cache for NFT metadata
    // Return empty array — frontend handles on-chain data
    res.json([]);
  } catch (err) {
    console.error("Fighters fetch error:", err);
    res.status(500).json({ message: "Failed to fetch fighters" });
  }
});

export default router;
