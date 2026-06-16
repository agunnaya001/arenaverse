import { supabaseAdmin } from '../supabase/client';
import { CONTRACTS } from '../contracts';

export interface BlockchainEventData {
  eventType: string;
  contractAddress: string;
  transactionHash?: string;
  blockNumber?: number;
  logIndex?: number;
  data: any;
}

/**
 * Track a blockchain event
 */
export async function trackBlockchainEvent(event: BlockchainEventData): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('blockchain_events')
      .insert({
        event_type: event.eventType,
        contract_address: event.contractAddress.toLowerCase(),
        transaction_hash: event.transactionHash,
        block_number: event.blockNumber,
        log_index: event.logIndex,
        data: event.data,
        processed: false,
      });

    if (error) {
      console.error('[v0] Failed to track event:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[v0] Event tracking failed:', error);
    return false;
  }
}

/**
 * Track NFT mint event
 */
export async function trackNFTMint(
  contractAddress: string,
  tokenId: string,
  owner: string,
  transactionHash: string,
  metadata?: any
): Promise<boolean> {
  return trackBlockchainEvent({
    eventType: 'NFTMinted',
    contractAddress,
    transactionHash,
    data: {
      tokenId,
      owner: owner.toLowerCase(),
      metadata,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track battle completion event
 */
export async function trackBattleCompleted(
  battleId: string,
  player1: string,
  player2: string,
  winner: string,
  wager?: string,
  transactionHash?: string
): Promise<boolean> {
  return trackBlockchainEvent({
    eventType: 'BattleCompleted',
    contractAddress: CONTRACTS.ARENA_BATTLE,
    transactionHash,
    data: {
      battleId,
      player1: player1.toLowerCase(),
      player2: player2.toLowerCase(),
      winner: winner.toLowerCase(),
      wager,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track token transfer event
 */
export async function trackTokenTransfer(
  from: string,
  to: string,
  amount: string,
  transactionHash: string
): Promise<boolean> {
  return trackBlockchainEvent({
    eventType: 'TokenTransfer',
    contractAddress: CONTRACTS.ARENA_TOKEN,
    transactionHash,
    data: {
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track staking event
 */
export async function trackStakingEvent(
  userId: string,
  championId: string,
  amount: string,
  eventType: 'Staked' | 'Unstaked',
  transactionHash?: string
): Promise<boolean> {
  return trackBlockchainEvent({
    eventType: `Staking${eventType}`,
    contractAddress: CONTRACTS.ARENA_BATTLE,
    transactionHash,
    data: {
      userId,
      championId,
      amount,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Get pending events to process
 */
export async function getPendingEvents(limit: number = 100): Promise<any[]> {
  try {
    const { data: events } = await supabaseAdmin
      .from('blockchain_events')
      .select('*')
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(limit);

    return events || [];
  } catch (error) {
    console.error('[v0] Failed to fetch pending events:', error);
    return [];
  }
}

/**
 * Mark event as processed
 */
export async function markEventProcessed(eventId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('blockchain_events')
      .update({ processed: true })
      .eq('id', eventId);

    return !error;
  } catch (error) {
    console.error('[v0] Failed to mark event as processed:', error);
    return false;
  }
}

/**
 * Process blockchain events in batch
 */
export async function processPendingEvents(): Promise<number> {
  try {
    const events = await getPendingEvents(100);
    let processed = 0;

    for (const event of events) {
      try {
        // Process based on event type
        switch (event.event_type) {
          case 'NFTMinted':
            await processNFTMint(event);
            break;
          case 'BattleCompleted':
            await processBattleCompletion(event);
            break;
          case 'TokenTransfer':
            await processTokenTransfer(event);
            break;
          case 'StakingStaked':
          case 'StakingUnstaked':
            await processStakingEvent(event);
            break;
          default:
            console.warn(`[v0] Unknown event type: ${event.event_type}`);
        }

        await markEventProcessed(event.id);
        processed++;
      } catch (error) {
        console.error(`[v0] Failed to process event ${event.id}:`, error);
      }
    }

    return processed;
  } catch (error) {
    console.error('[v0] Event processing failed:', error);
    return 0;
  }
}

/**
 * Process individual event types
 */
async function processNFTMint(event: any): Promise<void> {
  const { data } = event;
  // Handle NFT minting logic
  console.log('[v0] Processing NFT mint:', data.tokenId);
}

async function processBattleCompletion(event: any): Promise<void> {
  const { data } = event;
  // Handle battle completion logic
  console.log('[v0] Processing battle completion:', data.battleId);
}

async function processTokenTransfer(event: any): Promise<void> {
  const { data } = event;
  // Handle token transfer logic
  console.log('[v0] Processing token transfer:', data.from, '->', data.to);
}

async function processStakingEvent(event: any): Promise<void> {
  const { data, event_type } = event;
  // Handle staking logic
  console.log(`[v0] Processing staking event (${event_type}):`, data.userId);
}
