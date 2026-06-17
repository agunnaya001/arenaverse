import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { BattleRecord, Error, Fighter, GetBattleHistoryParams, GetLeaderboardParams, HealthStatus, LeaderboardEntry, PlayerStats, RecordBattleRequest } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * Returns top players ranked by wins
 * @summary Get leaderboard
 */
export declare const getGetLeaderboardUrl: (params?: GetLeaderboardParams) => string;
export declare const getLeaderboard: (params?: GetLeaderboardParams, options?: RequestInit) => Promise<LeaderboardEntry[]>;
export declare const getGetLeaderboardQueryKey: (params?: GetLeaderboardParams) => readonly ["/api/leaderboard", ...GetLeaderboardParams[]];
export declare const getGetLeaderboardQueryOptions: <TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeaderboardQueryResult = NonNullable<Awaited<ReturnType<typeof getLeaderboard>>>;
export type GetLeaderboardQueryError = ErrorType<unknown>;
/**
 * @summary Get leaderboard
 */
export declare function useGetLeaderboard<TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get player stats
 */
export declare const getGetPlayerStatsUrl: (address: string) => string;
export declare const getPlayerStats: (address: string, options?: RequestInit) => Promise<PlayerStats>;
export declare const getGetPlayerStatsQueryKey: (address: string) => readonly [`/api/leaderboard/player/${string}`];
export declare const getGetPlayerStatsQueryOptions: <TData = Awaited<ReturnType<typeof getPlayerStats>>, TError = ErrorType<Error>>(address: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlayerStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPlayerStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPlayerStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getPlayerStats>>>;
export type GetPlayerStatsQueryError = ErrorType<Error>;
/**
 * @summary Get player stats
 */
export declare function useGetPlayerStats<TData = Awaited<ReturnType<typeof getPlayerStats>>, TError = ErrorType<Error>>(address: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlayerStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recent battle history
 */
export declare const getGetBattleHistoryUrl: (params?: GetBattleHistoryParams) => string;
export declare const getBattleHistory: (params?: GetBattleHistoryParams, options?: RequestInit) => Promise<BattleRecord[]>;
export declare const getGetBattleHistoryQueryKey: (params?: GetBattleHistoryParams) => readonly ["/api/battles", ...GetBattleHistoryParams[]];
export declare const getGetBattleHistoryQueryOptions: <TData = Awaited<ReturnType<typeof getBattleHistory>>, TError = ErrorType<unknown>>(params?: GetBattleHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBattleHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBattleHistory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBattleHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof getBattleHistory>>>;
export type GetBattleHistoryQueryError = ErrorType<unknown>;
/**
 * @summary Get recent battle history
 */
export declare function useGetBattleHistory<TData = Awaited<ReturnType<typeof getBattleHistory>>, TError = ErrorType<unknown>>(params?: GetBattleHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBattleHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Record a battle result
 */
export declare const getRecordBattleUrl: () => string;
export declare const recordBattle: (recordBattleRequest: RecordBattleRequest, options?: RequestInit) => Promise<BattleRecord>;
export declare const getRecordBattleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordBattle>>, TError, {
        data: BodyType<RecordBattleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof recordBattle>>, TError, {
    data: BodyType<RecordBattleRequest>;
}, TContext>;
export type RecordBattleMutationResult = NonNullable<Awaited<ReturnType<typeof recordBattle>>>;
export type RecordBattleMutationBody = BodyType<RecordBattleRequest>;
export type RecordBattleMutationError = ErrorType<unknown>;
/**
 * @summary Record a battle result
 */
export declare const useRecordBattle: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordBattle>>, TError, {
        data: BodyType<RecordBattleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof recordBattle>>, TError, {
    data: BodyType<RecordBattleRequest>;
}, TContext>;
/**
 * @summary Get fighters for a player address
 */
export declare const getGetPlayerFightersUrl: (address: string) => string;
export declare const getPlayerFighters: (address: string, options?: RequestInit) => Promise<Fighter[]>;
export declare const getGetPlayerFightersQueryKey: (address: string) => readonly [`/api/fighters/${string}`];
export declare const getGetPlayerFightersQueryOptions: <TData = Awaited<ReturnType<typeof getPlayerFighters>>, TError = ErrorType<unknown>>(address: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlayerFighters>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPlayerFighters>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPlayerFightersQueryResult = NonNullable<Awaited<ReturnType<typeof getPlayerFighters>>>;
export type GetPlayerFightersQueryError = ErrorType<unknown>;
/**
 * @summary Get fighters for a player address
 */
export declare function useGetPlayerFighters<TData = Awaited<ReturnType<typeof getPlayerFighters>>, TError = ErrorType<unknown>>(address: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlayerFighters>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map