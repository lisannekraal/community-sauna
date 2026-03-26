type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 10 * 60 * 1000);

export function rateLimit(
  ip: string,
  endpoint: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfter: number } {
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true, retryAfter: 0 };
  }
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',');
    // Take the last entry: HAProxy appends the real client IP, making it the only trustworthy value — earlier entries are client-controlled.
    return ips[ips.length - 1].trim();
  }
  return 'unknown';
}
