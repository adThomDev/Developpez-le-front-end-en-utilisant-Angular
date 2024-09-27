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
  private subscription: Subscription;
  public olympicCountry$: Observable<OlympicCountry | undefined> = of(undefined);
  olympicCountry!: OlympicCountry;
  private activatedRoute = inject(ActivatedRoute);
  countryName = this.activatedRoute.snapshot.params['countryName'];
  numberOfEntries: number = 0;
  totalNumberOfMedals: number = 0;
  totalNumberOfAthletes: number = 0;

  constructor(private olympicService: OlympicService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.olympicCountry$ = this.olympicService.getOlympicByCountry(
      this.countryName
    );
    this.subscription = this.olympicCountry$.subscribe((receivedData) => {
      if (receivedData !== undefined) {
        console.log('receivedData ');
        console.log(receivedData);
        this.olympicCountry = receivedData;

        this.numberOfEntries = this.olympicCountry.participations.length;
        this.totalNumberOfMedals = this.olympicCountry.participations.reduce(
          (sum, p) => sum + p.medalsCount,
          0
        );
        this.totalNumberOfAthletes = this.olympicCountry.participations.reduce(
          (sum, p) => sum + p.athleteCount,
          0
        );
      }
    });

    // if (window.innerWidth > 1000) {
    //   this.styles['margins-lr'] = '10%';
    // } //TODO

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); //TODO check si c'est ça
  }
}
