import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import * as GeneralAction from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelector from 'src/app/@core/stores/general/general.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as FamilyMemberTypeSettingsActions from 'src/app/@core/stores/familyMemberTypeSettings/familyMemberTypeSettings.actions';
import * as FamilyMemberTypeSettingsSelector from 'src/app/@core/stores/familyMemberTypeSettings/familyMemberTypeSettings.selectors';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

@Component({
  selector: 'app-create-family-member-type-settings',
  templateUrl: './create-family-member-type-settings.component.html',
  styleUrls: ['./create-family-member-type-settings.component.scss'],
})
export class CreateFamilyMemberTypeSettingsComponent
  implements OnInit, OnDestroy
{
  createFamilyMemberForm!: FormGroup;

  isLoading!: Observable<boolean>;
  getFamilyGroupsSub!: Subscription;
  getFamilyTypeSub!: Subscription;
  getAllContriesSub!: Subscription;
  familyMemberTypeList: any[] = [];
  familyMemberGroupList: any[] = [];
  countryList: any[] = [];
  editFamilyData: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateFamilyMemberTypeSettingsComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getFamilyGroups();
    this.getFamilyTypes();
    this.getAllCountry();
    this.buildCreateFamilyMemberForm();

    this.createFamilyMemberForm.patchValue({
      countryId: this.data.countryId,
    });

    this.isLoading = this.store.pipe(
      select(FamilyMemberTypeSettingsSelector.getFamilyMembersIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editFamilyData = this.data?.editData;

      this.createFamilyMemberForm.patchValue({
        countryId: this.editFamilyData.countryId,
        name: this.editFamilyData.name,
        description: this.editFamilyData.description,
        familyMemberType: this.editFamilyData.familyMemberType,
        familyMemberTypeDesc: this.editFamilyData.familyMemberTypeDesc,
        familyGroup: this.editFamilyData.familyGroup,
        familyGroupDesc: this.editFamilyData.familyGroupDesc,
        maximumAllowed: this.editFamilyData.maximumAllowed,
      });
    }
    this.createFamilyMemberForm.controls['countryId'].disable();
  }

  buildCreateFamilyMemberForm() {
    this.createFamilyMemberForm = this.fb.group({
      countryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      familyMemberType: [null, [Validators.required]],
      familyMemberTypeDesc: [null],
      familyGroup: [null, [Validators.required]],
      familyGroupDesc: [null],
      maximumAllowed: [null, [Validators.required]],
    });
  }

  get createFamilyFormControls() {
    return this.createFamilyMemberForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'countryId' &&
      this.createFamilyFormControls['countryId'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'name' &&
      this.createFamilyFormControls['name'].hasError('required')
    ) {
      return `Please enter family member settings name`;
    } else if (
      instance === 'familyMemberType' &&
      this.createFamilyFormControls['familyMemberType'].hasError('required')
    ) {
      return `Please select Family Member Type`;
    } else if (
      instance === 'familyGroup' &&
      this.createFamilyFormControls['familyGroup'].hasError('required')
    ) {
      return `Please select family group`;
    } else if (
      instance === 'maximumAllowed' &&
      this.createFamilyFormControls['maximumAllowed'].hasError('required')
    ) {
      return `Please enter maximum allowed`;
    } else {
      return;
    }
  }

  getFamilyGroups() {
    this.store.dispatch(GeneralAction.GetFamilyGroups());
    this.getFamilyGroupsSub = this.store
      .pipe(select(GeneralSelector.getAllFamilyGroups))
      .subscribe((res: any) => {
        if (res) {
          this.familyMemberGroupList = res;
        }
      });
  }

  getFamilyTypes() {
    this.store.dispatch(GeneralAction.GetFamilyTypes());
    this.getFamilyTypeSub = this.store
      .pipe(select(GeneralSelector.getAllFamilyTypes))
      .subscribe((res: any) => {
        if (res) {
          this.familyMemberTypeList = res;
        }
      });
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

  onSubmit() {
    if (this.createFamilyMemberForm.invalid) {
      return;
    } else {
      this.createFamilyMemberForm.controls['countryId'].enable();
      this.store.dispatch(
        FamilyMemberTypeSettingsActions.IsLoading({ payload: true })
      );

      if (this.data.type === 'create') {
        this.createFamilyMember();
      } else if (this.data.type === 'edit') {
        this.editFamilyMember();
      }
    }
  }

  createFamilyMember() {
    this.store.dispatch(
      FamilyMemberTypeSettingsActions.CreateFamilyMemberTypeSettings({
        payload: {
          countryId: this.createFamilyMemberForm.value.countryId,
          name: this.createFamilyMemberForm.value.name,
          description: this.createFamilyMemberForm.value.description,
          familyMemberType: this.createFamilyMemberForm.value.familyMemberType,
          familyMemberTypeDesc:
            this.createFamilyMemberForm.value.familyMemberTypeDesc,
          familyGroup: this.createFamilyMemberForm.value.familyGroup,
          familyGroupDesc: this.createFamilyMemberForm.value.familyGroupDesc,
          maximumAllowed: this.createFamilyMemberForm.value.maximumAllowed,
        },
      })
    );
  }

  editFamilyMember() {
    if (this.editFamilyData) {
      this.store.dispatch(
        FamilyMemberTypeSettingsActions.EditFamilyMemberTypeSettings({
          payload: {
            id: this.editFamilyData.id,
            countryId: this.createFamilyMemberForm.value.countryId,
            name: this.createFamilyMemberForm.value.name,
            description: this.createFamilyMemberForm.value.description,
            familyMemberType:
              this.createFamilyMemberForm.value.familyMemberType,
            familyMemberTypeDesc:
              this.createFamilyMemberForm.value.familyMemberTypeDesc,
            familyGroup: this.createFamilyMemberForm.value.familyGroup,
            familyGroupDesc: this.createFamilyMemberForm.value.familyGroupDesc,
            maximumAllowed: this.createFamilyMemberForm.value.maximumAllowed,
          },
        })
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.getFamilyGroupsSub
      ? this.getFamilyGroupsSub.unsubscribe()
      : this.getFamilyGroupsSub;
    this.getFamilyTypeSub
      ? this.getFamilyTypeSub.unsubscribe()
      : this.getFamilyTypeSub;
    this.getAllContriesSub
      ? this.getAllContriesSub.unsubscribe()
      : this.getAllContriesSub;
  }
}
