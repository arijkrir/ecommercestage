import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

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
    this.getTopCity();
  }

  
  getTopCity() {
    this.userService.getTopCity().subscribe(city => {
      this.topCity = city;
    });
  }
  
  
  
}