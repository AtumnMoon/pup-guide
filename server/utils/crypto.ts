import { argon2id, argon2Verify } from "hash-wasm";

const PEPPER = Deno.env.get("APP_PEPPER") ?? "";

if (!PEPPER) {
  console.warn("Warning: APP_PEPPER is not set!");
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2id({
    password: password + PEPPER,
    salt: crypto.getRandomValues(new Uint8Array(16)),
    parallelism: 2,
    iterations: 3,
    memorySize: 65536, // 64 MB
    hashLength: 32,
    outputType: "encoded", // produces the $argon2id$... string
  });
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await argon2Verify({
    password: password + PEPPER,
    hash,
  });
}
