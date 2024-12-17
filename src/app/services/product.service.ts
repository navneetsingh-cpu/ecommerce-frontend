import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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


  constructor(private httpClient: HttpClient) {
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
