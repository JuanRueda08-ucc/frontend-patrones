const TOKEN_LIMITS: Record<string, number | null> = {
  FREE: 50_000,
  PRO: 500_000,
  ENTERPRISE: null,
};

export function getTokenLimit(plan: string): number | null {
  return TOKEN_LIMITS[plan] ?? null;
}

export function isUnlimited(plan: string): boolean {
  return TOKEN_LIMITS[plan] === null;
}
