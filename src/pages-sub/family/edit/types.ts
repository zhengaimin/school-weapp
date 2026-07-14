export interface FamilyContact {
  id: number
  name: string
  relationship: string
  phone: string
}

export type FamilyContactForm = Omit<FamilyContact, 'id'>
