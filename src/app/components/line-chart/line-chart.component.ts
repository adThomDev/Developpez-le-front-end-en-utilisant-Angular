import { Component, Input, AfterViewInit } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { OlympicCountry } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements AfterViewInit {
  @Input() olympicCountryFromParent!: OlympicCountry;

  years: string[] = [];
  medalsCount: (number | null)[] = [];
  lineChart: Chart = new Chart({});

  ngOnInit(): void {
    const minYear = Math.min(
      ...this.olympicCountryFromParent.participations.map((p) => p.year)
    );
    const maxYear = Math.max(
      ...this.olympicCountryFromParent.participations.map((p) => p.year)
    );

    for (let year = minYear; year <= maxYear; year++) {
      this.years.push(year.toString());
      const participation = this.olympicCountryFromParent.participations.find(
        (p) => p.year === year
      );
      this.medalsCount.push(participation ? participation.medalsCount : null);
    }
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    this.lineChart = new Chart({
      chart: {
        type: 'line',
      },
      title: {
        verticalAlign: 'bottom',
        text: 'Dates',
      },
      xAxis: {
        categories: [...this.years],
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      series: [
        {
          type: 'line',
          name: this.olympicCountryFromParent.country,
          data: [...this.medalsCount],
        },
      ],
      plotOptions: {
        series: {
          connectNulls: true,
        },
      },
      accessibility: {
        enabled: false
      },
    });
  }
}
