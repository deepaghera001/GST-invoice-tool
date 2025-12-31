/**
 * Rent Agreement Test Scenarios
 * Add new test case = Add new object to array
 */

import type { TestScenario } from '../types';
import type { RentAgreementFormData } from '@/lib/rent-agreement';

// Helper for dates
const getNextMonthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split('T')[0];
};

// Base valid data
const VALID_BASE: RentAgreementFormData = {
  landlord: {
    name: "Rajesh Kumar Sharma",
    address: "Flat 501, Sunrise Apartments, MG Road, Bangalore - 560001",
    phone: "9876543210",
    email: "rajesh.sharma@email.com",
    panNumber: "ABCDE1234F",
    aadharNumber: "123456789012",
  },
  tenant: {
    name: "Priya Patel",
    address: "45, Green Valley Society, Andheri West, Mumbai - 400053",
    phone: "8765432109",
    email: "priya.patel@email.com",
    panNumber: "FGHIJ5678K",
    aadharNumber: "987654321098",
  },
  property: {
    address: "Flat 302, Blue Sky Towers, Koramangala 4th Block",
    city: "Bangalore",
    state: "KA",
    pincode: "560034",
    propertyType: "apartment",
    furnishingStatus: "semi-furnished",
    area: "1200",
    floor: "3",
    parking: true,
  },
  rentTerms: {
    monthlyRent: 25000,
    securityDeposit: 100000,
    maintenanceCharges: 3000,
    maintenanceIncluded: false,
    rentDueDay: 5,
    agreementStartDate: getNextMonthStart(),
    agreementDuration: 11,
    noticePeriod: 1,
    rentIncrementPercent: 5,
    paymentMode: "bank-transfer",
  },
  clauses: {
    noSubLetting: true,
    propertyInspection: true,
    repairsResponsibility: true,
    utilityPayment: true,
    peacefulUse: true,
    noIllegalActivity: true,
    lockInPeriod: true,
    lockInMonths: 3,
    additionalClauses: "",
  },
};

/**
 * Rent Agreement Test Scenarios
 */
export const rentAgreementScenarios: TestScenario<RentAgreementFormData>[] = [
  // ✅ VALID SCENARIOS
  {
    id: 'valid-complete',
    name: '✅ Complete Valid Agreement',
    category: 'valid',
    description: 'Standard 11-month rent agreement',
    data: VALID_BASE,
  },
  {
    id: 'valid-unfurnished',
    name: '✅ Unfurnished Apartment',
    category: 'valid',
    description: 'Basic unfurnished property',
    data: {
      ...VALID_BASE,
      property: {
        ...VALID_BASE.property,
        furnishingStatus: "unfurnished",
        parking: false,
      },
      rentTerms: {
        ...VALID_BASE.rentTerms,
        monthlyRent: 18000,
        securityDeposit: 72000,
        maintenanceCharges: 0,
        maintenanceIncluded: true,
      },
    },
  },
  {
    id: 'valid-fully-furnished',
    name: '✅ Fully Furnished Flat',
    category: 'valid',
    description: 'Premium furnished property',
    data: {
      ...VALID_BASE,
      property: {
        ...VALID_BASE.property,
        furnishingStatus: "fully-furnished",
        area: "1800",
      },
      rentTerms: {
        ...VALID_BASE.rentTerms,
        monthlyRent: 45000,
        securityDeposit: 180000,
        maintenanceCharges: 5000,
      },
    },
  },
  {
    id: 'valid-independent-house',
    name: '✅ Independent House',
    category: 'valid',
    description: 'Villa/independent house agreement',
    data: {
      ...VALID_BASE,
      property: {
        ...VALID_BASE.property,
        propertyType: "house",
        area: "2500",
        floor: "G",
      },
      rentTerms: {
        ...VALID_BASE.rentTerms,
        monthlyRent: 60000,
        securityDeposit: 240000,
      },
    },
  },

  // ❌ INVALID SCENARIOS
  {
    id: 'invalid-landlord-pan',
    name: '❌ Invalid Landlord PAN',
    category: 'invalid',
    description: 'Tests PAN format validation',
    data: {
      ...VALID_BASE,
      landlord: {
        ...VALID_BASE.landlord,
        panNumber: "INVALID",
      },
    },
    expectedErrors: ['landlord.panNumber'],
  },
  {
    id: 'invalid-tenant-aadhar',
    name: '❌ Invalid Tenant Aadhar',
    category: 'invalid',
    description: 'Aadhar must be 12 digits',
    data: {
      ...VALID_BASE,
      tenant: {
        ...VALID_BASE.tenant,
        aadharNumber: "12345", // Too short
      },
    },
    expectedErrors: ['tenant.aadharNumber'],
  },
  {
    id: 'invalid-phone',
    name: '❌ Invalid Phone Number',
    category: 'invalid',
    description: 'Phone must be 10 digits',
    data: {
      ...VALID_BASE,
      landlord: {
        ...VALID_BASE.landlord,
        phone: "12345", // Too short
      },
    },
    expectedErrors: ['landlord.phone'],
  },
  {
    id: 'invalid-pincode',
    name: '❌ Invalid Pincode',
    category: 'invalid',
    description: 'Pincode must be 6 digits',
    data: {
      ...VALID_BASE,
      property: {
        ...VALID_BASE.property,
        pincode: "123", // Too short
      },
    },
    expectedErrors: ['property.pincode'],
  },
  {
    id: 'invalid-zero-rent',
    name: '❌ Zero Monthly Rent',
    category: 'invalid',
    description: 'Rent must be positive',
    data: {
      ...VALID_BASE,
      rentTerms: {
        ...VALID_BASE.rentTerms,
        monthlyRent: 0,
      },
    },
    expectedErrors: ['rentTerms.monthlyRent'],
  },

  // ⚠️ EDGE CASES
  {
    id: 'edge-high-rent',
    name: '⚠️ High Rent Property (₹2L)',
    category: 'edge-case',
    description: 'Premium property high stamp duty',
    data: {
      ...VALID_BASE,
      property: {
        ...VALID_BASE.property,
        propertyType: "penthouse",
        area: "4000",
      },
      rentTerms: {
        ...VALID_BASE.rentTerms,
        monthlyRent: 200000,
        securityDeposit: 800000,
        maintenanceCharges: 15000,
      },
    },
  },
  {
    id: 'edge-no-lock-in',
    name: '⚠️ No Lock-in Period',
    category: 'edge-case',
    description: 'Agreement without lock-in',
    data: {
      ...VALID_BASE,
      clauses: {
        ...VALID_BASE.clauses,
        lockInPeriod: false,
        lockInMonths: 0,
      },
    },
  },
  {
    id: 'edge-long-duration',
    name: '⚠️ 11-Month Maximum',
    category: 'edge-case',
    description: 'Maximum duration to avoid registration',
    data: {
      ...VALID_BASE,
      rentTerms: {
        ...VALID_BASE.rentTerms,
        agreementDuration: 11,
        noticePeriod: 2,
      },
    },
  },
  {
    id: 'edge-different-state',
    name: '⚠️ Maharashtra Property',
    category: 'edge-case',
    description: 'Tests different state stamp duty',
    data: {
      ...VALID_BASE,
      property: {
        ...VALID_BASE.property,
        city: "Mumbai",
        state: "MH",
        pincode: "400001",
      },
    },
  },
  {
    id: 'edge-additional-clauses',
    name: '⚠️ With Custom Clauses',
    category: 'edge-case',
    description: 'Agreement with additional terms',
    data: {
      ...VALID_BASE,
      clauses: {
        ...VALID_BASE.clauses,
        additionalClauses: "1. No pets allowed on the premises.\n2. Tenant shall not make any structural changes.\n3. Landlord shall provide one parking space.\n4. Tenant responsible for minor repairs up to ₹5,000.",
      },
    },
  },

  // 📝 PARTIAL DATA
  {
    id: 'partial-landlord-only',
    name: '📝 Landlord Details Only',
    category: 'partial',
    description: 'Only landlord section filled',
    data: {
      landlord: VALID_BASE.landlord,
      tenant: { name: "", address: "", phone: "", email: "", panNumber: "", aadharNumber: "" },
      property: { address: "", city: "", state: "", pincode: "", propertyType: "apartment", furnishingStatus: "unfurnished", area: "", floor: "", parking: false },
      rentTerms: { monthlyRent: 0, securityDeposit: 0, maintenanceCharges: 0, maintenanceIncluded: false, rentDueDay: 1, agreementStartDate: "", agreementDuration: 11, noticePeriod: 1, rentIncrementPercent: 0, paymentMode: "bank-transfer" },
      clauses: { noSubLetting: true, propertyInspection: true, repairsResponsibility: true, utilityPayment: true, peacefulUse: true, noIllegalActivity: true, lockInPeriod: false, lockInMonths: 0, additionalClauses: "" },
    },
  },
];
