import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | null> = of(null);
  olympicCountries: OlympicCountry[] = [];
  numberOfCountries: number = 0;
  numberOfJOs: number = 0;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((receivedData) => {
      if (receivedData !== null) {
        this.olympicCountries = receivedData;
        this.numberOfCountries = this.olympicCountries.length;
        this.numberOfJOs = this.olympicCountries[0].participations.length;
      }
    });
  }
}
