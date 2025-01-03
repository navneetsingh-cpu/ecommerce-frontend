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

  currentCategoryId: number = 1;
  currentCategoryName = 'Books';

  // page
  pageSize = 10;
  totalItems = 0;

  constructor(public productService: ProductService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })

    this.loadData(0, this.pageSize);
  }
  loadData(page: number, size: number) {
    this.productService.getProductListPaginate(page, size, this.currentCategoryId).subscribe((data) => {
      this.productService.products = [...data._embedded.products];
      this.totalItems = data.page.totalElements;
    });
  }

  onPageChange(event: any) {
    const pageIndex = event.pageIndex; // Current page index
    const pageSize = event.pageSize; // Page size selected
    this.loadData(pageIndex, pageSize);
  }

  listProducts() {
    const hasCategoryid: boolean = this.route.snapshot.paramMap.has('id');
    const hasCategoryName: boolean = this.route.snapshot.paramMap.has('categoryName');

    if (hasCategoryid) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    if (hasCategoryName) {
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryName = 'Books';
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.productService.products = [...data];
      }
    )
  }


  addToCart(product: Product) {
    this.productService.addToCart(product)
  }
}
