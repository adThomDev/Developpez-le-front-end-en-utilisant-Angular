import { Component, Input } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { OlympicCountry } from 'src/app/core/models/Olympic';
// @ts-ignore
import medalistImage from 'src/assets/images/medalist.png';

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

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
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

  pieChart = new Chart({
    chart: {
      type: 'pie',
      // plotShadow: false,
    },
    // credits: {
    //   enabled: false,
    // },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return (
          '<img [src]="medalistImage.default" /><b>' +
          this.key +
          '</b> </br> <b>' +
          this.y +
          ' médailles</b>'
        );
      },
      style: {
        color: 'white',
        fontWeight: 'bold',
      },
      backgroundColor: '#3b818f',
      // enabled: false,
      // valueDecimals: 2,
      // valueSuffix: ' médailles'
    },
    title: {
      // verticalAlign: 'middle',
      // floating: true,
      text: '',
    },
    // legend: {
    //   enabled: false,
    // },
    series: [
      {
        type: 'pie',
        data: this.pieData,
        cursor: 'pointer',
        animation: false,
        point: {
          events: {
            click: function (event) {
              // alert(this.name + " " + this.y);
              // console.log(event.point.options.name);
              location.href =
                'http://localhost:4200/detail/' + event.point.options.name;
            },
          },
        },
      },
    ],
    accessibility: {
      enabled: false
    },
  });
}
