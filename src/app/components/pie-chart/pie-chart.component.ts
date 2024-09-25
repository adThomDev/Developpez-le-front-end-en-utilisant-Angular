import { Component, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
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
    // if(this.olympicCountriesFromParent) {
    //   console.log(this.olympicCountriesFromParent);
    // }

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
        return '<img [src]="medalistImage.default" /><b>' + this.key + '</b> </br> <b>' + this.y + ' médailles</b>';
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
        // data: [
        //   { name: 'COVID 19', y: 1, color: '#eeeeee' },
        //   { name: 'HIV/AIDS', y: 2, color: '#393e46' },
        //   { name: 'EBOLA', y: 3, color: '#00adb5' },
        //   { name: 'DISPORA', y: 4, color: '#eeeeee' },
        //   { name: 'DIABETES', y: 5, color: '#506ef9' },
        // ]
        cursor: 'pointer',
        animation: false,
        point:{
            events:{
                click: function (event) {
                    alert(this.name + " " + this.y);
                }
            }
        }  
      },
    ],
  });
}
