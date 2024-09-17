import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  topClients: any[] = [];
  topCity: string = '';
  topProducts: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getTopClients();
    this.getTopCity();
    this.getTopProducts();
  }

  getTopClients() {
    // Ajoutez la logique pour obtenir les clients qui achètent le plus
    // this.topClients = ...
  }

  getTopCity() {
    // Ajoutez la logique pour obtenir la ville qui achète le plus
    // this.topCity = ...
  }

  getTopProducts() {
    // Ajoutez la logique pour obtenir les produits les plus vendus
    // this.topProducts = ...
  }
}
