import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  topCities: any[] = [];
  errorMessage: string = '';
  chartData: any[] = [];
  chartOptions = {
    title: 'Villes les plus actives',
    is3D: true
  };
  chartType: ChartType = ChartType.PieChart;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getTopCities();
  }

  getTopCities() {
    this.userService.getTopCity().subscribe(
      cities => {
        if (cities && cities.length > 0) {
          this.topCities = cities;
          this.prepareChartData();
        } else {
          this.errorMessage = 'Aucune ville trouvée';
        }
      },
      error => {
        console.error('Erreur lors de la récupération des villes:', error);
        this.errorMessage = 'Erreur lors de la récupération des villes';
      }
    );
  }

  prepareChartData() {
    this.chartData = this.topCities.map(city => [city.ville, city.commandes]);
  }
}
