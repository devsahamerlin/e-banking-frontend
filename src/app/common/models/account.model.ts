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
