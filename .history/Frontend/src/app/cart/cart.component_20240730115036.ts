import { OrderService } from '../order.service'; // Importez le service

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Produit[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService // Injectez le service
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items.map(item => ({
        ...item,
        stock: item.stock ?? 0 // Définit stock à 0 si non défini
      }));
      this.updateAvailability();
    });
  }

  increaseQuantity(produit: Produit): void {
    if (produit.stock !== undefined && produit.quantity < produit.stock) {
      produit.quantity++;
      this.updateCart(produit);
    }
  }

  decreaseQuantity(produit: Produit): void {
    if (produit.quantity > 1) {
      produit.quantity--;
      this.updateCart(produit);
    }
  }

  removeFromCart(produit: Produit): void {
    this.cartService.removeFromCart(produit);
    this.cartItems = this.cartItems.filter(item => item !== produit);
  }

  updateCart(produit: Produit): void {
    this.cartService.updateCart(produit);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, produit) => 
      total + produit.quantity * (produit.promoPrice ?? 0), 0);
  }

  confirmOrder(): void {
    const total = this.calculateTotal();
    this.orderService.setTotalAmount(total); // Stockez le total dans le service
    this.router.navigate(['/livraison']);
  }

  updateAvailability(): void {
    this.cartItems.forEach(produit => {
      produit.available = (produit.stock !== undefined) ? produit.stock > 0 : false;
    });
  }
}
