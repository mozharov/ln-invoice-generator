import { NWCClient } from '@getalby/sdk/nwc';

export async function validateNWCSecret(secret) {
  try {
    const nwc = new NWCClient({
      nostrWalletConnectUrl: secret
    });
    
    await nwc.makeInvoice({
      amount: 1000,
      description: 'Connection test',
      expiry: 60
    });
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export async function createInvoice(nwcSecret, amount, description) {
  const nwc = new NWCClient({
    nostrWalletConnectUrl: nwcSecret
  });
  
  try {
    const invoice = await nwc.makeInvoice({
      amount: amount * 1000,
      description: description,
      expiry: 3600
    });
    
    return { success: true, invoice: invoice.invoice };
  } catch (error) {
    return { success: false, error: error.message };
  }
}