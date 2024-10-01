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
  private errorSubscription: Subscription;
  public fetchDataErrorCheck$: Observable<string | null> = of(null);
  errorMessage: string | null = null;
  private countriesDataSubscription: Subscription;
  public olympics$: Observable<OlympicCountry[] | null> = of(null);
  olympicCountries: OlympicCountry[] = [];
  numberOfCountries: number = 0;
  numberOfJOs: number = 0;

  constructor(private olympicService: OlympicService) {
    this.countriesDataSubscription = new Subscription();
    this.errorSubscription = new Subscription();
  }


  ngOnInit(): void {
    this.fetchDataErrorCheck();
    this.getOlympicCountriesData();    
  }

  /**
   * Subscribes to the fetch error observable from the olympic service and assigns
   * the error message to the errorMessage field when the error occurs.
   */
  fetchDataErrorCheck(): void {
    this.fetchDataErrorCheck$ = this.olympicService.getFetchError();
    this.errorSubscription = this.fetchDataErrorCheck$.subscribe((error) => {
      this.errorMessage = error;
    });
  }

  /**
   * Retrieves the data for all countries from the dtb and assigns the number of
   * countries and the number of JOs to the respective fields.
   */
  getOlympicCountriesData(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.countriesDataSubscription = this.olympics$.subscribe((receivedData) => {
      if (receivedData !== null) {
        this.olympicCountries = receivedData;
        this.numberOfCountries = this.olympicCountries.length;
        this.numberOfJOs = this.olympicCountries[0].participations.length;
      }
    }); 
  }

  /**
   * Called when the component is destroyed. Unsubscribes from the observables of
   * countries data and fetch error to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.countriesDataSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
