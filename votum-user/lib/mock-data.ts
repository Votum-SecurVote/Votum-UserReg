import type { User, Election } from "./types"

export const mockUser: User = {
  id: "usr_001",
  fullName: "Rajesh Kumar",
  email: "rajesh.kumar@email.com",
  phone: "9876543210",
  aadhaar: "123456781234",
  dob: "1990-05-15",
  gender: "Male",
  address: "42, MG Road, Sector 12, New Delhi, 110001",
  status: "APPROVED",
  role: "voter",
}

export const mockElections: Election[] = [
  {
    id: "elec_001",
    title: "General Assembly Election 2026",
    description:
      "Vote for your representative in the General Assembly. This election determines the composition of the legislative body for the next 5 years.",
    rules: [
      "Each voter may cast exactly one vote.",
      "Voting is anonymous and encrypted.",
      "Results will be declared 48 hours after the voting window closes.",
      "Any form of coercion or vote buying is a criminal offense.",
      "Voters must have an approved account to participate.",
    ],
    startDate: "2026-02-01",
    endDate: "2026-03-01",
    status: "Active",
    candidates: [
      { id: "c1", name: "Arun Sharma", party: "National Progress Party", symbol: "NPP" },
      { id: "c2", name: "Priya Reddy", party: "Democratic Alliance", symbol: "DA" },
      { id: "c3", name: "Vikram Singh", party: "People's Front", symbol: "PF" },
    ],
  },
  {
    id: "elec_002",
    title: "Municipal Corporation Election 2026",
    description:
      "Elect your ward councilor for the Municipal Corporation. The elected body will oversee urban governance and civic infrastructure.",
    rules: [
      "Only residents of the respective ward may vote.",
      "Voting is completely digital and paperless.",
      "Voter identity is verified via Aadhaar-linked biometrics.",
    ],
    startDate: "2026-04-15",
    endDate: "2026-05-15",
    status: "Upcoming",
    candidates: [
      { id: "c4", name: "Meena Kumari", party: "Urban Reform Party", symbol: "URP" },
      { id: "c5", name: "Rakesh Patel", party: "City First Alliance", symbol: "CFA" },
    ],
  },
  {
    id: "elec_003",
    title: "State Legislature Election 2025",
    description:
      "Previous state legislature election. Voting period has ended and results have been declared.",
    rules: [
      "Standard state election rules apply.",
      "Results are final and binding.",
    ],
    startDate: "2025-10-01",
    endDate: "2025-11-01",
    status: "Closed",
    candidates: [],
  },
]
