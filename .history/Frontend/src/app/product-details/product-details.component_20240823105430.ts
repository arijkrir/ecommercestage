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

  increaseQuantity(produit: Produit): void {
    if (produit.stock !== undefined && produit.quantity < produit.stock) {
      produit.quantity++;
    }
  }
  
  decreaseQuantity(produit: Produit): void {
    if (produit.quantity > 1) {
      produit.quantity--;
    }
  }
  
  addToCart(): void {
    if (this.produit) {
      this.cartService.addToCart(this.produit, this.quantity);
    }
  }
  
}
