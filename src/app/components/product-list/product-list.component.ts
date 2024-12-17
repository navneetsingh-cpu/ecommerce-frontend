import { Component } from '@angular/core';
import { Product } from '../../common/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,

  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();

    })
  }

  listProducts() {
    const hasCategoryid: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryid) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;

    }
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = [...data];
      }
    )
  }
}
