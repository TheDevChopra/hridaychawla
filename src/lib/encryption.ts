import CryptoJS from "crypto-js";

// In a real application, this secret key should be derived from the user's master password
// using a strong KDF (like PBKDF2) and never stored directly.
// For this mock implementation without Supabase Auth, we'll use a hardcoded fallback.
const getSecretKey = () => {
  if (typeof window !== "undefined") {
    const key = localStorage.getItem("vault_master_key");
    if (key) return key;
  }
  return "hc_personality_hub_default_secret_2026_!@#";
};

export const encryptData = (text: string): string => {
  try {
    const key = getSecretKey();
    return CryptoJS.AES.encrypt(text, key).toString();
  } catch (error) {
    console.error("Encryption failed", error);
    return "";
  }
};

export const decryptData = (encryptedText: string): string => {
  try {
    const key = getSecretKey();
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed", error);
    return "";
  }
};

export const generatePassword = (length: number = 16): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export const checkPasswordStrength = (password: string): "Weak" | "Medium" | "Strong" => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  if (strength <= 3) return "Weak";
  if (strength <= 5) return "Medium";
  return "Strong";
};
