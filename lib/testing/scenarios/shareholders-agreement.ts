/**
 * Shareholders Agreement Test Scenarios
 * Add new test case = Add new object to array
 */

import type { TestScenario } from '../types';
import type { ShareholdersAgreementFormData } from '@/lib/shareholders-agreement';

// Helper for dates
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Base valid data
const VALID_BASE: ShareholdersAgreementFormData = {
  company: {
    companyName: "TechVentures India Private Limited",
    cin: "U72900KA2020PTC123456",
    registeredAddress: "Level 5, Tower A, Prestige Tech Park, Marathahalli, Bangalore, Karnataka - 560103",
    dateOfAgreement: getTodayDate(),
    companyType: "private-limited",
  },
  shareholders: [
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@techventures.in",
      address: "Flat 502, Brigade Gateway, Rajajinagar, Bangalore - 560010",
      shareholding: 60,
      noOfShares: 60000,
      role: "founder",
    },
    {
      name: "Priya Patel",
      email: "priya.patel@techventures.in",
      address: "Villa 23, Palm Meadows, Whitefield, Bangalore - 560066",
      shareholding: 40,
      noOfShares: 40000,
      role: "founder",
    },
  ],
  shareCapital: {
    authorizedShareCapital: 1000000,
    paidUpShareCapital: 1000000,
    faceValuePerShare: 10,
    issuedShares: 100000, // 100,000 shares × ₹10 = ₹10,00,000 paid-up
  },
  boardManagement: {
    totalDirectors: 3,
    directorAppointmentBy: "majority-shareholders",
    reservedMatters: ["dividends", "capitalExpenditure", "borrowings"],
    boardQuorum: 2,
    boardVotingRule: "simple-majority",
  },
  votingRights: {
    votingBasis: "one-share-one-vote",
    decisionsRequire: "simple-majority",
    specialMajorityMatters: ["amendAoA", "changeShareCapital", "mergerAcquisition"],
  },
  shareTransfer: {
    transferAllowed: true,
    rightOfFirstRefusal: true,
    lockInPeriod: 24,
  },
  tagAlongDragAlong: {
    enableTagAlong: true,
    tagAlongTriggerPercent: 50,
    enableDragAlong: true,
    dragAlongTriggerPercent: 75,
    dragAlongPriceCondition: "fair-market-value",
  },
  exitBuyout: {
    exitOptions: ["buy-back-company", "sale-third-party"],
    valuationMethod: "fair-market-value",
    buyoutPaymentDays: 90,
    buyoutFundingSource: "company",
  },
  confidentialityNonCompete: {
    confidentialityClause: true,
    nonCompeteDuration: 24,
    nonSolicitation: true,
  },
  deadlockResolution: {
    deadlockResolution: "arbitration",
    arbitrationLocation: "Bangalore",
    governingLaw: "India",
  },
  termination: {
    terminationConditions: ["mutual-consent", "breach-terms"],
    noticePeriod: 90,
  },
  signatureDetails: {
    placeOfSigning: "Bangalore",
    noOfWitnesses: 2,
    witnessNames: "Amit Kumar, Sneha Reddy",
  },
};

/**
 * Shareholders Agreement Test Scenarios
 */
export const shareholdersAgreementScenarios: TestScenario<ShareholdersAgreementFormData>[] = [
  // ✅ VALID SCENARIOS
  {
    id: 'valid-complete',
    name: '✅ Complete Valid Agreement',
    category: 'valid',
    description: 'Standard shareholders agreement with two founders',
    data: VALID_BASE,
  },
  {
    id: 'valid-three-founders',
    name: '✅ Three Founders',
    category: 'valid',
    description: 'Agreement with three co-founders',
    data: {
      ...VALID_BASE,
      company: {
        ...VALID_BASE.company,
        companyName: "TriForce Technologies Pvt Ltd",
      },
      shareholders: [
        {
          name: "Aditya Mehta",
          email: "aditya@triforce.in",
          address: "123 HSR Layout, Bangalore - 560102",
          shareholding: 40,
          noOfShares: 40000,
          role: "founder",
        },
        {
          name: "Bhavna Singh",
          email: "bhavna@triforce.in",
          address: "45 Indiranagar, Bangalore - 560038",
          shareholding: 35,
          noOfShares: 35000,
          role: "founder",
        },
        {
          name: "Chetan Rao",
          email: "chetan@triforce.in",
          address: "78 Koramangala, Bangalore - 560034",
          shareholding: 25,
          noOfShares: 25000,
          role: "founder",
        },
      ],
    },
  },
  {
    id: 'valid-with-investor',
    name: '✅ With Investor',
    category: 'valid',
    description: 'Agreement including an investor shareholder',
    data: {
      ...VALID_BASE,
      company: {
        ...VALID_BASE.company,
        companyName: "GrowthStack India Pvt Ltd",
      },
      shareholders: [
        {
          name: "Founder One",
          email: "founder1@growthstack.in",
          address: "Koramangala, Bangalore",
          shareholding: 50,
          noOfShares: 50000,
          role: "founder",
        },
        {
          name: "Seed Ventures LLP",
          email: "investments@seedventures.vc",
          address: "MG Road, Bangalore - 560001",
          shareholding: 30,
          noOfShares: 30000,
          role: "investor",
        },
        {
          name: "Employee ESOP Pool",
          email: "hr@growthstack.in",
          address: "Koramangala, Bangalore",
          shareholding: 20,
          noOfShares: 20000,
          role: "employee-shareholder",
        },
      ],
      boardManagement: {
        ...VALID_BASE.boardManagement,
        totalDirectors: 4,
        reservedMatters: ["dividends", "capitalExpenditure", "borrowings", "newDirectors"],
        boardQuorum: 3,
        boardVotingRule: "two-thirds",
      },
      votingRights: {
        ...VALID_BASE.votingRights,
        decisionsRequire: "special-majority-75",
        specialMajorityMatters: ["amendAoA", "changeShareCapital", "issueNewShares", "mergerAcquisition", "windingUp"],
      },
      exitBuyout: {
        ...VALID_BASE.exitBuyout,
        buyoutPaymentDays: 60,
        buyoutFundingSource: "remaining-shareholders",
      },
    },
  },
  // NOTE: LLP test scenario removed - LLPs cannot have Shareholders Agreements
  // LLPs need separate "LLP Partnership Agreement" product
  // This is legally required under Indian law (LLP Act, 2008)
  {
    id: 'valid-minimal',
    name: '✅ Minimal Valid',
    category: 'valid',
    description: 'Minimum required fields only',
    data: {
      company: {
        companyName: "Simple Tech Pvt Ltd",
        cin: "",
        registeredAddress: "123 Main Street, Mumbai - 400001",
        dateOfAgreement: getTodayDate(),
        companyType: "private-limited",
      },
      shareholders: [
        {
          name: "Partner A",
          email: "partnera@simple.in",
          address: "",
          shareholding: 50,
          noOfShares: 5000,
          role: "founder",
        },
        {
          name: "Partner B",
          email: "partnerb@simple.in",
          address: "",
          shareholding: 50,
          noOfShares: 5000,
          role: "founder",
        },
      ],
      shareCapital: {
        authorizedShareCapital: 100000,
        paidUpShareCapital: 100000,
        faceValuePerShare: 10,
        issuedShares: 10000, // 10,000 shares × ₹10 = ₹1,00,000
      },
      boardManagement: {
        totalDirectors: 2,
        directorAppointmentBy: "each-founder",
        reservedMatters: [],
        boardQuorum: 2,
        boardVotingRule: "simple-majority",
      },
      votingRights: {
        votingBasis: "one-share-one-vote",
        decisionsRequire: "simple-majority",
        specialMajorityMatters: [],
      },
      shareTransfer: {
        transferAllowed: false,
        rightOfFirstRefusal: false,
        lockInPeriod: 0,
      },
      tagAlongDragAlong: {
        enableTagAlong: false,
        tagAlongTriggerPercent: 0,
        enableDragAlong: false,
        dragAlongTriggerPercent: 0,
        dragAlongPriceCondition: "fair-market-value",
      },
      exitBuyout: {
        exitOptions: [],
        valuationMethod: "mutual-agreement",
        buyoutPaymentDays: 90,
        buyoutFundingSource: "company",
      },
      confidentialityNonCompete: {
        confidentialityClause: false,
        nonCompeteDuration: 0,
        nonSolicitation: false,
      },
      deadlockResolution: {
        deadlockResolution: "mediation",
        arbitrationLocation: "Mumbai",
        governingLaw: "India",
      },
      termination: {
        terminationConditions: [],
        noticePeriod: 30,
      },
      signatureDetails: {
        placeOfSigning: "Mumbai",
        noOfWitnesses: 2,
        witnessNames: "",
      },
    },
  },

  // ❌ INVALID SCENARIOS
  {
    id: 'invalid-shareholding-not-100',
    name: '❌ Shareholding Not 100%',
    category: 'invalid',
    description: 'Tests shareholding must equal 100%',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          ...VALID_BASE.shareholders[0],
          shareholding: 60,
        },
        {
          ...VALID_BASE.shareholders[1],
          shareholding: 30, // Total = 90%, not 100%
        },
      ],
    },
    expectedErrors: ['shareholders'],
  },

  // ===== CAPITAL STRUCTURE VALIDATION TESTS =====
  // These test the four-level capital structure validation:
  // 1. Total shareholding = 100%
  // 2. Paid-up capital ≤ Authorized capital
  // 3. CRITICAL: Issued Shares × Face Value = Paid-up Capital
  // 4. Total shareholder shares ≤ Issued shares

  {
    id: 'invalid-capital-math-mismatch',
    name: '❌ Capital Math Mismatch (BLOCKING)',
    category: 'invalid',
    description: 'Issued Shares × Face Value ≠ Paid-up Capital - BLOCKS PDF generation',
    data: {
      ...VALID_BASE,
      shareCapital: {
        authorizedShareCapital: 1000000,
        paidUpShareCapital: 10000, // WRONG: should be 1,000 × 10 = 10,000
        faceValuePerShare: 10,
        issuedShares: 1000, // Math check: 1,000 × 10 = 10,000 ✓ but we'll set wrong paid-up
      },
    },
    expectedErrors: ['shareCapital'],
  },
  {
    id: 'invalid-capital-way-off',
    name: '❌ Issued Shares Way Too Low',
    category: 'invalid',
    description: 'User case: 12 issued shares vs 100,000 shareholder shares = Capital Mismatch error',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@techventures.in",
          address: "Flat 502, Brigade Gateway, Bangalore - 560010",
          shareholding: 60,
          noOfShares: 60000, // 60,000 shares
          role: "founder",
        },
        {
          name: "Priya Patel",
          email: "priya.patel@techventures.in",
          address: "Villa 23, Palm Meadows, Bangalore - 560066",
          shareholding: 40,
          noOfShares: 40000, // 40,000 shares
          role: "founder",
        },
      ],
      shareCapital: {
        authorizedShareCapital: 1000000,
        paidUpShareCapital: 120, // 12 shares × 10 = 120
        faceValuePerShare: 10,
        issuedShares: 12, // CRITICAL ERROR: 12 < 100,000 shareholder shares!
      },
    },
    expectedErrors: ['shareholders'], // Error path is shareholders since total shares held > issued
  },

  {
    id: 'invalid-capital-math-off-by-100',
    name: '❌ Math Off (Simple Typo)',
    category: 'invalid',
    description: 'Test user entered 10,000 paid-up but math says 12,000 (1,200 × 10)',
    data: {
      ...VALID_BASE,
      shareCapital: {
        authorizedShareCapital: 1000000,
        paidUpShareCapital: 10000, // User entered 10,000
        faceValuePerShare: 10,
        issuedShares: 1200, // 1,200 × 10 = 12,000 (not 10,000)
      },
    },
    expectedErrors: ['shareCapital'],
  },

  // ===== VALID CAPITAL STRUCTURE TESTS =====
  // Different valid scenarios with correct capital math

  {
    id: 'valid-capital-simple',
    name: '✅ Simple Capital (₹10,000)',
    category: 'valid',
    description: 'Simple case: 1,000 shares × ₹10 = ₹10,000 paid-up',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@techventures.in",
          address: "Flat 502, Brigade Gateway, Bangalore - 560010",
          shareholding: 60,
          noOfShares: 600, // 60% of 1,000 shares
          role: "founder",
        },
        {
          name: "Priya Patel",
          email: "priya.patel@techventures.in",
          address: "Villa 23, Palm Meadows, Bangalore - 560066",
          shareholding: 40,
          noOfShares: 400, // 40% of 1,000 shares
          role: "founder",
        },
      ],
      shareCapital: {
        authorizedShareCapital: 1000000,
        paidUpShareCapital: 10000,
        faceValuePerShare: 10,
        issuedShares: 1000, // 1,000 × 10 = 10,000 ✓
      },
    },
  },

  {
    id: 'valid-capital-higher-value',
    name: '✅ Higher Value Capital (₹1,00,000)',
    category: 'valid',
    description: 'Higher value: 1,000 shares × ₹100 face value = ₹1,00,000 paid-up',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@techventures.in",
          address: "Flat 502, Brigade Gateway, Bangalore - 560010",
          shareholding: 60,
          noOfShares: 600, // 60% of 1,000 shares
          role: "founder",
        },
        {
          name: "Priya Patel",
          email: "priya.patel@techventures.in",
          address: "Villa 23, Palm Meadows, Bangalore - 560066",
          shareholding: 40,
          noOfShares: 400, // 40% of 1,000 shares
          role: "founder",
        },
      ],
      shareCapital: {
        authorizedShareCapital: 5000000,
        paidUpShareCapital: 100000,
        faceValuePerShare: 100,
        issuedShares: 1000, // 1,000 × 100 = 100,000 ✓
      },
    },
  },

  {
    id: 'valid-capital-small-face-value',
    name: '✅ Small Face Value (₹5)',
    category: 'valid',
    description: 'Small face value: 10,000 shares × ₹5 = ₹50,000 paid-up',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@techventures.in",
          address: "Flat 502, Brigade Gateway, Bangalore - 560010",
          shareholding: 60,
          noOfShares: 6000, // 60% of 10,000 shares
          role: "founder",
        },
        {
          name: "Priya Patel",
          email: "priya.patel@techventures.in",
          address: "Villa 23, Palm Meadows, Bangalore - 560066",
          shareholding: 40,
          noOfShares: 4000, // 40% of 10,000 shares
          role: "founder",
        },
      ],
      shareCapital: {
        authorizedShareCapital: 5000000,
        paidUpShareCapital: 50000,
        faceValuePerShare: 5,
        issuedShares: 10000, // 10,000 × 5 = 50,000 ✓
      },
    },
  },

  {
    id: 'valid-capital-large-scale',
    name: '✅ Large Scale (₹1 Crore)',
    category: 'valid',
    description: 'Large company: 1,000,000 shares × ₹10 = ₹1,00,00,000 (1 Crore)',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          name: "Rahul Sharma",
          email: "rahul.sharma@techventures.in",
          address: "Flat 502, Brigade Gateway, Bangalore - 560010",
          shareholding: 60,
          noOfShares: 600000,
          role: "founder",
        },
        {
          name: "Priya Patel",
          email: "priya.patel@techventures.in",
          address: "Villa 23, Palm Meadows, Bangalore - 560066",
          shareholding: 40,
          noOfShares: 400000,
          role: "founder",
        },
      ],
      shareCapital: {
        authorizedShareCapital: 10000000,
        paidUpShareCapital: 10000000,
        faceValuePerShare: 10,
        issuedShares: 1000000,
      },
    },
  },
  {
    id: 'invalid-paid-exceeds-authorized',
    name: '❌ Paid-up > Authorized',
    category: 'invalid',
    description: 'Tests paid-up cannot exceed authorized capital',
    data: {
      ...VALID_BASE,
      shareCapital: {
        authorizedShareCapital: 500000,
        paidUpShareCapital: 1000000, // Exceeds authorized
        faceValuePerShare: 10,
        issuedShares: 100000, // Math is correct: 100,000 × ₹10 = ₹10,00,000
      },
    },
    expectedErrors: ['shareCapital'],
  },
  {
    id: 'invalid-short-company-name',
    name: '❌ Company Name Too Short',
    category: 'invalid',
    description: 'Tests company name minimum length',
    data: {
      ...VALID_BASE,
      company: {
        ...VALID_BASE.company,
        companyName: "A", // Too short
      },
    },
    expectedErrors: ['company.companyName'],
  },
  {
    id: 'invalid-shareholder-email',
    name: '❌ Invalid Shareholder Email',
    category: 'invalid',
    description: 'Tests email format validation',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          ...VALID_BASE.shareholders[0],
          email: "not-an-email",
        },
        VALID_BASE.shareholders[1],
      ],
    },
    expectedErrors: ['shareholders.0.email'],
  },
  {
    id: 'invalid-single-shareholder',
    name: '❌ Only One Shareholder',
    category: 'invalid',
    description: 'Tests minimum 2 shareholders required',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          name: "Solo Founder",
          email: "solo@company.in",
          address: "Mumbai",
          shareholding: 100,
          noOfShares: 100000,
          role: "founder",
        },
      ],
    },
    expectedErrors: ['shareholders'],
  },

  // ⚠️ EDGE CASES
  {
    id: 'edge-equal-split',
    name: '⚠️ Equal 50-50 Split',
    category: 'edge-case',
    description: 'Tests equal shareholding between partners',
    data: {
      ...VALID_BASE,
      shareholders: [
        {
          ...VALID_BASE.shareholders[0],
          shareholding: 50,
          noOfShares: 50000,
        },
        {
          ...VALID_BASE.shareholders[1],
          shareholding: 50,
          noOfShares: 50000,
        },
      ],
      votingRights: {
        ...VALID_BASE.votingRights,
        decisionsRequire: "unanimous", // Important for deadlock prevention
        specialMajorityMatters: ["amendAoA", "changeShareCapital", "issueNewShares", "mergerAcquisition", "windingUp", "relatedPartyTransactions"],
      },
    },
  },
  {
    id: 'edge-max-lock-in',
    name: '⚠️ Maximum Lock-in Period',
    category: 'edge-case',
    description: 'Tests maximum 120 months lock-in',
    data: {
      ...VALID_BASE,
      shareTransfer: {
        ...VALID_BASE.shareTransfer,
        lockInPeriod: 120, // 10 years
      },
      confidentialityNonCompete: {
        ...VALID_BASE.confidentialityNonCompete,
        nonCompeteDuration: 120,
      },
    },
  },
  {
    id: 'edge-special-characters',
    name: '⚠️ Special Characters in Names',
    category: 'edge-case',
    description: 'Tests handling of special characters',
    data: {
      ...VALID_BASE,
      company: {
        ...VALID_BASE.company,
        companyName: "O'Brien & Associates (India) Pvt. Ltd.",
      },
      shareholders: [
        {
          name: "Jean-Pierre O'Connor",
          email: "jean-pierre@obrien.in",
          address: "123, St. Mary's Road, Chennai",
          shareholding: 60,
          noOfShares: 60000,
          role: "founder",
        },
        {
          name: "María García-López",
          email: "maria.garcia@obrien.in",
          address: "45/A, MG Road, Bangalore",
          shareholding: 40,
          noOfShares: 40000,
          role: "investor",
        },
      ],
    },
  },

  // 📝 PARTIAL SCENARIOS
  {
    id: 'partial-company-only',
    name: '📝 Company Details Only',
    category: 'partial',
    description: 'Only company section filled',
    data: {
      company: {
        companyName: "NewStartup Pvt Ltd",
        cin: "U74999MH2024PTC123456",
        registeredAddress: "WeWork, Lower Parel, Mumbai - 400013",
        dateOfAgreement: getTodayDate(),
        companyType: "private-limited",
      },
    } as ShareholdersAgreementFormData,
  },
  {
    id: 'partial-high-value',
    name: '📝 High Value Startup',
    category: 'partial',
    description: 'Pre-filled for high value companies with all premium features',
    data: {
      ...VALID_BASE,
      shareCapital: {
        authorizedShareCapital: 50000000, // 5 Crore
        paidUpShareCapital: 25000000, // 2.5 Crore
        faceValuePerShare: 10,
        issuedShares: 2500000, // 25 Lakh shares × ₹10 = ₹2.5 Crore
      },
      boardManagement: {
        totalDirectors: 5,
        directorAppointmentBy: "majority-shareholders",
        reservedMatters: ["dividends", "capitalExpenditure", "borrowings", "newDirectors", "mortgageAssets", "dissolutionWinding"],
        boardQuorum: 3,
        boardVotingRule: "two-thirds",
      },
      votingRights: {
        votingBasis: "one-share-one-vote",
        decisionsRequire: "special-majority-75",
        specialMajorityMatters: ["amendAoA", "changeShareCapital", "issueNewShares", "mergerAcquisition", "windingUp", "relatedPartyTransactions"],
      },
      tagAlongDragAlong: {
        enableTagAlong: true,
        tagAlongTriggerPercent: 25,
        enableDragAlong: true,
        dragAlongTriggerPercent: 66,
        dragAlongPriceCondition: "board-approved-value",
      },
      exitBuyout: {
        exitOptions: ["buy-back-company", "sale-third-party", "ipo"],
        valuationMethod: "independent-valuer",
        buyoutPaymentDays: 120,
        buyoutFundingSource: "remaining-shareholders",
      },
    },
  },
];
