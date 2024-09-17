import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../produits.service';
import { Produit } from '../models/produit.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  produit: Produit | undefined;
  upsellingProducts: any[] = []; 
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProductDetails(productId);
  }

  loadProductDetails(productId: number): void {
    this.productService.getProductDetails([productId]).subscribe(
      (produits: Produit[]) => {
        this.produit = produits[0]; 
        this.loadCsvAndFtpDetails(productId);
      },
      (error) => {
        console.error('Error loading product details', error);
      }
    );
  }

  loadCsvAndFtpDetails(productId: number): void {
    this.productService.getProductDetailsFromCsvByIds([productId]).subscribe(
      (produits: Produit[]) => {
        if (produits.length > 0 && this.produit) {
          this.produit.oldPrice = produits[0].oldPrice;
          this.produit.promoPrice = produits[0].promoPrice;
        }
      }
    );

    this.productService.getProductDetailsFromFTPByIds([productId]).subscribe(
      (produits: Produit[]) => {
        if (produits.length > 0 && this.produit) {
          this.produit.stock = produits[0].quantity;
          this.produit.available = this.produit.stock > 0;
        }
      }
    );
  }

  increaseQuantity(): void {
    if (this.produit && this.produit.stock !== undefined && this.quantity < this.produit.stock) {
      this.quantity++;
    }
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(): void {
    if (this.produit) {
      this.cartService.addToCart(this.produit, this.quantity);
    }
  }

  loadUpsellingProducts(productId: number): void {
    this.productService.getUpsellingProducts(productId).subscribe(
      (products) => {
        this.upsellingProducts = products;
      },
      (error) => {
        console.error('Error loading upselling products', error);
      }
    );
  }
}
