import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,

  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private searchSubject = new Subject<string>();

  public inputValue = '';
  constructor(private productService: ProductService, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.inputValue = ''; // Clear the input
      }
    });
  }

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after typing
        distinctUntilChanged(), // Ignore duplicate values
        switchMap((query) => this.productService.searchProducts(query)) // Cancel previous request
      )
      .subscribe({
        next: (results) => (this.productService.products = results),
      });
  }

  search(e: any) {
    const value = e.target.value;
    this.searchSubject.next(value); // Emit search term
  }
}


