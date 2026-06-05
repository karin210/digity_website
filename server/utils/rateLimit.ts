import type { H3Event } from "h3";
import { getRequestIP, createError } from "h3";

interface RateLimitConfig {
  /** Maximum number of requests allowed within the window. */
  limit: number;
  /** Length of the rolling window, in milliseconds. */
  windowMs: number;
}

interface RequestRecord {
  count: number;
  /** Timestamp (ms) at which the current window expires. */
  expiresAt: number;
}

/**
 * In-memory store of request counts keyed by client identifier.
 * Suitable for a single-instance deployment; swap for a shared store
 * (e.g. Redis) if the app is scaled horizontally.
 */
const requestStore = new Map<string, RequestRecord>();

/**
 * Enforces a per-client rate limit for the given event. Throws a 429 error
 * once a client exceeds `limit` requests within `windowMs`. Returns the
 * number of requests remaining in the current window.
 */
export function enforceRateLimit(
  event: H3Event,
  config: RateLimitConfig,
): number {
  const clientId =
    getRequestIP(event, { xForwardedFor: true }) ?? "unknown-client";
  const now = Date.now();

  const record = requestStore.get(clientId);

  if (!record || now > record.expiresAt) {
    requestStore.set(clientId, {
      count: 1,
      expiresAt: now + config.windowMs,
    });
    return config.limit - 1;
  }

  if (record.count >= config.limit) {
    const retryAfterSeconds = Math.ceil((record.expiresAt - now) / 1000);
    throw createError({
      statusCode: 429,
      statusMessage: `Has alcanzado el límite de mensajes. Intenta de nuevo en ${retryAfterSeconds} segundos.`,
      data: { retryAfterSeconds },
    });
  }

  record.count += 1;
  return config.limit - record.count;
}
