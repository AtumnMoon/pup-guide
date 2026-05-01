export function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "") +
    crypto.randomUUID().replace(/-/g, "");
}
