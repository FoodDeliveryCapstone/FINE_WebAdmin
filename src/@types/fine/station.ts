export type TStation = {
  id: string;
  name: string;
  code: string;
  floorId: string;
  areaCode: string;
  isActive: boolean;
  createAt: Date;
  updatedAt: Date;
};
export type TBoxStation = {
  id: string;
  code: string;
  isActive: boolean;
  isHeat: boolean;

};
export type TBox = {
  id: string;
  code: string;
  isActive: boolean;
  isHeat: boolean;
  status: number;
  stationId: string;
};
