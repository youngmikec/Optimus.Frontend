import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentCollectionAction from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as DocumentCollectionSelector from 'src/app/@core/stores/document-collection/document-collection.selectors';

@Component({
  selector: 'app-document-parameters',
  templateUrl: './document-parameters.component.html',
  styleUrls: ['./document-parameters.component.scss'],
})
export class DocumentParametersComponent implements OnInit {
  @Output() backEmit: EventEmitter<null> = new EventEmitter();
  @Output() submitEmit: EventEmitter<any> = new EventEmitter();
  @Output() saveEmit: EventEmitter<any> = new EventEmitter();

  public parameterForm!: FormGroup;
  public memberDocParameters: any[] = [];

  public errorMessage: string = '';

  private applicationId: number = parseInt(
    this.route.snapshot.paramMap.get('applicationId')!
  );

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.getDocumentParameters();
  }

  initializeForm() {
    this.parameterForm = this.formBuilder.group({});
  }

  updateFormGroupControl() {
    this.memberDocParameters.forEach((control: any) => {
      const formArray: FormArray = this.formBuilder.array([]);

      control.documentQuestions.forEach((question: any) => {
        const formGroup = this.formBuilder.group({
          documentConfigurationId: new FormControl(
            question.documentQuestionId,
            Validators.required
          ),
          configurationQuestion: new FormControl(
            question.documentQuestion,
            Validators.required
          ),
          familyMemberId: new FormControl(
            control.familyMember.familyMemberId,
            Validators.required
          ),
          isYes: new FormControl('', Validators.required),
        });

        formArray.push(formGroup);
      });

      this.parameterForm.setControl(
        `${
          control.familyMember.firstName + '-' + control.familyMember.lastName
        }`,
        formArray
      );
    });
  }

  back() {
    this.backEmit.emit(null);
  }

  getDocumentParameters() {
    this.store.dispatch(
      DocumentCollectionAction.getDocumentParameters({
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(DocumentCollectionSelector.documentParameterSelector)
      .pipe(filter((result: any) => !!result))
      .subscribe({
        next: (resp: any) => {
          if (resp.length < 1) this.errorMessage = 'No records(s) found';
          else this.errorMessage = '';

          this.memberDocParameters = resp;
          this.updateFormGroupControl();
        },
      });
  }

  setPayload() {
    let documentParameters: any = [];
    Object.values(this.parameterForm.value).forEach((response: any) => {
      const mappedResponse = response.map((result: any) => {
        const copiedResult = { ...result };
        copiedResult.isYes = JSON.parse(copiedResult.isYes);
        return copiedResult;
      });

      documentParameters = [...documentParameters, ...mappedResponse];
    });

    return { documentParameters };
  }

  save() {
    const payload = this.setPayload();
    this.saveEmit.emit(payload);
  }

  submit() {
    const payload = this.setPayload();
    this.submitEmit.emit(payload);
  }
}
