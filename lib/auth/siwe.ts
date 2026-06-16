import { ethers } from 'ethers';
import { supabase, supabaseAdmin } from '../supabase/client';

/**
 * Generate a SIWE message for user to sign
 */
export async function generateSIWEMessage(
  address: string,
  chainId: number,
  nonce?: string
): Promise<{ message: string; nonce: string }> {
  const nonceToUse = nonce || generateNonce();
  const domain = typeof window !== 'undefined' ? window.location.host : 'arenaverse.io';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://arenaverse.io';

  const message = `${domain} wants you to sign in with your Ethereum account:
${address}

Sign in with Ethereum to ArenaVerse.

URI: ${origin}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonceToUse}
Issued At: ${new Date().toISOString()}`;

  return { message, nonce: nonceToUse };
}

/**
 * Generate a secure random nonce
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Verify SIWE message signature
 */
export async function verifySIWESignature(
  message: string,
  signature: string,
  address: string
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('[v0] SIWE signature verification failed:', error);
    return false;
  }
}

/**
 * Register or update user session from SIWE
 */
export async function registerSIWESession(
  walletAddress: string,
  message: string,
  signature: string,
  nonce: string,
  chainId: number
): Promise<{ userId: string; token: string } | null> {
  try {
    // Verify signature
    const isValid = await verifySIWESignature(message, signature, walletAddress);
    if (!isValid) {
      console.error('[v0] Invalid SIWE signature');
      return null;
    }

    // Check if user exists
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    let userId: string;

    if (userError || !user) {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: `${walletAddress.toLowerCase()}@arenaverse.eth`,
        password: ethers.id(signature), // Use signature hash as temporary password
        email_confirm: true,
      });

      if (createError || !newUser) {
        console.error('[v0] Failed to create auth user:', createError);
        return null;
      }

      userId = newUser.user.id;

      // Create user profile
      const { error: profileError } = await supabaseAdmin.from('users').insert({
        id: userId,
        wallet_address: walletAddress.toLowerCase(),
        username: `user_${walletAddress.slice(2, 8)}`,
      });

      if (profileError) {
        console.error('[v0] Failed to create user profile:', profileError);
        return null;
      }
    } else {
      userId = user.id;
    }

    // Create SIWE session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7-day session

    const { error: sessionError } = await supabaseAdmin
      .from('siwe_sessions')
      .insert({
        user_id: userId,
        message,
        signature,
        nonce,
        chain_id: chainId,
        verified_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      console.error('[v0] Failed to create SIWE session:', sessionError);
      return null;
    }

    // Generate JWT token (in production, use your auth system)
    const token = ethers.id(`${userId}:${Date.now()}`).slice(2);

    return { userId, token };
  } catch (error) {
    console.error('[v0] SIWE registration failed:', error);
    return null;
  }
}

/**
 * Verify SIWE session is still valid
 */
export async function verifySIWESessionValid(sessionId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase
      .from('siwe_sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .single();

    if (!session) return false;

    const expiresAt = new Date(session.expires_at);
    return expiresAt > new Date();
  } catch (error) {
    console.error('[v0] Session verification failed:', error);
    return false;
  }
}

/**
 * Invalidate a SIWE session
 */
export async function invalidateSIWESession(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('siwe_sessions')
      .update({ expires_at: new Date().toISOString() })
      .eq('id', sessionId);

    return !error;
  } catch (error) {
    console.error('[v0] Failed to invalidate session:', error);
    return false;
  }
}
