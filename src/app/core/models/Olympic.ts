import { Participation } from '../models/Participation';

export interface OlympicCountry {
  id: number;
  country: string;
  participations: Participation[];
}
