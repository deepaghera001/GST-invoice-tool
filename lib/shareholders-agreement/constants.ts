/**
 * Shareholders Agreement Constants and Defaults
 */

import type { ShareholdersAgreementFormData } from "./types"

export const DEFAULT_SHAREHOLDERS_AGREEMENT_DATA: ShareholdersAgreementFormData = {
  company: {
    companyName: "",
    cin: "",
    registeredAddress: "",
    dateOfAgreement: "",
    companyType: "private-limited",
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
  },
  boardManagement: {
    totalDirectors: 1,
    directorAppointmentBy: "majority-shareholders",
    reservedMatters: [],
  },
  votingRights: {
    votingBasis: "one-share-one-vote",
    decisionsRequire: "simple-majority",
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
  },
  exitBuyout: {
    exitOptions: [],
    valuationMethod: "fair-market-value",
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
