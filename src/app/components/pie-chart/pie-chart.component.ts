import { Component, Input } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { OlympicCountry } from 'src/app/core/models/Olympic';
// @ts-ignore
import { medalistImage } from 'src/assets/images';
// import medalistImage from 'src/assets/images/medalist.png';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  @Input() olympicCountriesFromParent!: OlympicCountry[];

  pieData: Array<{ name: string; y: number; color: string }> = [];

  getRandomNumber0to10(): number {
    const range = 40;

    return Math.random() < 0.5
      ? -Math.floor(Math.random() * range)
      : Math.floor(Math.random() * range);
  }

  getRandomColor(): string {
    const r = 140 + this.getRandomNumber0to10();
    const g = 90 + this.getRandomNumber0to10();
    const b = 150 + this.getRandomNumber0to10();

    return `rgb(${r}, ${g}, ${b})`;
  }

  ngOnInit(): void {
    this.olympicCountriesFromParent.forEach((country) => {
      const totalMedals = country.participations.reduce(
        (acc, participation) => acc + participation.medalsCount,
        0
      );
      this.pieData.push({
        name: country.country,
        y: totalMedals,
        color: this.getRandomColor(),
      });
    });
  }

  medalistImage = './assets/images/medalist.png';

  pieChart = new Chart({
    chart: {
      type: 'pie',
      plotShadow: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        states: {
          inactive: {
            opacity: 1,
          },
          hover: {
            enabled: false,
          },
        },
      },
    },
    tooltip: {
      shape: 'rect',
      useHTML: true,
      formatter: function () {
        return `
          <b style="display: flex; align-items: center;"> ${this.key}</b>
          </br>
          <div style="display: flex; align-items: center; justify-content: center;">
            <img src="/assets/images/medal.svg" alt="image" width="12" height="12">
            <b>${this.y}</b>
          </div>`;
      },
      style: {
        color: 'white',
        fontWeight: 'bold',
      },
      backgroundColor: '#3b818f',
    },
    title: {
      text: '',
    },
    series: [
      {
        type: 'pie',
        data: this.pieData,
        cursor: 'pointer',
        animation: false,
        point: {
          events: {
            click: function (event) {
              location.href =
                'http://localhost:4200/detail/' + event.point.options.name;
            },
          },
        },
      },
    ],
    accessibility: {
      enabled: false,
    },
  });
}
