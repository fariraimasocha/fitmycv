// Run: node scripts/pesepay-check.mjs [path/to/crypto-js]
// Round-trips the Pesepay payload cipher, the phone parser and, when given a
// crypto-js path (tumai's node_modules/crypto-js), matches the SDK's ciphertext.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { encrypt, decrypt, normalizeEcocashPhone } from "../lib/pesepay.js";

const key = "0123456789abcdef0123456789abcdef";
const body = { amountDetails: { amount: 16.99, currencyCode: "USD" }, paymentMethodCode: "PZW211" };

assert.deepEqual(decrypt(encrypt(body, key), key), body);

const cryptoJsPath = process.argv[2];
if (cryptoJsPath) {
  const CryptoJS = createRequire(import.meta.url)(cryptoJsPath);
  const k = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse(key.slice(0, 16));
  const sdk = CryptoJS.AES.encrypt(JSON.stringify(body), k, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
  assert.equal(encrypt(body, key), sdk);
}

assert.equal(normalizeEcocashPhone("0771234567"), "0771234567");
assert.equal(normalizeEcocashPhone("+263 78 123 4567"), "0781234567");
assert.equal(normalizeEcocashPhone("263771234567"), "0771234567");
assert.equal(normalizeEcocashPhone("0711234567"), null); // NetOne, not EcoCash
assert.equal(normalizeEcocashPhone("077123456"), null);

console.log("pesepay checks passed");
