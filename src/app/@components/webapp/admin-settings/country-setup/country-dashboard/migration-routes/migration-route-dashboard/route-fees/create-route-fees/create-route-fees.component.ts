import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelector from 'src/app/@core/stores/general/general.selectors';
import * as FamilyMemberActions from 'src/app/@core/stores/familyMembers/familyMembers.actions';
import * as FamilyMemberSelector from 'src/app/@core/stores/familyMembers/familyMembers.selectors';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRoutesSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';
import * as InvoiceCurrenciesAction from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.actions';
import * as InvoiceCurrenciesSelector from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.selectors';
import * as RouteFeeActions from 'src/app/@core/stores/routeFees/routeFees.actions';
import * as RouteFeeSelectors from 'src/app/@core/stores/routeFees/routeFees.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { IInvestmentTier } from 'src/app/@core/interfaces/investmentTier.interface';

export interface FeeType {
  name: string;
  description: string;
  value: number;
}

@Component({
  selector: 'app-create-route-fees',
  templateUrl: './create-route-fees.component.html',
  styleUrls: ['./create-route-fees.component.scss'],
})
export class CreateRouteFeesComponent implements OnInit, OnDestroy {
  addRouteFeeForm!: FormGroup;

  migrationRouteId!: number;
  isLoading!: Observable<boolean>;
  isLoading2!: Observable<boolean>;
  isLoading3!: Observable<boolean>;
  getMigrationRouteByIdSub!: Subscription;

  selectedMigration: any = {};
  selectedCountry: any = {};

  allFeeList: any[] = [];
  selectedFeeList: any[] = [0];

  feeTypeList: FeeType[] = [];
  feeCategoryList: any[] = [
    { name: 'Local fee', value: 1 },
    { name: 'Country fee', value: 2 },
    { name: 'Program fee', value: 3 },
  ];
  feeCategoryList2: any[] = [
    { name: 'Local fee', value: 1 },
    { name: 'Country fee', value: 2 },
    { name: 'Program fee', value: 3 },
  ];
  feeBasisList: any[] = [];
  feeBasisListOg: any[] = [];
  familyGroupList: any[] = [];

  invoiceCurrencyList: any[] = [];
  investmentTierList: IInvestmentTier[] = [];
  defaultInvoiceCurrency!: any;

  familyMemberList: any[] = [];

  pushFeeSub!: Subscription;
  editData: any = {};
  editing: boolean = false;
  routeFeeEditId!: number;
  isInvoiceCurrencyError = false;

  removedItems: any[] = [];

  protected unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('routeId')) {
      this.migrationRouteId = parseInt(
        this.route.snapshot.paramMap.get('routeId') || ''
      );

      this.getMigrationRouteById();
    } else {
      this.router.navigate(['/app/admin-settings/country-setup']);
    }

    this.getAllFeeBasis();
    this.getAllFeeType();
    this.getAllFamilyMembers();
    this.getAllFamilyGroup();
    this.buildForm();
    this.getAllRouteFeeByMigrationId();
    this.getInvoiceCurrency();
    this.manageAllInvestmentTiers();

    this.isLoading = this.store.pipe(
      select(MigrationRoutesSelector.getMigrationRouteIsLoading)
    );
    this.isLoading2 = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );
    this.isLoading3 = this.store.pipe(
      select(RouteFeeSelectors.getRouteFeeIsLoading)
    );
  }

  typeSelection() {
    if (this.route.snapshot.paramMap.get('feeId') || this.editing === true) {
      // EDITING
      this.editing = true;

      this.routeFeeEditId = Number(this.route.snapshot.paramMap.get('feeId'));
      const questionIndex = this.allFeeList.findIndex(
        (value: any) => value.id === this.routeFeeEditId
      );

      this.selectedFeeList = [questionIndex];
      this.selectedFees(null, questionIndex);
    } else {
      // CREATING
      this.editing = false;
    }
  }

  getMigrationRouteById() {
    this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      MigrationRoutesActions.GetMigrationRoutesById({
        payload: {
          id: this.migrationRouteId,
        },
      })
    );

    this.getMigrationRouteByIdSub = this.store
      .pipe(select(MigrationRoutesSelector.getMigrationRoutesById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedMigration = res;
          this.getCountryById();
        }
      });
  }

  getCountryById() {
    this.store.dispatch(CountriesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      CountriesActions.GetCountryById({
        payload: {
          id: this.selectedMigration?.countryId || 0,
        },
      })
    );

    this.store
      .pipe(select(CountriesSelector.getCountryById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedCountry = res;
        }
      });
  }

  getAllFeeType() {
    this.store.dispatch(GeneralActions.GetFeeType());

    this.store
      .pipe(select(GeneralSelector.getAllFeeType))
      .subscribe((resData) => {
        if (resData) {
          this.feeTypeList = resData;
        }
      });
  }

  getAllFeeBasis() {
    this.store.dispatch(GeneralActions.GetFeeBases());

    this.store
      .pipe(select(GeneralSelector.getAllFeeBasis))
      .subscribe((resData: any) => {
        if (resData) {
          this.feeBasisListOg = [...resData].filter((x: any) => x.value !== 3);
          this.feeBasisList = this.feeBasisListOg.filter(
            (x: any) =>
              x.value !== 2 &&
              x.value !== 3 &&
              x.value !== 4 &&
              x.value !== 5 &&
              x.value !== 7
          );
        }
      });
  }

  getAllFamilyGroup() {
    this.store.dispatch(GeneralActions.GetFamilyGroups());

    this.store
      .pipe(select(GeneralSelector.getAllFamilyGroups))
      .subscribe((resData: any) => {
        if (resData) {
          this.familyGroupList = resData;
        }
      });
  }

  getAllFamilyMembers() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.store.dispatch(
      FamilyMemberActions.GetActiveFamilyMembersByCountryId({
        payload: { id: countryId },
      })
    );

    this.store
      .pipe(select(FamilyMemberSelector.getActiveFamilyMembersByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          this.familyMemberList = resData;
        }
      });
  }

  getAllInvestmentTiersByMigrationId() {
    const migrationId = parseInt(
      this.route.snapshot.paramMap.get('routeId') || ''
    );
    this.store.dispatch(
      MigrationRoutesActions.GetAllInvestmentTiersByMigrationRouteId({
        payload: {
          migrationRouteId: migrationId,
        },
      })
    );
  }

  manageAllInvestmentTiers() {
    this.getAllInvestmentTiersByMigrationId();

    this.store
      .pipe(select(MigrationRoutesSelector.getAllInvestmentTiers))
      .subscribe((resData: any) => {
        if (resData) {
          this.investmentTierList = resData;
        }
      });
  }

  getInvoiceCurrency() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.store.dispatch(
      InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId({
        payload: { id: countryId },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(InvoiceCurrenciesSelector.getAllInvoiceCurrenciesByCountryId)
      )
      .subscribe((resData: any) => {
        if (resData) {
          if (resData.length < 1) {
            this.isInvoiceCurrencyError = true;
            this.throwInvoiceCurrencyError();
          } else {
            this.invoiceCurrencyList = resData;
            const arr = this.invoiceCurrencyList.filter(
              (x) => x.isDefault === true
            );

            this.defaultInvoiceCurrency = arr.length > 0 ? arr[0] : resData[0];

            this.isInvoiceCurrencyError = false;
          }
        }
      });
  }

  throwInvoiceCurrencyError() {
    const notification: Notification = {
      state: 'error',
      message: `Please configure invoice currency before creating migration route`,
    };

    this.notificationService.openSnackBar(
      notification,
      'opt-notification-error'
    );
  }

  getAllRouteFeeByMigrationId() {
    this.store.dispatch(
      RouteFeeActions.GetAllRouteFeesByMigrationId({
        payload: {
          id: parseInt(this.route.snapshot.paramMap.get('routeId') || ''),
        },
      })
    );
    this.pushFeeSub = this.store
      .pipe(select(RouteFeeSelectors.getRouteFeeByMigrationId))
      .subscribe((resData: any) => {
        const newFeeArr: any[] = [{ name: 'New fee' }];
        if (resData) {
          resData.forEach((x: any) => {
            newFeeArr.push(x);
          });
          this.allFeeList = this.sortArrayWithCondition(newFeeArr);

          this.typeSelection();
        }
      });
  }

  buildForm() {
    this.addRouteFeeForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      migrationRouteId: [null],
      familyMemberId: [null],
      feeType: [1, [Validators.required]],
      feeTypeDesc: [null],
      feeBasis: [null, [Validators.required]],
      feeBasisDesc: [null],
      amount2: [null],
      routeFeeItems: this.fb.array([this.newFeeArray()]),
      feeCategory: [1, [Validators.required]],
      hasRealEstateInvestmentTier: [false],
      serialNumber: [1],
      feeCategoryAForComputeOperation: [null],
      feeCategoryBForComputeOperation: [null],
      feeCategoryCForComputeOperation: [null],
      firstComputeOperation: [1],
      secondComputeOperation: [1],

      feeCapAmount: [null],
      numberOfFamilyMembersFeeCap: [null, [Validators.min(5)]],

      applicationIncludesSpouse: [false],
    });
  }

  routeFeeItems(): FormArray {
    return this.addRouteFeeForm.get('routeFeeItems') as FormArray;
  }

  newFeeArray(): FormGroup {
    return this.fb.group({
      fixedNoOfPeople: [0],
      threshold: [0],
      familyMemberId: [0, [Validators.required]],
      familyGroup: [0, [Validators.required]],
      minimumAge: [0],
      maximumAge: [0],
      amount: [null],
      isDeleted: [false],
      name: [''],
      realEstateInvestmentTierId: [null],
      description: [''],
      id: [0],
      minimumPeople: [0],
      maximumPeople: [0],
      currencyCode: [''],
    });
  }

  onFamilyMemberChange(event: any, index: number) {
    const selectedFamily = this.familyMemberList.filter((x) => x.id === event);

    const routeArr = <FormArray>this.addRouteFeeForm.controls['routeFeeItems'];

    routeArr.controls[index].patchValue({
      minimumAge: selectedFamily[0].minimumAge,
      maximumAge: selectedFamily[0].maximumAge,
    });
  }

  addFeeArray() {
    this.routeFeeItems().push(this.newFeeArray());
  }

  removeQuantity(i: number) {
    if (!this.editing) {
      this.routeFeeItems().removeAt(i);
    } else if (this.editing) {
      this.removedItems.push(this.routeFeeItems().value[i]);

      this.removedItems = this.removedItems.map((item) => {
        return {
          ...item,
          isDeleted: true,
        };
      });

      this.routeFeeItems().removeAt(i);
    }
  }

  get newUserFormControls() {
    return this.addRouteFeeForm.controls;
  }

  toggleComputeOperation(computedOperationValues: 1 | 2) {
    this.addRouteFeeForm.patchValue({
      firstComputeOperation: computedOperationValues,
    });
  }

  toggleComputeOperation1(computedOperationValues: 1 | 2) {
    this.addRouteFeeForm.patchValue({
      secondComputeOperation: computedOperationValues,
    });
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.newUserFormControls['name'].hasError('required')
    ) {
      return `Please enter fee name`;
    } else if (
      instance === 'feeGroup' &&
      this.newUserFormControls['feeGroup'].hasError('required')
    ) {
      return `Please select fee group `;
    } else if (
      instance === 'serialNumber' &&
      this.newUserFormControls['serialNumber'].hasError('required')
    ) {
      return `Please select serail number`;
    } else if (
      instance === 'feeType' &&
      this.newUserFormControls['feeType'].hasError('required')
    ) {
      return `Please select fee type`;
    } else if (
      instance === 'feeBasis' &&
      this.newUserFormControls['feeBasis'].hasError('required')
    ) {
      return `Please select fee basis`;
    } else if (
      instance === 'amount' &&
      this.newUserFormControls['amount'].hasError('required')
    ) {
      return `Please enter amount`;
    } else if (
      instance === 'familyMemberId2' &&
      this.newUserFormControls['familyMemberId2'].hasError('required')
    ) {
      return `Please select family member `;
    } else if (
      instance === 'minimumAge' &&
      this.newUserFormControls['minimumAge'].hasError('required')
    ) {
      return `Please enter `;
    } else if (
      instance === 'maximumAge' &&
      this.newUserFormControls['maximumAge'].hasError('required')
    ) {
      return `Please enter `;
    } else if (
      instance === 'numberOfFamilyMembersFeeCap' &&
      this.newUserFormControls['numberOfFamilyMembersFeeCap']?.hasError('min')
    ) {
      return `Number of family members must be greater than 4`;
    } else {
      return `Please enter `;
    }
  }

  handleSelection(feeType: any) {
    if (feeType === 1 || feeType?.value === 1) {
      this.feeBasisList = this.feeBasisListOg.filter(
        (x: any) =>
          x.value !== 2 &&
          x.value !== 3 &&
          x.value !== 4 &&
          x.value !== 5 &&
          x.value !== 7
      );
    } else if (feeType === 2 || feeType?.value === 2) {
      if (
        this.editData &&
        this.editData.routeFeeItems &&
        this.editData?.routeFeeItems?.length > 0
      ) {
        this.setAddRouteFeeItems(this.editData.routeFeeItems);
      } else {
        this.setAddRouteFeeItems();
      }
      this.feeBasisList = this.feeBasisListOg.filter(
        (x: any) => x.value !== 1 && x.value !== 6 && x.value !== 7
      );
    } else if (feeType === 3 || feeType?.value === 3) {
      if (
        this.editData &&
        this.editData.routeFeeItems &&
        this.editData?.routeFeeItems?.length > 0
      ) {
        this.setAddRouteFeeItems(this.editData.routeFeeItems);
      } else {
        this.setAddRouteFeeItems();
      }
      this.setAddRouteFeeItems();
      this.feeBasisList = this.feeBasisListOg.filter((x: any) => x.value === 7);
    }
  }

  createRouteFeeItemFormGroup(item: any | null): FormGroup {
    return item
      ? this.fb.group({
          fixedNoOfPeople: [item.fixedNoOfPeople || 0],
          threshold: [item.threshold || 0],
          familyMemberId: [item.familyMemberId || 0, Validators.required],
          familyGroup: [item.familyGroup || 0, Validators.required],
          minimumAge: [item.minimumAge || 0],
          maximumAge: [item.maximumAge || 0],
          amount: [item.amount || 0],
          isDeleted: [item.isDeleted || false],
          name: [item.name || ''],
          realEstateInvestmentTierId: [item.realEstateInvestmentTierId || 0],
          description: [item.description || ''],
          id: [item.id || 0],
          minimumPeople: [item.minimumPeople || 0],
          maximumPeople: [item.maximumPeople || 0],
          currencyCode: [item.currencyCode || ''],
        })
      : this.fb.group({
          fixedNoOfPeople: [0],
          threshold: [0],
          familyMemberId: [0, Validators.required],
          familyGroup: [0, Validators.required],
          minimumAge: [0],
          maximumAge: [0],
          amount: [0],
          isDeleted: [false],
          name: [''],
          realEstateInvestmentTierId: [0],
          description: [''],
          id: [0],
          minimumPeople: [0],
          maximumPeople: [0],
          currencyCode: [''],
        });
  }

  // createRouteFeeItemFormGroup(item: any | null): FormGroup {
  //   const defaults = {
  //     fixedNoOfPeople: 0,
  //     threshold: 0,
  //     familyMemberId: [0, Validators.required],
  //     familyGroup: [0, Validators.required],
  //     minimumAge: 0,
  //     maximumAge: 0,
  //     amount: 0,
  //     isDeleted: false,
  //     name: '',
  //     realEstateInvestmentTierId: 0,
  //     description: '',
  //     id: 0,
  //     minimumPeople: 0,
  //     maximumPeople: 0,
  //     currencyCode: '',
  //   };

  //   const formData = Object.entries(defaults).reduce((acc, [key, defaultValue]) => {
  //     acc[key] = Array.isArray(defaultValue)
  //       ? [(item?.[key] ?? defaultValue[0]), defaultValue[1]]
  //       : [item?.[key] ?? defaultValue];
  //     return acc;
  //   }, {} as { [key: string]: any[] });

  //   return this.fb.group(formData);
  // }

  convertArrayToFormArray(routeItems: any[] = []): FormArray {
    const formArray =
      routeItems.length > 0
        ? this.fb.array(
            routeItems.map((item) => this.createRouteFeeItemFormGroup(item))
          )
        : this.fb.array([this.createRouteFeeItemFormGroup(null)]);
    return formArray;
  }

  formatRouteFeesToFormArray(routeFees: any[]) {
    const formArray = this.fb.array(
      routeFees.map((item) => this.createRouteFeeItemFormGroup(item))
    );
    return formArray;
  }

  setAddRouteFeeItems(items: any[] = []) {
    const routeFeeFormArray = this.convertArrayToFormArray(items);
    //Using setControl to replace the existing FormArray
    this.addRouteFeeForm.setControl('routeFeeItems', routeFeeFormArray);
  }

  selectedFees(fee: any, i: number) {
    const routeArr = <FormArray>this.addRouteFeeForm.controls['routeFeeItems'];
    this.selectedFeeList = [i];
    if (i === 0) {
      routeArr.clear();
      routeArr.push(this.newFeeArray());
      this.editing = false;
      // this.addRouteFeeForm.reset(this.addRouteFeeForm);
      this.addRouteFeeForm.patchValue({
        feeType: 1,
        name: null,
        description: null,
        migrationRouteId: null,
        familyMemberId: null,
        feeTypeDesc: null,
        feeBasis: null,
        feeBasisDesc: null,
        amount2: null,
        serialNumber: null,
        feeCategoryAForComputeOperation: null,
        feeCategoryBForComputeOperation: null,
        feeCategoryCForComputeOperation: null,
        firstComputeOperation: 1,
        secondComputeOperation: 1,
        hasRealEstateInvestmentTier: false,

        feeCapAmount: 0,
        numberOfFamilyMembersFeeCap: null,

        applicationIncludesSpouse: false,
      });
      this.handleSelection(1);
    } else {
      // set editng to true
      this.editing = true;
      // this.editData = this.allFeeList[i];
      // get the record to edit.
      this.editData = fee ? fee : this.allFeeList[i];

      if (this.editData) {
        this.addRouteFeeForm.patchValue({
          name: this.editData.name,
          description: this.editData.description,
          migrationRouteId: this.editData.migrationRouteId,
          familyMemberId: this.editData.familyMemberId,
          familyGroup: this.editData.familyGroup,
          feeType: this.editData.feeType,
          feeTypeDesc: this.editData.feeTypeDesc,
          feeBasis: this.editData.feeBasis,
          feeBasisDesc: this.editData.feeBasisDesc,
          amount2: this.editData.amount,
          feeCategory: this.editData.feeCategory,
          serialNumber: this.editData.serialNumber,

          feeCategoryAForComputeOperation:
            this.editData.feeCategoryAForComputeOperation,
          feeCategoryBForComputeOperation:
            this.editData.feeCategoryBForComputeOperation,
          feeCategoryCForComputeOperation:
            this.editData.feeCategoryCForComputeOperation,
          firstComputeOperation: this.editData.firstComputeOperation,
          secondComputeOperation: this.editData.secondComputeOperation,

          feeCapAmount: this.editData.feeCapAmount || 0,
          numberOfFamilyMembersFeeCap:
            this.editData.numberOfFamilyMembersFeeCap,
          hasRealEstateInvestmentTier:
            this.editData.hasRealEstateInvestmentTier,

          applicationIncludesSpouse: this.editData.applicationIncludesSpouse,
        });
      }

      const feeType = this.editData.feeType;
      this.handleSelection(feeType);

      if (
        this.editData.routeFeeItems &&
        this.editData.routeFeeItems.length > 0
      ) {
        // const routeFeeFormArray = this.convertArrayToFormArray(
        //   this.editData.routeFeeItems
        // );
        // //Using setControl to replace the existing FormArray
        // this.addRouteFeeForm.setControl('routeFeeItems', routeFeeFormArray);
        this.setAddRouteFeeItems(this.editData.routeFeeItems);
      }

      routeArr.clear();
    }
  }

  previousPage() {
    this.location.back();
  }

  onSubmit() {
    if (this.addRouteFeeForm.invalid) {
      return;
    } else {
      if (this.isInvoiceCurrencyError) {
        this.throwInvoiceCurrencyError();
        return;
      } else {
        this.store.dispatch(RouteFeeActions.IsLoading({ payload: true }));
        this.addRouteFeeForm.controls['feeBasis'].enable();
        if (this.editing === false) {
          this.createRouteFee();
        } else if (this.editing === true) {
          this.editRouteFee();
        }
      }
    }
  }

  createRouteFee() {
    let routeFeeItemsArr = this.addRouteFeeForm.value.routeFeeItems;
    routeFeeItemsArr = routeFeeItemsArr.map((x: any, i: number) => {
      return {
        ...x,
        id: 0,
        amount: x.amount !== null ? x.amount : 0,
        name: this.addRouteFeeForm.value.name + i,
        description: this.addRouteFeeForm.value.name + i,
        currencyCode: this.defaultInvoiceCurrency.currencyCode,
      };
    });

    const payload = {
      name: this.addRouteFeeForm.value.name,
      description: this.addRouteFeeForm.value.name,
      migrationRouteId: this.migrationRouteId,
      familyMemberId:
        this.addRouteFeeForm.value.feeType === 1
          ? this.addRouteFeeForm.value.familyMemberId
          : 0,
      feeType: this.addRouteFeeForm.value.feeType,
      feeTypeDesc: '',
      feeBasis: this.addRouteFeeForm.value.feeBasis,
      feeCategory: this.addRouteFeeForm.value.feeCategory,
      currencyCode: this.defaultInvoiceCurrency.currencyCode,
      serialNumber: this.addRouteFeeForm.value.serialNumber,
      hasRealEstateInvestmentTier: this.addRouteFeeForm.value
        .hasRealEstateInvestmentTier
        ? true
        : false,
      amount:
        this.addRouteFeeForm.value.feeType === 1
          ? this.addRouteFeeForm.value.amount2
          : 0,
      routeFeeItems:
        (this.addRouteFeeForm.value.feeType === 1 &&
          this.addRouteFeeForm.value.hasRealEstateInvestmentTier === false) ||
        this.addRouteFeeForm.value.feeType === 4
          ? []
          : routeFeeItemsArr,

      feeCategoryAForComputeOperation:
        this.addRouteFeeForm.value.feeCategoryAForComputeOperation,
      feeCategoryBForComputeOperation:
        this.addRouteFeeForm.value.feeCategoryBForComputeOperation,
      feeCategoryCForComputeOperation:
        this.addRouteFeeForm.value.feeCategoryCForComputeOperation,
      firstComputeOperation: this.addRouteFeeForm.value.firstComputeOperation,
      secondComputeOperation: this.addRouteFeeForm.value.secondComputeOperation,

      feeCapAmount: this.addRouteFeeForm.value.feeCapAmount || 0,
      numberOfFamilyMembersFeeCap:
        this.addRouteFeeForm.value.numberOfFamilyMembersFeeCap,

      applicationIncludesSpouse:
        this.addRouteFeeForm.value.applicationIncludesSpouse,
    };

    this.store.dispatch(
      RouteFeeActions.CreateRouteFees({
        payload,
      })
    );
  }

  editRouteFee() {
    let routeFeeItems = this.addRouteFeeForm.value.routeFeeItems.map(
      (x: any, index: number) => {
        return {
          ...x,
          id: this.editData?.routeFeeItems.find((data: any) => data.id === x.id)
            ?.id
            ? this.editData?.routeFeeItems.find((data: any) => data.id === x.id)
                ?.id
            : 0,
          minimumAge:
            this.editData.minimumAge === null ? 0 : this.editData.minimumAge,
          maximumAge:
            this.editData.maximumAge === null ? 0 : this.editData.maximumAge,
          name: this.addRouteFeeForm.value.name + index,
          description: this.addRouteFeeForm.value.name + index,
          currencyCode: this.defaultInvoiceCurrency.currencyCode,
        };
      }
    );

    if (this.removedItems.length > 0) {
      this.removedItems = this.removedItems.map((x: any, index: number) => {
        return {
          ...x,
          amount: x.amount !== null ? x.amount : 0,
          name: this.addRouteFeeForm.value.name + index + routeFeeItems.length,
          description:
            this.addRouteFeeForm.value.name + index + routeFeeItems.length,
          currencyCode: this.defaultInvoiceCurrency.currencyCode,
        };
      });
      routeFeeItems = [...routeFeeItems, ...this.removedItems];
    }

    const payload = {
      id: this.editData.id,
      name: this.addRouteFeeForm.value.name,
      description: this.addRouteFeeForm.value.name,
      migrationRouteId: this.addRouteFeeForm.value.migrationRouteId,
      familyMemberId: this.addRouteFeeForm.value.familyMemberId,
      feeType: this.addRouteFeeForm.value.feeType,
      feeTypeDesc: '',
      feeBasis: this.addRouteFeeForm.value.feeBasis,
      feeCategory: this.addRouteFeeForm.value.feeCategory,
      serialNumber: this.addRouteFeeForm.value.serialNumber,
      // feeBasisDesc: this.addRouteFeeForm.value.feeBasisDesc,
      currencyCode: this.defaultInvoiceCurrency.currencyCode,
      amount:
        this.addRouteFeeForm.value.feeType === 1
          ? this.addRouteFeeForm.value.amount2
          : 0,
      routeFeeItems:
        (this.addRouteFeeForm.value.feeType === 1 &&
          this.addRouteFeeForm.value.hasRealEstateInvestmentTier === false) ||
        this.addRouteFeeForm.value.feeType === 4
          ? []
          : routeFeeItems,

      feeCategoryAForComputeOperation:
        this.addRouteFeeForm.value.feeCategoryAForComputeOperation,
      feeCategoryBForComputeOperation:
        this.addRouteFeeForm.value.feeCategoryBForComputeOperation,
      feeCategoryCForComputeOperation:
        this.addRouteFeeForm.value.feeCategoryCForComputeOperation,
      firstComputeOperation: this.addRouteFeeForm.value.firstComputeOperation,
      secondComputeOperation: this.addRouteFeeForm.value.secondComputeOperation,

      feeCapAmount: this.addRouteFeeForm.value.feeCapAmount || 0,
      numberOfFamilyMembersFeeCap:
        this.addRouteFeeForm.value.numberOfFamilyMembersFeeCap,
      hasRealEstateInvestmentTier: this.addRouteFeeForm.value
        .hasRealEstateInvestmentTier
        ? true
        : false,

      applicationIncludesSpouse:
        this.addRouteFeeForm.value.applicationIncludesSpouse,
    };

    this.store.dispatch(
      RouteFeeActions.EditRouteFees({
        payload,
      })
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allFeeList, event.previousIndex, event.currentIndex);

    const serialList: any[] = [];

    this.allFeeList.forEach((fee, index: number) => {
      if (index !== 0) {
        serialList.push({
          routeId: fee.id,
          serialNumber: index,
        });
      }
    });

    this.store.dispatch(
      RouteFeeActions.UpdateRouteFeesSerialNumber({
        payload: {
          routeFees: [...serialList],
          migrationRouteId: parseInt(
            this.route.snapshot.paramMap.get('routeId') || ''
          ),
        },
      })
    );
  }

  sortArrayWithCondition(arr: any[]) {
    arr.sort((a, b) => {
      // If serialNumber is 0, move it to the end
      if (a.serialNumber === 0) {
        return 1; // Move a to end
      } else if (b.serialNumber === 0) {
        return -1; // Move b to end
      }

      // Compare serialNumber values for normal sorting
      return a.serialNumber - b.serialNumber;
    });

    return arr;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.pushFeeSub ? this.pushFeeSub.unsubscribe() : null;
    this.getMigrationRouteByIdSub
      ? this.getMigrationRouteByIdSub.unsubscribe()
      : null;
  }
}
