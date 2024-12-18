import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product.model';


@Component({
  selector: 'app-cart-detail',
  standalone: false,
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.css'
})


export class CartDetailComponent {

  displayedColumns: string[] = ['imageUrl', 'detail', 'totals',];
  dataSource: Product[] = [];

  constructor(public productService: ProductService) {

  }

  ngOnInit() {
    this.productService.getCart().subscribe((data) => {
      this.dataSource = [...data];
    })
  }

}
