import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  public pieChartData: ChartData<'pie'> = { datasets: [], labels: [] };
  public pieChartOptions: ChartOptions = {
    responsive: true
  };
  public pieChartType: ChartType = 'pie';

  private apiUrl = 'http://localhost:5102/api/users'; // URL de votre API backend

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCityData();
  }

  private loadCityData(): void {
    this.http.get<any>(this.apiUrl).subscribe(data => {
      const cityCounts: { [key: string]: number } = {};
      data.forEach((user: any) => {
        const city = user.Ville;
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });

      const totalUsers = data.length;
      const labels: string[] = [];
      const values: number[] = [];
      const colors: string[] = [];

      for (const city in cityCounts) {
        const percentage = (cityCounts[city] / totalUsers) * 100;
        labels.push(`${city} (${percentage.toFixed(2)}%)`);
        values.push(cityCounts[city]);

        // Générer une couleur aléatoire pour chaque ville
        colors.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
      }

      this.pieChartData = {
        labels: labels,
        datasets: [{ data: values, backgroundColor: colors }]
      };
    });
  }
}
