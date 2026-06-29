const ALG = "HS256";

function base64urlEncode(input: Uint8Array | string) {
  let b: string;
  if (typeof input === "string") b = Buffer.from(input).toString("base64");
  else b = Buffer.from(input).toString("base64");
  return b.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64urlDecodeToBuffer(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64");
}

function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.ADMIN_SECRET || "dev_secret";
}

export function signJwt(payload: Record<string, any>, opts: { expiresIn?: number } = {}) {
  const header = { alg: ALG, typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const exp = opts.expiresIn ? now + opts.expiresIn : now + 60 * 60 * 24;
  const body = { ...payload, iat: now, exp };

  const headerB = Buffer.from(JSON.stringify(header));
  const bodyB = Buffer.from(JSON.stringify(body));

  const unsigned = `${base64urlEncode(headerB)}.${base64urlEncode(bodyB)}`;
  const secret = getJwtSecret();

  const nodeCrypto = require("crypto");
  const sig = nodeCrypto.createHmac("sha256", secret).update(unsigned).digest();
  return `${unsigned}.${base64urlEncode(sig)}`;
}

export function verifyJwtSync(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, b, s] = parts;
    const unsigned = `${h}.${b}`;
    const secret = getJwtSecret();
    const sigBuf = base64urlDecodeToBuffer(s);

    const nodeCrypto = require("crypto");
    const expected = nodeCrypto.createHmac("sha256", secret).update(unsigned).digest();

    if (expected.length !== sigBuf.length || !nodeCrypto.timingSafeEqual(expected, sigBuf)) {
      return null;
    }

    const payload = JSON.parse(base64urlDecodeToBuffer(b).toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function verifyJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const unsigned = `${h}.${b}`;
  const secret = getJwtSecret();
  const sigBuf = base64urlDecodeToBuffer(s);

  if (typeof (globalThis as any).crypto !== "undefined" && (globalThis as any).crypto.subtle) {
    const enc = new TextEncoder();
    const keyData = enc.encode(secret);
    const key = await (globalThis as any).crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    const expected = new Uint8Array(await (globalThis as any).crypto.subtle.sign("HMAC", key, enc.encode(unsigned)));
    if (expected.length !== sigBuf.length) return null;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ sigBuf[i];
    if (diff !== 0) return null;
  } else {
    const nodeCrypto = require("crypto");
    const expected = nodeCrypto.createHmac("sha256", secret).update(unsigned).digest();
    if (expected.length !== sigBuf.length || !nodeCrypto.timingSafeEqual(expected, sigBuf)) return null;
  }

  const payload = JSON.parse(base64urlDecodeToBuffer(b).toString("utf8"));
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) return null;
  return payload;
}

export default { signJwt, verifyJwt, verifyJwtSync };
