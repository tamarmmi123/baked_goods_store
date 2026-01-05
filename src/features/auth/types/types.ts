export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  street: string;
  city: string;
  zip: string;
}
