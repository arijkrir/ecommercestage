import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  upsellingProducts: Produit[] = []; // Array to hold upselling products
  crossSellingProducts: Produit[] = []; // Array to hold cross-selling products
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const productId = +paramMap.get('id')!;
      this.loadProductDetails(productId);
      this.loadUpsellingProducts(productId);
      this.loadCrossSellingProducts(productId);
    });
  }

  loadProductDetails(productId: number): void {
    console.log(`Loading details for product ID ${productId}`);
    this.productService.getProductDetails([productId]).subscribe(
      (produits: Produit[]) => {
        console.log('Product details loaded:', produits);
        this.produit = produits[0];
        this.loadCsvAndFtpDetails(productId);
      },
      (error) => {
        console.error('Error loading product details', error);
      }
    );
  }

  loadUpsellingProducts(productId: number): void {
    console.log(`Loading upselling products for product ID ${productId}`);
    this.productService.getUpsellingProducts(productId).subscribe(
      (products: Produit[]) => {
        console.log('Upselling products loaded:', products);
        this.upsellingProducts = products;
      },
      (error) => {
        console.error('Error loading upselling products', error);
      }
    );
  }

  loadCrossSellingProducts(productId: number): void {
    console.log(`Loading cross-selling products for product ID ${productId}`);
    this.productService.getCrossSellingProducts(productId).subscribe(
      (products: Produit[]) => {
        console.log('Cross-selling products loaded:', products);
        this.crossSellingProducts = products;
      },
      (error) => {
        console.error('Error loading cross-selling products', error);
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
      },
      (error) => {
        console.error('Error loading CSV product details', error);
      }
    );

    this.productService.getProductDetailsFromFTPByIds([productId]).subscribe(
      (produits: Produit[]) => {
        if (produits.length > 0 && this.produit) {
          this.produit.stock = produits[0].quantity;
          this.produit.available = this.produit.stock > 0;
        }
      },
      (error) => {
        console.error('Error loading FTP product details', error);
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

  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }
}
