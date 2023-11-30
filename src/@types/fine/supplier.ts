import { TArea } from "./area";

export type TSupplier = {
  id: number;
  storeName: string;
  imageUrl: string;
  contactPerson: string;
  address: string;
  type: string;
  updatedDate: Date;
  createdDate: Date;
  active: boolean;
  areaId: number;
  area: TArea;
  
}