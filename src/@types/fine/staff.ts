export interface TStaff {
  id: string;
  name: string;
  username: string;
  roleType: number;
  storeId: string;
  pass: string;
  isActive: boolean;
  createAt: string;
  updateAt: string;
}

export interface TStaffRequest {
  name: string;
  username: string;
  pass: string;
  roleType: number;
  storeId: string;

}
