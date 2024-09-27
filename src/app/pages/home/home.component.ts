import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private subscription: Subscription;
  public olympics$: Observable<OlympicCountry[] | null> = of(null);
  olympicCountries: OlympicCountry[] = [];
  numberOfCountries: number = 0;
  numberOfJOs: number = 0;

  constructor(private olympicService: OlympicService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription = this.olympics$.subscribe((receivedData) => {
      if (receivedData !== null) {
        this.olympicCountries = receivedData;
        this.numberOfCountries = this.olympicCountries.length;
        this.numberOfJOs = this.olympicCountries[0].participations.length;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); //TODO check si c'est ça
  }
}
