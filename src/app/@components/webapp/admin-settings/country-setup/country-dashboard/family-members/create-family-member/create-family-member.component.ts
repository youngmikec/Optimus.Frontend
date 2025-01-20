import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import * as GeneralAction from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelector from 'src/app/@core/stores/general/general.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as FamilyMemberAction from 'src/app/@core/stores/familyMembers/familyMembers.actions';
import * as FamilyMemberSelector from 'src/app/@core/stores/familyMembers/familyMembers.selectors';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

@Component({
  selector: 'app-create-family-member',
  templateUrl: './create-family-member.component.html',
  styleUrls: ['./create-family-member.component.scss'],
})
export class CreateFamilyMemberComponent implements OnInit, OnDestroy {
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
    public dialogRef: MatDialogRef<CreateFamilyMemberComponent>,
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
      select(FamilyMemberSelector.getFamilyMembersIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editFamilyData = this.data?.editData;

      this.createFamilyMemberForm.patchValue({
        countryId: this.editFamilyData.countryId,
        name: this.editFamilyData.name,
        familyMemberType: this.editFamilyData.familyMemberType,
        familyGroup: this.editFamilyData.familyGroup,
        familyGroupDesc: this.editFamilyData.familyGroupDesc,
        maximumAllowed: this.editFamilyData.maximumAllowed,
        minimumAge: this.editFamilyData.minimumAge,
        maximumAge: this.editFamilyData.maximumAge,
        hasChildren: this.editFamilyData.hasChildren,
        isMarried: this.editFamilyData.isMarried,
        isSchooling: this.editFamilyData.isSchooling,
        isQualified: this.editFamilyData.isQualified,
        isMentallyChallenged: this.editFamilyData.isMentallyChallenged,
      });
    }
    this.createFamilyMemberForm.controls['countryId'].disable();
  }

  buildCreateFamilyMemberForm() {
    this.createFamilyMemberForm = this.fb.group({
      countryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      familyMemberType: [null, [Validators.required]],
      familyMemberTypeDesc: [null],
      familyGroup: [null],
      familyGroupDesc: [null],
      maximumAllowed: [null],
      minimumAge: [null, [Validators.required]],
      maximumAge: [null, [Validators.required]],
      hasChildren: [null],
      isMarried: [null],
      isSchooling: [null],
      isQualified: [null],
      isMentallyChallenged: [false],
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
      return `Please enter family member name`;
    } else if (
      instance === 'familyMemberType' &&
      this.createFamilyFormControls['familyMemberType'].hasError('required')
    ) {
      return `Please select family type`;
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
    } else if (
      instance === 'minimumAge' &&
      this.createFamilyFormControls['minimumAge'].hasError('required')
    ) {
      return `Please enter minimum allowed`;
    } else if (
      instance === 'maximumAge' &&
      this.createFamilyFormControls['maximumAge'].hasError('required')
    ) {
      return `Please enter maximum age`;
    } else if (
      instance === 'hasChildren' &&
      this.createFamilyFormControls['hasChildren'].hasError('required')
    ) {
      return `Please select option`;
    } else if (
      instance === 'isMarried' &&
      this.createFamilyFormControls['isMarried'].hasError('required')
    ) {
      return `Please select option`;
    } else if (
      instance === 'isSchooling' &&
      this.createFamilyFormControls['isSchooling'].hasError('required')
    ) {
      return `Please select option`;
    } else if (
      instance === 'isQualified' &&
      this.createFamilyFormControls['isQualified'].hasError('required')
    ) {
      return `Please select option`;
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
      this.store.dispatch(FamilyMemberAction.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createFamilyMember();
      } else if (this.data.type === 'edit') {
        this.editFamilyMember();
      }
    }
  }

  createFamilyMember() {
    this.store.dispatch(
      FamilyMemberAction.CreateFamilyMembers({
        payload: {
          countryId: this.createFamilyMemberForm.value.countryId,
          familyMemberType: this.createFamilyMemberForm.value.familyMemberType,
          name: this.createFamilyMemberForm.value.name,
          description: this.createFamilyMemberForm.value.description,
          maximumAllowed: this.createFamilyMemberForm.value.maximumAllowed,
          minimumAge: this.createFamilyMemberForm.value.minimumAge,
          maximumAge: this.createFamilyMemberForm.value.maximumAge,
          isMentallyChallenged:
            this.createFamilyMemberForm.value.isMentallyChallenged,
        },
      })
    );
  }

  editFamilyMember() {
    if (this.editFamilyData) {
      this.store.dispatch(
        FamilyMemberAction.EditFamilyMembers({
          payload: {
            id: this.editFamilyData.id,
            countryId: this.createFamilyMemberForm.value.countryId,
            name: this.createFamilyMemberForm.value.name,
            description: this.createFamilyMemberForm.value.description,
            familyMemberType:
              this.createFamilyMemberForm.value.familyMemberType,
            maximumAllowed: this.createFamilyMemberForm.value.maximumAllowed,
            minimumAge: this.createFamilyMemberForm.value.minimumAge,
            maximumAge: this.createFamilyMemberForm.value.maximumAge,
            isMentallyChallenged:
              this.createFamilyMemberForm.value.isMentallyChallenged,
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
