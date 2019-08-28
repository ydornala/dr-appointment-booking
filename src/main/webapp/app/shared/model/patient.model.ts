import { Moment } from 'moment';
import { IAppointment } from 'app/shared/model/appointment.model';

export const enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS'
}

export interface IPatient {
  id?: string;
  fullname?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  email?: string;
  birthdate?: Moment;
  appoinments?: IAppointment[];
}

export const defaultValue: Readonly<IPatient> = {};
