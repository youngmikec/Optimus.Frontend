import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentCollectionAction from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as DocumentCollectionSelector from 'src/app/@core/stores/document-collection/document-collection.selectors';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss'],
})
export class FamilyFormComponent implements OnInit, OnDestroy {
  @Output() continueEmit: EventEmitter<any> = new EventEmitter();

  public familyMemberForm!: FormGroup;
  public familyMembers: any[] = [];

  public errorMessage: string = '';

  private applicationId: number = parseInt(
    this.route.snapshot.paramMap.get('applicationId')!
  );

  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.getApplicationResponse();
  }

  initializeForm() {
    this.familyMemberForm = this.formBuilder.group({
      bioData: this.formBuilder.array([]),
    });
  }

  updateForm() {
    this.familyMembers.forEach((member: any) => {
      const formGroup = this.formBuilder.group({
        member: new FormControl(
          member.familyMemberTypeDesc,
          Validators.required
        ),
        familyMemberId: new FormControl(
          member.familyMemberId,
          Validators.required
        ),
        title: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
      });

      (this.familyMemberForm.get('bioData') as FormArray).push(formGroup);
    });
  }

  get bioData(): FormArray {
    return this.familyMemberForm.get('bioData') as FormArray;
  }

  getBioDataFormControl(index: number, control: string): FormControl {
    return this.bioData.at(index).get(control) as FormControl;
  }

  getErrorMessage(instance: string) {
    if (instance === 'firstName') {
      return 'Please enter Frist name';
    } else if (instance === 'lastName') {
      return 'Please enter Last name';
    } else if (instance === 'title') {
      return 'Please enter Title';
    } else {
      return;
    }
  }

  markAllAsTouched() {
    this.familyMemberForm.markAllAsTouched();
    this.familyMemberForm.updateValueAndValidity();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((cntrl) =>
          this.markFormGroupTouched(cntrl as FormGroup)
        );
      } else {
        control?.markAsTouched();
        control?.markAsDirty();
      }
    });
  }

  getApplicationResponse() {
    this.store.dispatch(
      DocumentCollectionAction.getApplicationResponse({
        applicationId: this.applicationId,
      })
    );

    this.subscription.add(
      this.store
        .select(DocumentCollectionSelector.documentApplicationResponseSelector)
        .subscribe({
          next: (resp: any) => {
            if (!Array.isArray(resp)) this.errorMessage = resp;

            this.familyMembers = resp;
            if (this.familyMembers?.length > 1) this.updateForm();
          },
        })
    );
  }

  continue() {
    this.markFormGroupTouched(this.familyMemberForm);
    if (this.familyMemberForm.invalid) return;

    const { bioData } = this.familyMemberForm.value;

    const payload = {
      applicationId: this.applicationId,
      applicationFamilyMemberDetails: bioData.map((data: any) => {
        const { familyMemberId, title, firstName, lastName } = data;
        return {
          familyMemberId,
          title,
          firstName,
          lastName,
        };
      }),
    };

    this.continueEmit.emit(payload);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
