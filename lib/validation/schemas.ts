import { z } from 'zod';

// Auth schemas
export const SIWEMessageRequestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chainId: z.number().int().positive(),
  nonce: z.string().min(1),
});

export const SIWEVerifySchema = z.object({
  message: z.string().min(1),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format'),
  nonce: z.string().min(1),
});

// Battle schemas
export const StartBattleSchema = z.object({
  championId: z.string().uuid(),
  difficulty: z.enum(['Novice', 'Intermediate', 'Advanced', 'Expert']),
  opponentType: z.enum(['AI', 'Player']).optional(),
});

export const BattleResultSchema = z.object({
  battleId: z.string().uuid(),
  playerChampionId: z.string().uuid(),
  opponentChampionId: z.string().uuid(),
  winnerId: z.string().uuid(),
  xpGained: z.number().int().positive(),
  tokensGained: z.number().int().nonnegative(),
  isDraw: z.boolean().optional(),
});

// Quest schemas
export const QuestProgressSchema = z.object({
  questId: z.string().uuid(),
  progress: z.number().int().nonnegative(),
  completed: z.boolean().optional(),
});

// Reward schemas
export const ClaimRewardSchema = z.object({
  questId: z.string().uuid().optional(),
  rewardType: z.enum(['Battle', 'Quest', 'Staking', 'Achievement', 'Referral']),
});

// AI Studio schemas
export const GenerateContractSchema = z.object({
  type: z.enum(['ERC20', 'ERC721', 'ERC1155', 'DAO', 'Staking']),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const GenerateNFTMetadataSchema = z.object({
  name: z.string().min(1).max(100),
  supply: z.number().int().positive(),
  rarity: z.enum(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']).optional(),
});

export const CalculateTokenomicsSchema = z.object({
  totalSupply: z.number().int().positive(),
  vestingMonths: z.number().int().positive().default(12),
  initialPrice: z.number().positive().optional(),
});

// Launchpad schemas
export const DeployContractSchema = z.object({
  contractCode: z.string().min(1),
  contractType: z.enum(['ERC20', 'ERC721', 'ERC1155', 'DAO', 'Staking']),
  contractName: z.string().min(1).max(100),
  chainId: z.number().int().positive(),
});

// Guild schemas
export const CreateGuildSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  logo_url: z.string().url().optional(),
});

export const JoinGuildSchema = z.object({
  guildId: z.string().uuid(),
});

// Tournament schemas
export const JoinTournamentSchema = z.object({
  tournamentId: z.string().uuid(),
  championId: z.string().uuid(),
});

// Marketplace schemas
export const SubscribeAgentSchema = z.object({
  agentId: z.string().uuid(),
  tier: z.enum(['Free', 'Basic', 'Pro', 'Enterprise']),
});

export const ExecuteAgentSchema = z.object({
  agentId: z.string().uuid(),
  payload: z.record(z.any()).optional(),
});

// Referral schemas
export const CreateReferralSchema = z.object({
  referredAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

// Social schemas
export const UpdateProfileSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  profilePictureUrl: z.string().url().optional(),
});

// Type inference
export type SIWEMessageRequest = z.infer<typeof SIWEMessageRequestSchema>;
export type SIWEVerify = z.infer<typeof SIWEVerifySchema>;
export type StartBattle = z.infer<typeof StartBattleSchema>;
export type BattleResult = z.infer<typeof BattleResultSchema>;
export type QuestProgress = z.infer<typeof QuestProgressSchema>;
export type ClaimReward = z.infer<typeof ClaimRewardSchema>;
export type GenerateContract = z.infer<typeof GenerateContractSchema>;
export type GenerateNFTMetadata = z.infer<typeof GenerateNFTMetadataSchema>;
export type CalculateTokenomics = z.infer<typeof CalculateTokenomicsSchema>;
export type DeployContract = z.infer<typeof DeployContractSchema>;
export type CreateGuild = z.infer<typeof CreateGuildSchema>;
export type JoinGuild = z.infer<typeof JoinGuildSchema>;
export type JoinTournament = z.infer<typeof JoinTournamentSchema>;
export type SubscribeAgent = z.infer<typeof SubscribeAgentSchema>;
export type ExecuteAgent = z.infer<typeof ExecuteAgentSchema>;
export type CreateReferral = z.infer<typeof CreateReferralSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
