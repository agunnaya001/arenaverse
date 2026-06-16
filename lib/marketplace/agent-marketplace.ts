import { supabaseAdmin, supabase } from '../supabase/client';

export type AgentCategory = 'Trading' | 'Gaming' | 'Analytics' | 'Automation' | 'Social' | 'Finance' | 'Utility';
export type PricingTier = 'Free' | 'Basic' | 'Pro' | 'Enterprise';
export type SubscriptionStatus = 'Active' | 'Paused' | 'Cancelled';
export type ExecutionStatus = 'Success' | 'Failed' | 'Pending';

export interface Agent {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  category: AgentCategory;
  tags: string[];
  logo_url?: string;
  webhook_url: string;
  pricing_tier: PricingTier;
  pricing_amount?: number;
  active: boolean;
  total_executions: number;
  average_rating: number;
  rating_count: number;
  monthly_active_users: number;
  created_at: string;
  updated_at: string;
}

export interface AgentReview {
  id: string;
  agent_id: string;
  user_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

export interface AgentSubscription {
  id: string;
  user_id: string;
  agent_id: string;
  tier: PricingTier;
  status: SubscriptionStatus;
  start_date: string;
  end_date?: string;
  executions_used: number;
  executions_limit: number; // -1 = unlimited
  next_billing_date?: string;
  created_at: string;
}

export interface AgentExecution {
  id: string;
  user_id: string;
  agent_id: string;
  webhook_payload: any;
  webhook_response: any;
  status: ExecutionStatus;
  error_message?: string;
  execution_time_ms: number;
  created_at: string;
}

/**
 * Create new agent
 */
export async function createAgent(
  creatorId: string,
  name: string,
  description: string,
  category: AgentCategory,
  webhookUrl: string,
  pricingTier: PricingTier,
  pricingAmount?: number
): Promise<Agent | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('agents')
      .insert({
        creator_id: creatorId,
        name,
        description,
        category,
        tags: [],
        webhook_url: webhookUrl,
        pricing_tier: pricingTier,
        pricing_amount: pricingAmount,
        active: true,
      })
      .select();

    if (error || !data) {
      console.error('[v0] Agent creation failed:', error);
      return null;
    }

    return data[0] as Agent;
  } catch (error) {
    console.error('[v0] Error creating agent:', error);
    return null;
  }
}

/**
 * Get agent by ID
 */
export async function getAgent(agentId: string): Promise<Agent | null> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Agent;
  } catch (error) {
    console.error('[v0] Error getting agent:', error);
    return null;
  }
}

/**
 * Search agents
 */
export async function searchAgents(
  query?: string,
  category?: AgentCategory,
  limit: number = 50,
  offset: number = 0
): Promise<Agent[]> {
  try {
    let queryBuilder = supabase
      .from('agents')
      .select('*')
      .eq('active', true)
      .order('total_executions', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder.range(offset, offset + limit - 1);

    if (error) {
      console.error('[v0] Agent search failed:', error);
      return [];
    }

    return data as Agent[];
  } catch (error) {
    console.error('[v0] Error searching agents:', error);
    return [];
  }
}

/**
 * Subscribe to agent
 */
export async function subscribeToAgent(
  userId: string,
  agentId: string,
  tier: PricingTier
): Promise<AgentSubscription | null> {
  try {
    // Check if already subscribed
    const { data: existing } = await supabase
      .from('agent_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .single();

    if (existing) {
      return null; // Already subscribed
    }

    const now = new Date();
    const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const { data, error } = await supabaseAdmin
      .from('agent_subscriptions')
      .insert({
        user_id: userId,
        agent_id: agentId,
        tier,
        status: 'Active',
        start_date: now.toISOString(),
        executions_used: 0,
        executions_limit: tier === 'Free' ? 100 : tier === 'Basic' ? 1000 : -1, // Unlimited for Pro/Enterprise
        next_billing_date: nextBilling.toISOString(),
      })
      .select();

    if (error || !data) {
      console.error('[v0] Subscription creation failed:', error);
      return null;
    }

    return data[0] as AgentSubscription;
  } catch (error) {
    console.error('[v0] Error subscribing to agent:', error);
    return null;
  }
}

/**
 * Execute agent
 */
export async function executeAgent(
  userId: string,
  agentId: string,
  payload: any
): Promise<AgentExecution | null> {
  try {
    // Check subscription
    const { data: subscription } = await supabase
      .from('agent_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .eq('status', 'Active')
      .single();

    if (!subscription) {
      throw new Error('No active subscription for this agent');
    }

    // Check execution limit
    if (subscription.executions_limit > 0 && subscription.executions_used >= subscription.executions_limit) {
      throw new Error('Execution limit reached');
    }

    // Get agent webhook
    const { data: agent } = await supabase
      .from('agents')
      .select('webhook_url')
      .eq('id', agentId)
      .single();

    if (!agent) {
      throw new Error('Agent not found');
    }

    // Call webhook
    const startTime = Date.now();
    let response: any;
    let status: ExecutionStatus = 'Pending';
    let error: string | undefined;

    try {
      const webhookResponse = await fetch(agent.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
          'X-Agent-ID': agentId,
        },
        body: JSON.stringify(payload),
      });

      response = await webhookResponse.json();
      status = webhookResponse.ok ? 'Success' : 'Failed';

      if (!webhookResponse.ok) {
        error = response.error || 'Webhook request failed';
      }
    } catch (err: any) {
      status = 'Failed';
      error = err.message;
    }

    const executionTime = Date.now() - startTime;

    // Log execution
    const { data: execution, error: logError } = await supabaseAdmin
      .from('agent_executions')
      .insert({
        user_id: userId,
        agent_id: agentId,
        webhook_payload: payload,
        webhook_response: response,
        status,
        error_message: error,
        execution_time_ms: executionTime,
      })
      .select();

    if (logError) {
      console.error('[v0] Execution logging failed:', logError);
    }

    // Update subscription executions
    await supabaseAdmin
      .from('agent_subscriptions')
      .update({ executions_used: subscription.executions_used + 1 })
      .eq('id', subscription.id);

    return execution?.[0] as AgentExecution;
  } catch (error) {
    console.error('[v0] Agent execution failed:', error);
    return null;
  }
}

/**
 * Add review to agent
 */
export async function addAgentReview(
  userId: string,
  agentId: string,
  rating: number,
  review?: string
): Promise<AgentReview | null> {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Upsert review
    const { data, error } = await supabaseAdmin
      .from('agent_reviews')
      .upsert(
        {
          agent_id: agentId,
          user_id: userId,
          rating,
          review,
        },
        { onConflict: 'agent_id,user_id' }
      )
      .select();

    if (error || !data) {
      console.error('[v0] Review creation failed:', error);
      return null;
    }

    // Update agent average rating
    const { data: reviews } = await supabase
      .from('agent_reviews')
      .select('rating')
      .eq('agent_id', agentId);

    if (reviews) {
      const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2);

      await supabaseAdmin
        .from('agents')
        .update({
          average_rating: parseFloat(avgRating),
          rating_count: reviews.length,
        })
        .eq('id', agentId);
    }

    return data[0] as AgentReview;
  } catch (error) {
    console.error('[v0] Error adding review:', error);
    return null;
  }
}

/**
 * Get agent analytics
 */
export async function getAgentAnalytics(agentId: string) {
  try {
    const { data: executions } = await supabase
      .from('agent_executions')
      .select('*')
      .eq('agent_id', agentId);

    const { data: subscriptions } = await supabase
      .from('agent_subscriptions')
      .select('*')
      .eq('agent_id', agentId)
      .eq('status', 'Active');

    if (!executions || !subscriptions) {
      return null;
    }

    const successful = executions.filter((e) => e.status === 'Success').length;
    const failed = executions.filter((e) => e.status === 'Failed').length;
    const avgExecutionTime = executions.length > 0
      ? executions.reduce((sum, e) => sum + (e.execution_time_ms || 0), 0) / executions.length
      : 0;

    return {
      totalExecutions: executions.length,
      successfulExecutions: successful,
      failedExecutions: failed,
      successRate: executions.length > 0 ? ((successful / executions.length) * 100).toFixed(2) : 0,
      avgExecutionTime: avgExecutionTime.toFixed(0),
      activeSubscriptions: subscriptions.length,
      monthlyActiveUsers: subscriptions.length,
    };
  } catch (error) {
    console.error('[v0] Error getting agent analytics:', error);
    return null;
  }
}
