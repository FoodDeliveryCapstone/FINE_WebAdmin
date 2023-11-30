export type TCustomer = {
  id: string;
  name: string;
  customerCode: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  imageUrl: string;
  createAt: string;
  updateAt: string;
};

export type TCustomerRequest = {
  name: string;
  phone: string;
  imageUrl: string;
  dateOfBirth: Date;
  
};
