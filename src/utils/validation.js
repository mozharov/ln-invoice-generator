export function validateAmount(amount) {
  if (typeof amount !== 'number' || !Number.isInteger(amount)) {
    return { valid: false, error: 'Amount must be an integer' };
  }
  
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount >= 1000000000) {
    return { valid: false, error: 'Amount must be less than 1 BTC (1000000000 sats)' };
  }
  
  return { valid: true };
}

export function validateDescription(description) {
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      return { valid: false, error: 'Description must be a string' };
    }
    
    if (description.length > 256) {
      return { valid: false, error: 'Description must be 256 characters or less' };
    }
    
    // Basic HTML sanitization (remove script tags and other dangerous content)
    if (/<script|javascript:|vbscript:|onload|onerror/i.test(description)) {
      return { valid: false, error: 'Description contains invalid content' };
    }
  }
  
  return { valid: true };
}

export function validateNWCFormat(secret) {
  if (typeof secret !== 'string') {
    return { valid: false, error: 'NWC secret must be a string' };
  }
  
  if (!secret.startsWith('nostr+walletconnect://')) {
    return { valid: false, error: 'Invalid NWC secret format' };
  }
  
  return { valid: true };
}