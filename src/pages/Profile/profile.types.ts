export type Gender = 'male' | 'female' | 'other';

export interface Profile {
  id: string;
  avatar?: string;
  fullName: string;
  dob?: string;
  gender?: Gender;
  email: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  title?: string;
  verified?: boolean;
  premium?: boolean;
}
