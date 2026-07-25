import { PincodeInfo } from '../types';

export const PINCODE_DATABASE: Record<string, PincodeInfo> = {
  '600001': {
    pincode: '600001',
    serviceable: true,
    state: 'Tamil Nadu (Chennai)',
    courier: 'Porter / Delhivery Express',
    estimatedDays: '1 Day (Same Day / Next Day)',
    codAvailable: true,
    freeShippingEligible: true
  },
  '641001': {
    pincode: '641001',
    serviceable: true,
    state: 'Tamil Nadu (Coimbatore)',
    courier: 'Porter / DTDC Express',
    estimatedDays: '1-2 Days',
    codAvailable: true,
    freeShippingEligible: true
  },
  '625001': {
    pincode: '625001',
    serviceable: true,
    state: 'Tamil Nadu (Madurai)',
    courier: 'Delhivery / India Post Speed Post',
    estimatedDays: '1-2 Days',
    codAvailable: true,
    freeShippingEligible: true
  },
  '636001': {
    pincode: '636001',
    serviceable: true,
    state: 'Tamil Nadu (Salem)',
    courier: 'DTDC / India Post',
    estimatedDays: '1-2 Days',
    codAvailable: true,
    freeShippingEligible: true
  },
  '620001': {
    pincode: '620001',
    serviceable: true,
    state: 'Tamil Nadu (Tiruchirappalli)',
    courier: 'Delhivery Express',
    estimatedDays: '1-2 Days',
    codAvailable: true,
    freeShippingEligible: true
  },
  '560001': {
    pincode: '560001',
    serviceable: true,
    state: 'Karnataka (Bengaluru)',
    courier: 'DTDC Air / Delhivery',
    estimatedDays: '2-3 Days',
    codAvailable: true,
    freeShippingEligible: true
  },
  '500001': {
    pincode: '500001',
    serviceable: true,
    state: 'Telangana (Hyderabad)',
    courier: 'Delhivery Express',
    estimatedDays: '2-3 Days',
    codAvailable: true,
    freeShippingEligible: true
  },
  '400001': {
    pincode: '400001',
    serviceable: true,
    state: 'Maharashtra (Mumbai)',
    courier: 'India Post / DTDC Express',
    estimatedDays: '3-4 Days',
    codAvailable: true,
    freeShippingEligible: true
  }
};

export function lookupPincode(code: string): PincodeInfo {
  const trimmed = code.trim();
  if (PINCODE_DATABASE[trimmed]) {
    return PINCODE_DATABASE[trimmed];
  }
  
  if (/^6[0-4]\d{4}$/.test(trimmed)) {
    return {
      pincode: trimmed,
      serviceable: true,
      state: 'Tamil Nadu',
      courier: 'Porter / Delhivery / DTDC Express',
      estimatedDays: '1 - 2 Business Days',
      codAvailable: true,
      freeShippingEligible: true
    };
  }
  
  if (/^\d{6}$/.test(trimmed)) {
    return {
      pincode: trimmed,
      serviceable: true,
      state: 'Rest of India',
      courier: 'India Post Speed Post / DTDC',
      estimatedDays: '3 - 5 Business Days',
      codAvailable: true,
      freeShippingEligible: true
    };
  }

  return {
    pincode: trimmed,
    serviceable: false,
    state: 'Unknown',
    courier: 'N/A',
    estimatedDays: 'N/A',
    codAvailable: false,
    freeShippingEligible: false
  };
}
