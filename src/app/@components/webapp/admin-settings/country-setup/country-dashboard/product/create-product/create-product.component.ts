import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import * as ProductAction from 'src/app/@core/stores/product/product.actions';
import * as ProductSelector from 'src/app/@core/stores/product/product.selector';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  createProductForm!: FormGroup;
  isLoading!: Observable<boolean>;
  productCategoryList: any[] = [];

  editProductData: any = {};
  getProductCategorySub!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateProductComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.buildCreateProductForm();
    this.productCategoryList = this.data.productCategoryList;

    this.isLoading = this.store.pipe(
      select(ProductSelector.getProductIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editProductData = this.data?.editData;

      this.createProductForm.patchValue({
        name: this.editProductData.name,
        productCategoryId: this.editProductData.productCategoryId,
      });
    }
  }

  buildCreateProductForm() {
    this.createProductForm = this.fb.group({
      name: [null, [Validators.required]],
      productCategoryId: [null, [Validators.required]],
    });
  }

  get createProductFormControls() {
    return this.createProductForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.createProductFormControls['name'].hasError('required')
    ) {
      return `Please Enter Product Name`;
    } else if (
      instance === 'productCategoryId' &&
      this.createProductFormControls['productCategoryId'].hasError('required')
    ) {
      return `Please select Product Category`;
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.createProductForm.invalid) {
      return;
    } else {
      // this.createProductForm.controls['countryId'].enable();
      this.store.dispatch(ProductAction.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createProduct();
      } else if (this.data.type === 'edit') {
        this.editProduct();
      }
    }
  }

  createProduct() {
    this.store.dispatch(
      ProductAction.CreateProducts({
        payload: {
          name: this.createProductForm.value.name,
          description: this.createProductForm.value.name,
          productCategoryId: this.createProductForm.value.productCategoryId,
        },
      })
    );
  }

  editProduct() {
    if (this.editProductData) {
      this.store.dispatch(
        ProductAction.EditProducts({
          payload: {
            id: this.editProductData.id,
            name: this.createProductForm.value.name,
            description: this.createProductForm.value.name,
            productCategoryId: this.createProductForm.value.productCategoryId,
          },
        })
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
