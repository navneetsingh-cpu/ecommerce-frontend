import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from './common/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ecommerce';
  totalItems = 0;
  cartItems: Product[] = [];
  totalPrice = 0;

  constructor(public productService: ProductService) {


  }

  ngOnInit() {
    this.productService.getCart().subscribe((items) => {
      this.cartItems = items;
      this.totalItems = this.productService.getTotalItemsCount();
      this.totalPrice = this.productService.getTotalPrice();
    });
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
  }

}
