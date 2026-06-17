// Planner / admin authentication token.
//
// The planner and admin areas expose guest PII (names, emails, phones,
// addresses, dietary notes, children) and vendor/budget data. Previously the
// "planner-auth" cookie was the static string "granted", which anyone could
// forge by sending it in a raw request (httpOnly only blocks JS, not an
// attacker crafting the header). Instead we set the cookie to an unguessable
// token derived from a server-side secret, and compare against that everywhere.
//
// Web Crypto (globalThis.crypto.subtle) is available in BOTH the edge proxy
// and Node route handlers, so this single derivation runs identically in
// proxy.ts and the API/server-component checks.
//
// To make this fully secure, set PLANNER_AUTH_SECRET (or a private
// PLANNER_PASSWORD) in the deployment environment. If neither is set the token
// falls back to a derivation of the default password, which is published in
// this repo and therefore guessable — so a real secret MUST be configured.

const TOKEN_VERSION = 'v1'

function getSecret(): string {
  return (
    process.env.PLANNER_AUTH_SECRET ??
    process.env.PLANNER_PASSWORD ??
    'planner2026'
  )
}

/**
 * Derive the cookie token value for the current secret. Async because it uses
 * Web Crypto's SHA-256, which is the only digest API available in both the
 * edge and Node runtimes.
 *
 * The secret is fixed for the lifetime of the process, so the digest is
 * computed once and the resulting promise is cached — the proxy calls this on
 * every planner navigation, and there is no reason to re-hash each time.
 */
let _tokenPromise: Promise<string> | null = null

export function plannerAuthToken(): Promise<string> {
  if (!_tokenPromise) {
    _tokenPromise = (async () => {
      const data = new TextEncoder().encode(`planner-auth:${TOKEN_VERSION}:${getSecret()}`)
      const digest = await crypto.subtle.digest('SHA-256', data)
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    })()
  }
  return _tokenPromise
}

/** Constant-time comparison of a presented cookie value against the token. */
export async function isPlannerAuthed(cookieValue: string | undefined | null): Promise<boolean> {
  if (!cookieValue) return false
  const expected = await plannerAuthToken()
  if (cookieValue.length !== expected.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i++) {
    mismatch |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}
