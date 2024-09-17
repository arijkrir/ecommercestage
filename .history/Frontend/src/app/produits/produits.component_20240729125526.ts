import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../produits.service';
import { Produit } from '../models/produit.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-productlist-scrollable',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProductlistScrollableComponent implements OnInit {
  produits: Produit[] = [];
  allProductIds: number[] = [];
  offset = 0;
  limit = 1000;
  loading = false;
  hasMoreProduits = true;
  scrollDistance = 100; 
  scrollUpDistance = 1; 
  viewportWidth = 0;

  showAccountOptions = false;
  cartItems: Produit[] = [];
  showCart = false;

  searchTerm: string = '';

  @Output() cartItemCountChanged = new EventEmitter<number>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, 
    private el: ElementRef, 
    private router: Router, 
    private cartService: CartService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['search'];
      const source = params['source'];
  
      if (searchTerm) {
        this.searchTerm = searchTerm;
        this.loadFilteredProducts(searchTerm, source);
      } else {
        this.searchTerm = '';
        this.loadProductIds(); 
      }
    });
  }

  loadFilteredProducts(term: string, source: string): void {
    switch (source) {
      case 'csv':
        this.productService.searchProductscsv(term).subscribe(
          (results: Produit[]) => {
            this.produits = results;
          },
          (error) => {
            console.error('Error fetching search results from CSV', error);
          }
        );
        break;
      case 'ftp':
        this.productService.searchProductsftp(term).subscribe(
          (results: Produit[]) => {
            this.produits = results;
          },
          (error) => {
            console.error('Error fetching search results from FTP', error);
          }
        );
        break;
      case 'details':
      default:
        this.productService.searchProducts(term).subscribe(
          (results: Produit[]) => {
            this.produits = results;
            const ids = results.map(p => p.id);
            this.loadProductDetails(ids);
            this.loadProductQuantities(ids);
          },
          (error) => {
            console.error('Error fetching search results', error);
          }
        );
        break;
    }
  }

  loadProductIds(): void {
    if (this.loading || !this.hasMoreProduits) return;
  
    this.loading = true;
  
    this.productService.getAllProductIds(this.offset, this.limit).subscribe(
      (ids: number[]) => {
        if (ids.length < 1000) {
          this.hasMoreProduits = false;
        }
        this.allProductIds.push(...ids);
        this.loadProductDetails(ids);
        this.loadProductQuantities(ids); 
        this.loading = false;
      },
      (error) => {
        console.error('Error loading product IDs', error);
        this.loading = false;
      }
    );
  }

  loadProductDetails(ids: number[]): void {
    this.productService.getProductDetails(ids).subscribe(
      (produits: Produit[]) => {
        produits.forEach(newProduct => {
          const existingProduct = this.produits.find(product => product.id === newProduct.id);
          if (existingProduct) {
            existingProduct.quantity = 1;
          } else {
            newProduct.quantity = 1;
            this.produits.push(newProduct);
          }
        });
        this.offset += 1000;
        this.limit += 1000;
      },
      (error) => {
        console.error('Error loading product details', error);
      }
    );

    this.productService.getProductDetailsFromCsvByIds(ids).subscribe(
      (produits: Produit[]) => {
        produits.forEach(csvProduct => {
          const existingProduct = this.produits.find(p => p.id === csvProduct.id);
          if (existingProduct) {
            existingProduct.oldPrice = csvProduct.oldPrice;
            existingProduct.promoPrice = csvProduct.promoPrice;
          }
        });
        this.offset += 1000;
        this.limit += 1000;
      },
      (error) => {
        console.error('Error loading product details from CSV', error);
      }
    );
  }

  loadProductQuantities(ids: number[]): void {
    this.productService.getProductDetailsFromFTPByIds(ids).subscribe(
      (produitsFTP: Produit[]) => {
        produitsFTP.forEach(productFTP => {
          const existingProduct = this.produits.find(p => p.id === productFTP.id);
          if (existingProduct) {
            existingProduct.stock = productFTP.quantity;
            existingProduct.available = existingProduct.stock > 0;
          }
        });
        this.offset += 1000;
        this.limit += 1000;
      },
      (error) => {
        console.error('Error loading product quantities from FTP', error);
      }
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    if ( !this.loading && this.hasMoreProduits) {
      this.loadProductIds();
    }
  }

  addToCart(produit: Produit): void {
    this.cartService.addToCart(produit, produit.quantity);
  }

  increaseQuantity(produit: Produit): void {
    produit.quantity++;
  }

  decreaseQuantity(produit: Produit): void {
    if (produit.quantity > 1) {
      produit.quantity--;
    }
  }

  loadCartItemsFromLocalStorage(): void {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      this.cartItems = JSON.parse(cartItems);
      this.cartItemCountChanged.emit(this.cartItems.length);
    }
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  removeFromCart(item: Produit): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartItemCountChanged.emit(this.cartItems.length);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  login(): void {
    console.log('Se connecter...');
    this.showAccountOptions = false;
  }

  register(): void {
    console.log('Créer un compte...');
    this.showAccountOptions = false;
  }
}
