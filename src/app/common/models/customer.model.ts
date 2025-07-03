export interface Customer {
  id : number;
  name : string;
  email : string;
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