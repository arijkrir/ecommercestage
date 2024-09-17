import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../produits.service';

@Component({
  selector: 'app-telephones-tablettes',
  templateUrl: './telephones-tablettes.component.html',
  styleUrls: ['./telephones-tablettes.component.css']
})
export class TelephonesTablettesComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductsByCategory('telephones-tablettes').subscribe(data => {
      this.products = data;
    });
  }
}
