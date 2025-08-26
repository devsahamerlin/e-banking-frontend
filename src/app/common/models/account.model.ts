import { Customer } from "./customer.model";
import { UserProfile } from "./user-profile.model";

export interface AccountDetails {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPage:           number;
  pageSize:             number;
  operations: AccountOperation[];
}

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          string;
  description:   string;
}

export interface Account {
  id: string;
  balance: number;
  createdAt: string;
  status: string;
  interestRate: number;
  overdraft: number;
  type: string;
  customerDTO: Customer;
  createdBy: UserProfile
} 
