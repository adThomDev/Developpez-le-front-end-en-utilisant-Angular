// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/
import { Participation } from '../models/Participation';

export interface OlympicCountry {
  id: number;
  country: string;
  participations: Participation[];
};

// // Create a class that implements the OlympicCountry interface
// export class OlympicCountryImpl implements OlympicCountry {
//   id: number;
//   country: string;
//   participations: Participation[];

//   constructor(id: number, country: string, participations: Participation[]) {
//     this.id = id;
//     this.country = country;
//     this.participations = participations;
//   }
// }
