import { TTimeSlot } from 'src/@types/fine/timeslot';
import { BaseResponse, PostResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const currentDate = new Date();
const currentHour = currentDate.getHours();

const getTimeslotList = (destinationId: string): Promise<BaseResponse<TTimeSlot>> =>
  request
    .get(`admin/timeslot/destination/${destinationId}`, {
      params: {
        page: 1,
        PageSize: 20
      },
    })
    .then((res) => res.data);
const createTimeslot = (timeslotRequest: TTimeSlot) =>
  request
    .post<PostResponse<TTimeSlot>>(`/admin/timeslot`, {
      ...timeslotRequest,
    })
    .then((res) => res.data);

const updateTimeslot = (timeslotId: any, UpdateTimeslotRequest: any) =>
  request
    .put(`/admin/timeslot/${timeslotId}`, UpdateTimeslotRequest, {})
    .then((res) => res.data);

const timeslotApi = {
  createTimeslot,
  updateTimeslot,
  getTimeslotList,
};

export default timeslotApi;
