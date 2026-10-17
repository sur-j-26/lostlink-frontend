/**
 * Anurag University Email Validation Utilities
 *
 * Validates that emails strictly belong to the official @anurag.edu.in domain.
 * Rejects subdomains (e.g., @dept.anurag.edu.in) and suffixes (e.g., @anurag.edu.in.example.com).
 */

export const ANURAG_EMAIL_DOMAIN = 'anurag.edu.in';

// Regex requires valid local-part + exact @anurag.edu.in domain (case-insensitive)
const ANURAG_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@anurag\.edu\.in$/i;

/**
 * Validates whether an email is a valid Anurag University email.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidAnuragEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const trimmed = email.trim();
  if (!trimmed) {
    return false;
  }
  return ANURAG_EMAIL_REGEX.test(trimmed);
}

/**
 * Normalizes an Anurag University email address.
 * Preserves local part and lowercases the domain.
 * @param {string} email
 * @returns {string}
 */
export function normalizeAnuragEmail(email) {
  if (!email || typeof email !== 'string') {
    return '';
  }
  return email.trim().toLowerCase();
}

/**
 * Validates an email and returns a clear, user-facing error message if invalid.
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export function getAnuragEmailValidationError(email) {
  if (!email || !email.trim()) {
    return 'University email address is required.';
  }
  const trimmed = email.trim();
  if (!trimmed.includes('@')) {
    return 'Please enter a valid email address with @.';
  }
  if (!ANURAG_EMAIL_REGEX.test(trimmed)) {
    return 'Please use your Anurag University email address ending in @anurag.edu.in.';
  }
  return null;
}
