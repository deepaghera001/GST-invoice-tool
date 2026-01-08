/**
 * Shareholders Agreement Constants and Defaults
 * 
 * IMPORTANT: This document is ONLY for Private Limited Companies.
 * LLPs (Limited Liability Partnerships) cannot have Shareholders Agreements.
 * LLPs require a separate "LLP Partnership Agreement" under the LLP Act, 2008.
 * 
 * Key differences:
 * - Pvt Ltd: Shareholders, Shares, Directors, CIN, Companies Act 2013
 * - LLP: Partners, Capital Contribution, Designated Partners, LLPIN, LLP Act 2008
 */

import type { ShareholdersAgreementFormData } from "./types"

export const DEFAULT_SHAREHOLDERS_AGREEMENT_DATA: ShareholdersAgreementFormData = {
  company: {
    companyName: "",
    cin: "", // Corporate Identification Number (for Pvt Ltd companies)
    registeredAddress: "",
    dateOfAgreement: "",
    companyType: "private-limited", // ONLY option - LLPs need separate product
  },
  shareholders: [
    {
      name: "",
      email: "",
      address: "",
      shareholding: 0,
      noOfShares: 0,
      role: "founder",
    },
    {
      name: "",
      email: "",
      address: "",
      shareholding: 0,
      noOfShares: 0,
      role: "founder",
    },
  ],
  shareCapital: {
    authorizedShareCapital: 0,
    paidUpShareCapital: 0,
    faceValuePerShare: 10,
    issuedShares: 0,
  },
  boardManagement: {
    totalDirectors: 1,
    directorAppointmentBy: "majority-shareholders",
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
    valuationMethod: "fair-market-value",
    buyoutPaymentDays: 90,
    buyoutFundingSource: "company",
  },
  confidentialityNonCompete: {
    confidentialityClause: true,
    nonCompeteDuration: 0,
    nonSolicitation: false,
  },
  deadlockResolution: {
    deadlockResolution: "arbitration",
    arbitrationLocation: "New Delhi",
    governingLaw: "India",
  },
  termination: {
    terminationConditions: [],
    noticePeriod: 30,
  },
  signatureDetails: {
    placeOfSigning: "",
    noOfWitnesses: 2,
    witnessNames: "",
  },
}

export const PRICING = {
  BASIC: {
    price: 499,
    name: "Basic Shareholders Agreement",
  },
  WITH_PREMIUM: {
    price: 699,
    name: "With Tag/Drag & Exit Clauses",
  },
  FULLY_LOADED: {
    price: 999,
    name: "Fully Loaded Package",
  },
}
