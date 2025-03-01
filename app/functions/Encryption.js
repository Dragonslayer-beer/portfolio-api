
const CryptoJS = require("crypto-js");
require("dotenv").config();

// Define a secret key for encryption (store it safely, e.g., in environment variables)
const secretKey = process.env.ENCRYPTION_KEY; // replace with a secure key

// Function to encrypt text
 const encrypt = (text) => {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  // Convert to Base64 URL-safe format
  return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Function to decrypt data
 const decrypt = (ciphertext) => {
  // Convert back from Base64 URL-safe format to standard Base64
  const base64 = ciphertext.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = CryptoJS.AES.decrypt(base64, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

 const dataEncryption = (data) => {
  const secret = CryptoJS.lib.WordArray.random(16);
  const salt = CryptoJS.lib.WordArray.random(16);
  const salt_hex = CryptoJS.enc.Hex.stringify(salt);
  const iv = CryptoJS.lib.WordArray.random(16);
  const iv_hex = CryptoJS.enc.Hex.stringify(iv);
  const iterations = 100;
  const key = CryptoJS.PBKDF2(secret, salt, {
    keySize: 256 / 32,
    iterations: iterations,
  });
  const key_hex = key;

  const encrypt = CryptoJS.AES.encrypt(data, key, { iv: iv });

  const encryptedtxt =
    secret +
    ":" +
    salt_hex +
    ":" +
    iv_hex +
    ":" +
    encrypt.ciphertext.toString(CryptoJS.enc.Base64) +
    ":" +
    key_hex;
  return encryptedtxt;
};

 module.exports = { encrypt, decrypt, dataEncryption };
