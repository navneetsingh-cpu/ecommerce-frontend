import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-checkout',
  standalone: false,

  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  personalFormGroup: FormGroup;
  shippingFormGroup: FormGroup;
  billingFormGroup: FormGroup;
  paymentFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private productService: ProductService) {
    this.personalFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.shippingFormGroup = this._formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', Validators.required],
    });

    this.billingFormGroup = this._formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', Validators.required],
    });

    this.paymentFormGroup = this._formBuilder.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{16}$/), // Exactly 16 digits
        ],
      ],
      expiryDate: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), // Format MM/YY
        ],
      ],
      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}$/), // Exactly 3 digits
        ],
      ],
    });
  }

  // Utility method to get error message for a specific field
  getErrorMessage(field: string, group: FormGroup) {
    const control = group.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    if (control?.hasError('pattern')) {
      if (field === 'postalCode') return 'Invalid postal code format';
      if (field === 'cardNumber') return 'Card number must be 16 digits';
      if (field === 'expiryDate') return 'Expiry date must be in MM/YY format';
      if (field === 'cvv') return 'CVV must be 3 digits';
    }
    return '';
  }

  submitOrder() {
    if (
      this.personalFormGroup.valid &&
      this.shippingFormGroup.valid &&
      this.billingFormGroup.valid &&
      this.paymentFormGroup.valid
    ) {
      console.log('Order Submitted!');
      console.log('Personal Info:', this.personalFormGroup.value);
      console.log('Shipping Address:', this.shippingFormGroup.value);
      console.log('Billing Address:', this.billingFormGroup.value);
      console.log('Payment Info:', this.paymentFormGroup.value);

      const purchase = {
        customer: {
          ...this.personalFormGroup.value
        },
        shippingAddress: {
          ...this.shippingFormGroup.value
        },
        billingAddress: {
          ...this.billingFormGroup.value
        },
        order: {
          totalPrice: this.productService.getTotalPrice(),
          totalQuantity: this.productService.getTotalItemsCount()
        },
        orderItems: [
          ...this.productService.getTotalItems().map((item) => {
            return {
              imageUrl: item.imageUrl,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              productId: item.id,
            }
          })
        ]
      };

      console.log('purchase', purchase);

      this.productService.placeOrder(purchase).subscribe();
    } else {
      console.log('Form is not valid. Please fix errors.');
    }
  }
}
