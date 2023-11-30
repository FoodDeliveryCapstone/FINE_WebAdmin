import { TStation, TBoxStation } from 'src/@types/fine/station';
import { BaseResponse, PostResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const getStationList = (): Promise<BaseResponse<TStation>> =>
  request
    .get(`/admin/station?destinationId=70248C0D-C39F-468F-9A92-4A5A7F1FF6BB`)
    .then((res) => res.data);


const getBoxAvailableList = (timeslotId?: string): Promise<BaseResponse<TBoxStation>> =>
  request
    .get(`/admin/box/availableBoxes`, {
      params: {

        timeslotId: timeslotId,
      },
    })
    .then((res) => res.data);
const createStation = (stationRequest: any) =>
  request
    .post<PostResponse<TStation>>(`/admin/station`, {
      ...stationRequest,
    })
    .then((res) => res.data);

const updateStation = (stationId: any, UpdateStationRequest: any) =>
  request
    .put(`/admin/station/${stationId}`, UpdateStationRequest, {})
    .then((res) => res.data);


const createBox = (boxRequest?: any): Promise<BaseResponse<TBoxStation>> =>
  request
    .post(`/admin/box`, boxRequest)
    .then((res) => res.data);

const updateBox = (boxId?: string, boxRequest?: any): Promise<BaseResponse<TBoxStation>> =>
  request
    .put(`/admin/box/availableBoxes`, {
      params: {
        boxId: boxId,
      },
    }, boxRequest)
    .then((res) => res.data);

const stationApi = {
  createStation,
  updateStation,
  updateBox,
  getBoxAvailableList,
  getStationList,
  createBox,
};

export default stationApi;
