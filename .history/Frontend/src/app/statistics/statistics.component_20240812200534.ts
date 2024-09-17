import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements AfterViewInit {
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';
  pieChartPlugins = [];

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.loadCityData();
  }

  private loadCityData(): void {
    this.http.get<any>('http://localhost:5102/api/users')  // Remplacez par l'URL correcte
      .subscribe(data => {
        const cityCounts = this.calculateCityCounts(data);
        this.pieChartLabels = Object.keys(cityCounts);
        this.pieChartData = Object.values(cityCounts);
      });
  }

  private calculateCityCounts(data: any): { [key: string]: number } {
    const cityCounts: { [key: string]: number } = {};

    data.forEach((user: any) => {
      const city = user.ville;
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });

    return cityCounts;
  }
}
