export interface Address {
  address: string;
  gmap_link: string;
}

export interface PhoneNumber {
  number: string;
  is_whatsapp_number: boolean;
}

export interface DeceasedInfo {
  status: boolean;
  date?: string;
  place?: string;
}

export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate?: string;
  deceased?: boolean | DeceasedInfo;
  short_bio?: string;
  phone_number?: PhoneNumber[];
  address?: Address[];
  additionals?: Record<string, string>;
}

export type RelationshipType = 'parent' | 'foster_parent' | 'married' | 'divorced' | 'not_married';

export interface Relationship {
  type: RelationshipType;
  from: string; // for parent: child is 'from', parent is 'to'. For married/divorced: spouse1 is 'from', spouse2 is 'to'
  to: string;
}

export interface FamilyData {
  people: Person[];
  relationships: Relationship[];
}
