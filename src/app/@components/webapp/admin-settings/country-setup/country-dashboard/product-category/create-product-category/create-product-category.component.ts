import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import * as ProductCategoryAction from 'src/app/@core/stores/productCategory/productCategory.actions';
import * as ProductCategorySelector from 'src/app/@core/stores/productCategory/productCategory.selector';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
  styleUrls: ['./create-product-category.component.scss'],
})
export class CreateProductCategoryComponent implements OnInit {
  createProductCategoryForm!: FormGroup;

  countryList: any[] = [];
  editData: any = {};

  isLoading!: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateProductCategoryComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getAllCoutries();
    this.buildCreateProductCategoryForm();

    this.createProductCategoryForm.patchValue({
      countryId: this.data.countryId,
    });

    this.isLoading = this.store.pipe(
      select(ProductCategorySelector.getProductIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editData = this.data?.editData;

      this.createProductCategoryForm.patchValue({
        countryId: this.editData.countryId,
        name: this.editData.name,
        description: this.editData.description,
        isDefault: this.editData.isDefault,
      });
    }
    this.createProductCategoryForm.controls['countryId'].disable();
  }

  getAllCoutries() {
    this.store
      .pipe(select(CountriesSelector.getAllCountry))
      .subscribe((resData: any) => {
        if (resData) {
          this.countryList = resData;
        }
      });
  }

  buildCreateProductCategoryForm() {
    this.createProductCategoryForm = this.fb.group({
      countryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      isDefault: [true],
    });
  }

  get createProductCategoryFormControls() {
    return this.createProductCategoryForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'countryId' &&
      this.createProductCategoryFormControls['countryId'].hasError('required')
    ) {
      return `Please Select Country`;
    } else if (
      instance === 'name' &&
      this.createProductCategoryFormControls['name'].hasError('required')
    ) {
      return `Please Enter Product Category name`;
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.createProductCategoryForm.invalid) {
      return;
    } else {
      this.createProductCategoryForm.controls['countryId'].enable();
      this.store.dispatch(ProductCategoryAction.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createCountry();
      } else if (this.data.type === 'edit') {
        this.editCountry();
      }
    }
  }

  createCountry() {
    this.store.dispatch(
      ProductCategoryAction.CreateProductCategory({
        payload: {
          countryId: this.createProductCategoryForm.value.countryId,
          name: this.createProductCategoryForm.value.name,
          description: this.createProductCategoryForm.value.name,
          isDefault: this.createProductCategoryForm.value.isDefault,
        },
      })
    );
  }

  editCountry() {
    if (this.editData) {
      this.store.dispatch(
        ProductCategoryAction.EditProductCategory({
          payload: {
            id: this.editData.id,
            countryId: this.createProductCategoryForm.value.countryId,
            name: this.createProductCategoryForm.value.name,
            description: this.createProductCategoryForm.value.name,
            isDefault: this.createProductCategoryForm.value.isDefault,
          },
        })
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
