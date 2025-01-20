import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Observable, Subscription } from 'rxjs';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRouteSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';

@Component({
  selector: 'app-create-migration-route',
  templateUrl: './create-migration-route.component.html',
  styleUrls: ['./create-migration-route.component.scss'],
})
export class CreateMigrationRouteComponent implements OnInit, OnDestroy {
  createMigrationForm!: FormGroup;

  countryList: any[] = [];

  editMigrationRouteData: any = {};
  isLoading!: Observable<boolean>;
  getAllContriesSub!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateMigrationRouteComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getAllCountry();
    this.buildCreateMigrationForm();

    this.isLoading = this.store.pipe(
      select(MigrationRouteSelector.getMigrationRouteIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editMigrationRouteData = this.data?.editData;

      this.createMigrationForm.patchValue({
        countryId: this.editMigrationRouteData.countryId,
        name: this.editMigrationRouteData.name,
        description: this.editMigrationRouteData.description,
        routeUrl: this.editMigrationRouteData.routeUrl,
      });
    } else {
      this.createMigrationForm.patchValue({
        countryId: this.data.countryId,
      });
    }
    this.createMigrationForm.controls['countryId'].disable();
  }

  getAllCountry() {
    this.store.dispatch(
      CountriesActions.GetAllCountry({
        payload: {
          skip: 0,
          take: 9999,
        },
      })
    );
    this.getAllContriesSub = this.store
      .pipe(select(CountriesSelector.getAllCountry))
      .subscribe((resData: any) => {
        if (resData) {
          this.countryList = resData;
        }
      });
  }

  buildCreateMigrationForm() {
    this.createMigrationForm = this.fb.group({
      countryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      routeUrl: ['', [Validators.required]],
      description: [null],
      isDefault: [true],
      routeFees: [[]],
    });
  }

  get createMigrationRouteFormControls() {
    return this.createMigrationForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'countryId' &&
      this.createMigrationRouteFormControls['countryId'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'name' &&
      this.createMigrationRouteFormControls['name'].hasError('required')
    ) {
      return `Please enter Route name`;
    } else if (
      instance === 'routeUrl' &&
      this.createMigrationRouteFormControls['routeUrl'].hasError('required')
    ) {
      return `Please enter Route URL`;
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.createMigrationForm.invalid) {
      return;
    } else {
      this.createMigrationForm.controls['countryId'].enable();
      this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createMigrationRoute();
      } else if (this.data.type === 'edit') {
        this.editMigrationRoute();
      }
    }
  }

  createMigrationRoute() {
    this.store.dispatch(
      MigrationRoutesActions.CreateMigrationRoutes({
        payload: {
          countryId: this.createMigrationForm.value.countryId,
          name: this.createMigrationForm.value.name,
          description: this.createMigrationForm.value.description,
          routeUrl: this.createMigrationForm.value.routeUrl,
          isDefault: this.createMigrationForm.value.isDefault,
          routeFees: this.createMigrationForm.value.routeFees,
        },
      })
    );
  }

  editMigrationRoute() {
    if (this.editMigrationRouteData) {
      this.store.dispatch(
        MigrationRoutesActions.EditMigrationRoutes({
          payload: {
            id: this.editMigrationRouteData.id,
            countryId: this.createMigrationForm.value.countryId,
            name: this.createMigrationForm.value.name,
            description: this.createMigrationForm.value.description,
            isDefault: this.createMigrationForm.value.isDefault,
            routeFees: this.createMigrationForm.value.routeFees,
            routeUrl: this.createMigrationForm.value.routeUrl,
          },
        })
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.getAllContriesSub) {
      this.getAllContriesSub;
    }
  }
}
