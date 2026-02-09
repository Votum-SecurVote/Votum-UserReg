export type UserStatus = "APPROVED" | "PENDING" | "REJECTED"
export type UserRole = "voter" | "admin"
export type ElectionStatus = "Upcoming" | "Active" | "Closed"

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  aadhaar: string
  dob: string
  gender: string
  address: string
  status: UserStatus
  role: UserRole
  profilePhoto?: string
}

export interface Election {
  id: string
  title: string
  description: string
  rules: string[]
  startDate: string
  endDate: string
  status: ElectionStatus
  candidates?: Candidate[]
}

export interface Candidate {
  id: string
  name: string
  party: string
  symbol: string
}
