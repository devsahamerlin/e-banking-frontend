import { UserProfile } from "./user-profile.model";

export interface Customer {
  id : number;
  name : string;
  email : string;
  createdAt : string;
  updatedAt : string | null;
  createdBy : UserProfile;
  updatedBy : UserProfile | null;
}

export interface CustomerAccount {
  id:            string;
  balance:              number;
  createdAt:          number[];
  status:           string;
  interestRate:             number;
  overdraft:            number;
  type: string;
  customerDTO: Customer;
}