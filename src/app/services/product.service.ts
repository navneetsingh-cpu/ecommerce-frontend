import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Product } from '../common/product.model';
import { ProductCategory } from '../common/product-category.model';

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

@Injectable({
  providedIn: 'root'
})


export class ProductService {



  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  products: Product[] = [];
  cartItems: Product[] = [];

  // BehaviorSubject allows components to react to cart changes
  private cartSubject = new BehaviorSubject<Product[]>(this.cartItems);


  constructor(private httpClient: HttpClient) {
  }
  // Method to get the current cart as an Observable
  getCart(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }

  // Method to add a product to the cart
  addToCart(product: Product): void {
    // Check if the product is already in the cart
    const existingProduct = this.cartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      // Increment the quantity if the product exists
      existingProduct.quantity! += 1;
    } else {
      // Add the product with quantity = 1
      product.quantity = 1;
      this.cartItems.push(product);
    }

    // Emit updated cart items to all subscribers
    this.cartSubject.next(this.cartItems);
  }

  // Method to clear the cart
  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
  }

  // Optional: Get total items count
  getTotalItemsCount(): number {
    return this.cartItems.reduce((total, product) => total + (product.quantity || 1), 0);
  }

  getTotalItems(): Product[] {
    return [...this.cartItems];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, product) => total + (product.unitPrice * (product.quantity || 1)),
      0
    );
  }
  // Remove product from the cart
  removeFromCart(product: Product): void {
    const productIndex = this.cartItems.findIndex((item) => item.id === product.id);

    if (productIndex > -1) {
      const product = this.cartItems[productIndex];

      // Decrease quantity if more than 1, otherwise remove the item
      if (product.quantity && product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.cartItems.splice(productIndex, 1); // Remove the product
      }

      this.cartSubject.next(this.cartItems); // Notify subscribers
    }
  }


  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    let params = new HttpParams();
    params = params.set('id', theCategoryId);
    params = params.set('page', thePage);
    params = params.set('size', thePageSize);

    const searchUrl = `${this.baseUrl}/search/findByCategoryId`;
    return this.httpClient.get<GetResponseProducts>(searchUrl, { params });
  }


  getProductList(theCategoryId: number): Observable<Product[]> {
    let params = new HttpParams();
    params = params.set('id', theCategoryId);
    const searchUrl = `${this.baseUrl}/search/findByCategoryId`;
    return this.httpClient.get<GetResponseProducts>(searchUrl, { params }).pipe(
      map(response => response._embedded.products)
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    let params = new HttpParams();
    params = params.set('name', keyword);
    const searchUrl = `${this.baseUrl}/search/findByNameContaining`;
    return this.httpClient.get<GetResponseProducts>(searchUrl, { params }).pipe(
      map(response => response._embedded.products)
    );
  }


  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }



}
