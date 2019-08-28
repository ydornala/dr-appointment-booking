import { Moment } from 'moment';
import { IPatient } from 'app/shared/model/patient.model';

export const enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface IAppointment {
  id?: string;
  fixedDate?: Moment;
  symptoms?: string;
  status?: Status;
  startTime?: Moment;
  endTime?: Moment;
  patient?: IPatient;
}

export const defaultValue: Readonly<IAppointment> = {};
