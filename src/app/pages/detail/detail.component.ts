import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartComponent } from 'src/app/components/line-chart/line-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  imports: [LineChartComponent, CommonModule, RouterLink],
})
export class DetailComponent implements OnInit {
  private errorSubscription: Subscription;
  public fetchDataErrorCheck$: Observable<string | null> = of(null);
  errorMessage: string | null = null;

  private activatedRoute = inject(ActivatedRoute);
  countryName = this.activatedRoute.snapshot.params['countryName'];

  private countryDataSubscription: Subscription;
  public olympicCountry$: Observable<OlympicCountry | undefined> =
    of(undefined);
  olympicCountry!: OlympicCountry;
  numberOfEntries: number = 0;
  totalNumberOfMedals: number = 0;
  totalNumberOfAthletes: number = 0;

  constructor(private olympicService: OlympicService) {
    this.countryDataSubscription = new Subscription();
    this.errorSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.getOlympicCountryData();
    this.fetchDataErrorCheck();
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
   * Retrieves the data for the given country name, and transform the data to be used in
   * the number of participations, total number of medals and total number of athletes.
   */
    getOlympicCountryData(): void {
      this.olympicCountry$ = this.olympicService.getOlympicByCountry(
        this.countryName
      );
      this.countryDataSubscription = this.olympicCountry$.subscribe(
        (receivedData) => {
          if (receivedData !== undefined) {
            this.errorMessage = null;
            this.olympicCountry = receivedData;
            this.numberOfEntries = this.olympicCountry.participations.length;
            this.totalNumberOfMedals = this.olympicCountry.participations.reduce(
              (sum, p) => sum + p.medalsCount,
              0
            );
            this.totalNumberOfAthletes =
              this.olympicCountry.participations.reduce(
                (sum, p) => sum + p.athleteCount,
                0
              );
          }
          else {
            this.errorMessage = 'Country not found';
          }
        }
      );
    }

  /**
   * Called when the component is destroyed. Unsubscribes from the observables of
   * country data and fetch error to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.countryDataSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
