import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import * as RouteQuestionAction from 'src/app/@core/stores/routeQuestions/routeQuestions.actions';
import * as RouteQuestionsSelector from 'src/app/@core/stores/routeQuestions/routeQuestions.selectors';
import * as FamilyMemberActions from 'src/app/@core/stores/familyMembers/familyMembers.actions';
import * as FamilyMemberSelector from 'src/app/@core/stores/familyMembers/familyMembers.selectors';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRouteSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';
import * as CountriesAction from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as GeneralAction from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelector from 'src/app/@core/stores/general/general.selectors';
import { Observable, Subject, Subscription, distinctUntilChanged } from 'rxjs';
import { MigrationData } from '../../../migration-routes.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { IInvestmentTier } from 'src/app/@core/interfaces/investmentTier.interface';

export interface Options {
  optionValue: string;
  sequenceNo: number;
  isDeleted?: boolean;
  id?: number;
  name: string;
  description?: string;
  isDefault: boolean;
}

interface Questions {
  countryId: number;
  migrationRouteId: number;
  parentId?: number;
  sequenceNo?: number;
  question: string;
  questionResponseType?: number;
  questionResponseTypeDesc: string;
  isPublished: boolean;
  routeQuestionFees: string;
  subQuestions: Questions[];
  questionOptions: Options[];
  questionTriggers: Options[];
  recordKey: string;
  id: number;
  name: string;
  description: string;
  status: number;
  statusDesc: string;
}

@Component({
  selector: 'app-create-route-questions',
  templateUrl: './create-route-questions.component.html',
  styleUrls: ['./create-route-questions.component.scss'],
})
export class CreateRouteQuestionsComponent implements OnInit, OnDestroy {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  optionList: Options[] = [];
  subOptionList: any[] = [[]];

  createRouteQuestionForm!: FormGroup;
  migrationRouteId!: number;
  countryList: any[] = [];
  isLoading!: Observable<boolean>;
  isLoading2!: Observable<boolean>;
  isLoading3!: Observable<boolean>;

  migrationRouteList: any[] = [];
  familyMemberList: any[] = [];
  routeQuestionList: any[] = [];
  allRouteQuestionList: any[] = [];
  routeQuestionTypeList: any[] = [];
  investmentTierList: IInvestmentTier[] = [];

  selectedMigration: MigrationData = {
    id: 0,
    countryId: 0,
    name: '',
    country: '',
    createdDate: '',
    createdBy: '',
    lastModifiedDate: '',
    lastModifiedBy: '',
    status: '',
  };
  selectedCountry: any = {};
  selectedFeeList: any[] = [0];

  routeQuestionEditId!: number;
  editData: any = {};
  editing: boolean = false;
  latestSequenceNumber: number = 0;

  familyMemberTypeList: any[] = [];

  pushQuestionSub!: Subscription;
  getMigrationRouteByIdSub!: Subscription;
  getFamilyTypeSub!: Subscription;
  getQuestionTypeSub!: Subscription;
  loggedInUserId!: string;

  unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getOneMigrationRouteById();
    this.getAllRouteQuestionByMigrationId();
    this.getAllMigrationRoute();
    this.getAllCoutries();
    this.getAllFamilyMember();
    this.getAllFamilyTypess();
    this.getAllRouteQuestionType();
    this.buildCreateRouteQuestionForm();

    this.manageAllInvestmentTiers();

    this.isLoading = this.store.pipe(
      select(MigrationRouteSelector.getMigrationRouteIsLoading)
    );
    this.isLoading2 = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );
    this.isLoading3 = this.store.pipe(
      select(RouteQuestionsSelector.getRouteQuestionIsLoading)
    );

    this.createRouteQuestionForm.controls['migrationRouteId'].disable();
    this.createRouteQuestionForm.controls['addDependentQuestion'].disable();
  }

  typeSelection() {
    if (
      this.route.snapshot.paramMap.get('questionId') ||
      this.editing === true
    ) {
      this.editing = true;
      this.routeQuestionEditId = Number(
        this.route.snapshot.paramMap.get('questionId')
      );
      const questionIndex = this.routeQuestionList.findIndex(
        (value: any) => value.id === this.routeQuestionEditId
      );

      this.selectedFees(null, questionIndex);
    } else {
      this.createRouteQuestionForm.patchValue({
        migrationRouteId: parseInt(
          this.route.snapshot.paramMap.get('routeId') || ''
        ),
      });
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.routeQuestionList,
      event.previousIndex,
      event.currentIndex
    );

    const newSequenceArray: any[] = [];
    this.routeQuestionList.forEach((question: any, index: number) => {
      newSequenceArray.push({
        ...question,
        countryId: this.selectedCountry?.id,
        sequenceNo: index + 1,
      });
    });

    this.routeQuestionList = newSequenceArray;
    this.updateQuestionsOnDrage(this.routeQuestionList);
  }

  getAllCoutries() {
    this.store.dispatch(
      CountriesAction.GetAllCountry({
        payload: {
          skip: 0,
          take: 9999,
        },
      })
    );
    this.store
      .pipe(select(CountriesSelector.getAllCountry))
      .pipe(distinctUntilChanged())
      .subscribe((resData: any) => {
        if (resData) {
          this.countryList = resData;
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
      .pipe(select(MigrationRouteSelector.getAllInvestmentTiers))
      .subscribe((resData: any) => {
        if (resData) {
          this.investmentTierList = resData.filter(
            (item: any) => item.status === 1
          );
        }
      });
  }

  getAllMigrationRoute() {
    this.store.dispatch(
      MigrationRoutesActions.GetAllMigrationRoutesByCountryId({
        payload: {
          id: parseInt(this.route.snapshot.paramMap.get('id') || ''),
        },
      })
    );
    this.store
      .pipe(select(MigrationRouteSelector.getAllMigrationRoutesByCountryId))
      .pipe(distinctUntilChanged())
      .subscribe((resData: any) => {
        if (resData) {
          this.migrationRouteList = resData;
        }
      });
  }

  getAllFamilyMember() {
    this.store.dispatch(
      FamilyMemberActions.GetActiveFamilyMembersByCountryId({
        payload: { id: parseInt(this.route.snapshot.paramMap.get('id') || '') },
      })
    );
    this.store
      .pipe(select(FamilyMemberSelector.getActiveFamilyMembersByCountryId))
      .pipe(distinctUntilChanged()) // change to local family member
      .subscribe((resData: any) => {
        if (resData) {
          this.familyMemberList = resData;
        }
      });
  }

  getAllRouteQuestionByMigrationId() {
    this.store.dispatch(
      RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
        payload: {
          id: parseInt(this.route.snapshot.paramMap.get('routeId') || ''),
        },
      })
    );
    this.pushQuestionSub = this.store
      .pipe(select(RouteQuestionsSelector.getAllRouteQuestionByMigrationId))
      .subscribe((resData: any) => {
        const newQuestionsArr: any[] = [];
        // const newQuestionsArr: any[] = [{ name: 'New question' }];
        if (resData) {
          this.allRouteQuestionList = [...resData];
          this.allRouteQuestionList.sort(
            (x, y) =>
              parseInt(y.sequenceNo || '') - parseInt(x.sequenceNo || '')
          );
          this.latestSequenceNumber = parseInt(
            this.allRouteQuestionList[0]?.sequenceNo || ''
          );
          this.createRouteQuestionForm.patchValue({
            sequenceNo: this.allRouteQuestionList.length + 1,
          });

          resData.forEach((x: any) => {
            newQuestionsArr.push(x);
          });
          this.routeQuestionList = newQuestionsArr;
          this.typeSelection();
        }
      });
  }

  getOneMigrationRouteById() {
    this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      MigrationRoutesActions.GetMigrationRoutesById({
        payload: {
          id: parseInt(this.route.snapshot.paramMap.get('routeId') || ''),
        },
      })
    );

    this.getMigrationRouteByIdSub = this.store
      .pipe(select(MigrationRouteSelector.getMigrationRoutesById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedMigration = res;
          this.getOneCountryById();
        }
      });
  }

  getOneCountryById() {
    this.store.dispatch(CountriesAction.IsLoading({ payload: true }));
    this.store.dispatch(
      CountriesAction.GetCountryById({
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

  getAllRouteQuestionType() {
    this.store.dispatch(GeneralAction.GetQuestionResponseType());
    this.getQuestionTypeSub = this.store
      .pipe(select(GeneralSelector.getAllQuestionResponseType))
      .subscribe((resData: any) => {
        if (resData) {
          this.routeQuestionTypeList = resData;
        }
      });
  }

  getAllFamilyTypess() {
    this.store.dispatch(GeneralAction.GetFamilyTypes());
    this.getFamilyTypeSub = this.store
      .pipe(select(GeneralSelector.getAllFamilyTypes))
      .subscribe((res: any) => {
        if (res) {
          this.familyMemberTypeList = res;
        }
      });
  }

  getUser() {
    this.store.pipe(select(authSelectors.getUser)).subscribe((res: any) => {
      if (res !== null) this.loggedInUserId = res.UserId;
    });
  }

  buildCreateRouteQuestionForm() {
    this.createRouteQuestionForm = this.fb.group({
      migrationRouteId: [null], // no validator
      familyMemberId: [null, [Validators.required]],
      parentId: [null],
      sequenceNo: [1, [Validators.required]], // no validator
      question: [null, [Validators.required]],
      questionResponseType: [null, [Validators.required]],
      questionOptions: [[]],
      name: [null],
      description: [null],
      publishQuestion: true,
      dependentQuestionList: this.fb.array([this.newDependantQuestion()]),

      // flag to know if there is dependent question and show the others !!!
      addDependentQuestion: [false],
      // subQuestions: this.fb.array([this.newDependantQuestion()]),
    });
  }

  dependentQuestionList(): FormArray {
    return this.createRouteQuestionForm.get(
      'dependentQuestionList'
    ) as FormArray;
  }

  newDependantQuestion(): FormGroup {
    return this.fb.group({
      familyMemberId: [null],
      sequenceNo: [null],
      question: [null],
      questionResponseType: [null],
      questionOptions: [[]],
      subQuestions: [null],
      questionTriggers: [[]],
      condition: [null],
      userId: [this.loggedInUserId],
      id: [null],
    });
  }

  get createRouteQuestionFormControls() {
    return this.createRouteQuestionForm.controls;
  }

  addQuestion() {
    this.dependentQuestionList().push(this.newDependantQuestion());
  }

  removeQuestion(i: number) {
    this.dependentQuestionList().removeAt(i);
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'countryId' &&
      this.createRouteQuestionFormControls['countryId'].hasError('required')
    ) {
      return `Please select country name`;
    } else if (
      instance === 'migrationRouteId' &&
      this.createRouteQuestionFormControls['migrationRouteId'].hasError(
        'required'
      )
    ) {
      return `Please select Migration route`;
    } else if (
      instance === 'familyMemberId' &&
      this.createRouteQuestionFormControls['familyMemberId'].hasError(
        'required'
      )
    ) {
      return `Please select Family Member`;
    } else if (
      instance === 'sequenceNo' &&
      this.createRouteQuestionFormControls['sequenceNo'].hasError('required')
    ) {
      return `Please enter sequence number`;
    } else if (
      instance === 'question' &&
      this.createRouteQuestionFormControls['question'].hasError('required')
    ) {
      return `Please enter question`;
    } else if (
      instance === 'questionResponseType' &&
      this.createRouteQuestionFormControls['questionResponseType'].hasError(
        'required'
      )
    ) {
      return `Please select question response type`;
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.createRouteQuestionForm.invalid) {
      return;
    } else {
      this.store.dispatch(RouteQuestionAction.IsLoading({ payload: true }));

      if (this.editing === false) {
        // create based on the type of question
        this.createRouteQuestionForm.controls['questionOptions'].enable();
        if (
          this.createRouteQuestionForm.value.questionResponseType === 2 ||
          this.createRouteQuestionForm.value.questionResponseType === 3 ||
          this.createRouteQuestionForm.value.questionResponseType === 4 ||
          this.createRouteQuestionForm.value.questionResponseType === 6
        ) {
          this.createMultiQuestion();
        } else {
          this.createRouteQuestion();
        }
      } else if (this.editing === true) {
        this.createRouteQuestionForm.controls['questionOptions'].enable();
        if (
          this.createRouteQuestionForm.value.questionResponseType === 2 ||
          this.createRouteQuestionForm.value.questionResponseType === 4 ||
          this.createRouteQuestionForm.value.questionResponseType === 3 ||
          this.createRouteQuestionForm.value.questionResponseType === 6
        ) {
          this.editMultiRouteQuestion();
        } else {
          this.editRouteQuestion();
        }
      }
    }
  }

  // REALLY COMPLEX FLOW, please read comments to get why somethings where done
  createMultiQuestion() {
    // Basically mutating the form value to fit what the backend is expecting
    let subQuestions = this.createRouteQuestionForm.value.dependentQuestionList;
    let dependentQuestionList =
      this.createRouteQuestionForm.value.dependentQuestionList;
    const newConditionArr: any[] = [];

    const subQuestionOptionList: any[] = [];

    this.subOptionList.forEach((x: any) => {
      const arr = x.map((x: any) => {
        return { ...x, userId: this.loggedInUserId };
      });
      subQuestionOptionList.push(arr);
    });

    // patch form array for subquestion option list
    const subQuestionArr = <FormArray>(
      this.createRouteQuestionForm.controls['dependentQuestionList']
    );

    subQuestions.forEach((x: any, i: number) => {
      subQuestionArr.controls[i].patchValue({
        questionOptions: subQuestionOptionList[i],
      });
    });

    subQuestions = this.createRouteQuestionForm.value.dependentQuestionList;
    dependentQuestionList =
      this.createRouteQuestionForm.value.dependentQuestionList;

    if (dependentQuestionList[0].question !== null) {
      // seperated just the conditions in a new array to form the question trigger
      dependentQuestionList.forEach((x: any) => {
        newConditionArr.push(x.condition);
      });

      // mutating to fit the question trigger
      newConditionArr.forEach((x: any, index: number) => {
        let singleQuestionTrigger = x;

        singleQuestionTrigger = singleQuestionTrigger.map(
          (x: any, i: number) => {
            return {
              ...x,
              optionSequenceNo: x.sequenceNo,
              userId: this.loggedInUserId,
            };
          }
        );
        const keysToDelete = ['isDefault', 'sequenceNo', 'optionValue'];
        // removed these fields from singleQuestionTrigger
        singleQuestionTrigger = singleQuestionTrigger.map((obj: any) => {
          const newObj = { ...obj };
          for (const key of keysToDelete) {
            delete newObj[key];
          }
          return newObj;
        });
        const actualQuestionTrigger: any[] = [];
        singleQuestionTrigger.forEach((y: any) => {
          actualQuestionTrigger.push(y);
        });
        // assign it to relative subquestion
        subQuestions[index].questionTriggers = actualQuestionTrigger;
      });

      subQuestions = subQuestions.map((x: any, index: number) => {
        return {
          ...x,
          name: x.question,
          description: x.question,
          sequenceNo: this.latestSequenceNumber + index + 2 || 2, // should be last sequenceNumber + index + i
          isPublished: true,
          isDeleted: false,
          id: 0,
        };
      });
      subQuestions = subQuestions.map(({ condition, ...x }: any) => x);
    } else {
      subQuestions = null;
    }

    this.store.dispatch(
      RouteQuestionAction.CreateRouteQuestion({
        payload: {
          migrationRouteId: parseInt(
            this.route.snapshot.paramMap.get('routeId') || ''
          ),
          familyMemberId: this.createRouteQuestionForm.value.familyMemberId,
          parentId: 0,
          sequenceNo: this.latestSequenceNumber + 1 || 1,
          question: this.createRouteQuestionForm.value.question,
          questionResponseType:
            this.createRouteQuestionForm.value.questionResponseType,
          questionOptions: this.optionList,
          subQuestions: subQuestions,
          isDeleted: false,
          name: this.createRouteQuestionForm.value.question,
          description: this.createRouteQuestionForm.value.question,
        },
      })
    );
  }

  createRouteQuestion() {
    // const maxId = this.routeQuestionList.reduce(
    //   (max, item) => (item.sequenceNo > max ? item.sequenceNo : max),
    //   0
    // );

    const createQuestionPayload = {
      migrationRouteId: parseInt(
        this.route.snapshot.paramMap.get('routeId') || ''
      ),
      familyMemberId: this.createRouteQuestionForm.value.familyMemberId,
      parentId: 0,
      sequenceNo: this.createRouteQuestionForm.value.sequenceNo,
      // sequenceNo: maxId + 1,
      question: this.createRouteQuestionForm.value.question,
      questionResponseType:
        this.createRouteQuestionForm.value.questionResponseType,
      questionOptions: this.optionList,
      subQuestions: null,
      isDeleted: false,
      name: this.createRouteQuestionForm.value.question,
      description: this.createRouteQuestionForm.value.question,
    };

    this.store.dispatch(
      RouteQuestionAction.CreateRouteQuestion({
        payload: createQuestionPayload,
      })
    );
  }

  editMultiRouteQuestion() {
    // Basically mutating the form value to fit what the backend is expecting
    let subQuestions = this.createRouteQuestionForm.value.dependentQuestionList;
    const dependentQuestionList =
      this.createRouteQuestionForm.value.dependentQuestionList;

    if (dependentQuestionList[0].question !== null) {
      const newConditionArr: any[] = [];

      // seperated just the conditions in a new array to form the question trigger
      dependentQuestionList.forEach((x: any) => {
        newConditionArr.push(x.condition);
      });

      // mutating to fit the question trigger
      newConditionArr.forEach((x: any, index: number) => {
        let singleQuestionTrigger = x;

        singleQuestionTrigger = singleQuestionTrigger.map(
          (x: any, i: number) => {
            return {
              ...x,
              optionSequenceNo: x.sequenceNo,
              userId: this.loggedInUserId,
            };
          }
        );
        const keysToDelete = ['isDefault', 'sequenceNo', 'optionValue'];
        // removed these fields from singleQuestionTrigger
        singleQuestionTrigger = singleQuestionTrigger.map((obj: any) => {
          const newObj = { ...obj };
          for (const key of keysToDelete) {
            delete newObj[key];
          }
          return newObj;
        });
        const actualQuestionTrigger: any[] = [];
        singleQuestionTrigger.forEach((y: any) => {
          actualQuestionTrigger.push(y);
        });
        // assign it to relative subquestion
        subQuestions[index].questionTriggers = actualQuestionTrigger;
      });

      subQuestions = subQuestions.map((x: any, index: number) => {
        return {
          ...x,
          id: x.id ? x.id : 0,
          name: x.question,
          description: x.question,
          sequenceNo: this.latestSequenceNumber + index + 2 || 2, // should be last sequenceNumber + index + i
          isPublished: true,
          isDeleted: false,
        };
      });
      subQuestions = subQuestions.map(({ condition, ...x }: any) => x);
    } else {
      subQuestions = null;
    }

    this.store.dispatch(
      RouteQuestionAction.EditRouteQuestion({
        payload: {
          id: this.editData.id,
          migrationRouteId: parseInt(
            this.route.snapshot.paramMap.get('routeId') || ''
          ),
          familyMemberId: this.createRouteQuestionForm.value.familyMemberId,
          parentId: 0,
          sequenceNo: parseInt(this.createRouteQuestionForm.value.sequenceNo),
          question: this.createRouteQuestionForm.value.question,
          questionResponseType:
            this.createRouteQuestionForm.value.questionResponseType,
          questionOptions: this.optionList,
          subQuestions: subQuestions,
          isDeleted: false,
          name: this.createRouteQuestionForm.value.question,
          description: this.createRouteQuestionForm.value.question,
        },
      })
    );
  }

  updateQuestionsOnDrage(listData: any[]): void {
    this.store.dispatch(
      RouteQuestionAction.EditMultipleRouteQuestion({
        payload: {
          countryId: this.selectedCountry?.id,
          migrationRouteId: parseInt(
            this.route.snapshot.paramMap.get('routeId') || ''
          ),
          routeQuestions: listData,
        },
      })
    );
  }

  editRouteQuestion() {
    const editQuestionPayload = {
      id: this.editData.id,
      migrationRouteId: parseInt(
        this.route.snapshot.paramMap.get('routeId') || ''
      ),
      familyMemberId: this.createRouteQuestionForm.value.familyMemberId,
      parentId: 0,
      sequenceNo: this.createRouteQuestionForm.value.sequenceNo,
      question: this.createRouteQuestionForm.value.question,
      questionResponseType:
        this.createRouteQuestionForm.value.questionResponseType,
      questionOptions: this.optionList,
      subQuestions: null,
      isDeleted: false,
      name: this.createRouteQuestionForm.value.question,
      description: this.createRouteQuestionForm.value.question,
    };

    this.store.dispatch(
      RouteQuestionAction.EditRouteQuestion({
        payload: editQuestionPayload,
      })
    );
  }

  previousPage() {
    if (this.editing === false) {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  toggleCreateForm(): void {
    this.editing = false;
    this.optionList = [];
    this.createRouteQuestionForm.reset(this.createRouteQuestionForm);
    this.createRouteQuestionForm.patchValue({
      countryId: parseInt(this.route.snapshot.paramMap.get('id') || ''),
      migrationRouteId: parseInt(
        this.route.snapshot.paramMap.get('routeId') || ''
      ),
    });
  }

  selectedFees(fee: any, i: number) {
    this.selectedFeeList = [i];
    if (fee) {
      this.editing = true;
      this.editData = this.routeQuestionList[i];

      let editSubQuestions = this.editData.subQuestions;
      editSubQuestions = editSubQuestions.map((x: Questions) => {
        return {
          ...x,
          condition: x.questionTriggers.map((y: Options, index: number) => {
            return {
              optionValue: y.name,
              sequenceNo: 1 + index,
              isDefault: false,
              isDeleted: false,
              name: y.name,
              description: y.name,
              id: y.id,
            };
          }),
        };
      });

      this.createRouteQuestionForm.patchValue({
        name: this.editData.name,
        description: this.editData.description,
        countryId: this.editData.countryId,
        migrationRouteId: this.editData.migrationRouteId,
        familyMemberId: this.editData.familyMemberId,
        parentQuestionId: this.editData.parentQuestionId,
        sequenceNo: this.editData.sequenceNo,
        question: this.editData.question,
        questionResponseType: this.editData.questionResponseType,
        routeQuestionFees: this.editData.routeQuestionFees,
        questionOptions: this.editData.questionOptions,
        dependentQuestionList: editSubQuestions,
        addDependentQuestion:
          this.editData.subQuestions.length > 0 ? true : false,
      });

      this.optionList = [...this.editData.questionOptions];
      this.subOptionList = [];
      editSubQuestions.forEach((element: any) => {
        this.subOptionList.push([...element.questionOptions]);
      });
      this.createRouteQuestionForm.controls['addDependentQuestion'].enable();
      this.createRouteQuestionForm.controls['questionOptions'].enable();
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareFn2(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  onSelectFamilyTypes(event: any, type: string, index: number | null): void {
    const arrValue = event.value;

    if (type === 'one') {
      this.optionList = [];

      if (arrValue.length > 0) {
        arrValue.forEach((item: any) => {
          const newItem: Options = {
            optionValue: item.name,
            sequenceNo: item.value,
            isDefault: false,
            isDeleted: false,
            name: item.name,
            description: item.name,
          };
          this.optionList.push(newItem);
        });
      }
    } else if (type === 'two') {
      if (arrValue && index !== null) {
        this.subOptionList[index + 1] = [];
        this.subOptionList[index].push({
          optionValue: arrValue.name,
          sequenceNo: this.subOptionList.length + 1,
          isDefault: false,
          isDeleted: false,
          name: arrValue.name,
          description: arrValue.name,
        });
      }
    }
  }

  add(event: MatChipInputEvent, type: string, index: number | null): void {
    if (this.editing === true && this.editData.questionResponseType === 2)
      return;
    const value = (event.value || '').trim();
    if (type === 'one') {
      if (value) {
        this.optionList.push({
          optionValue: value,
          sequenceNo: this.optionList.length + 1,
          isDefault: false,
          isDeleted: false,
          // id: 0,
          name: value,
          description: value,
        });
      }
    } else if (type === 'two') {
      if (value && index !== null) {
        this.subOptionList[index + 1] = [];
        this.subOptionList[index].push({
          optionValue: value,
          sequenceNo: this.subOptionList.length + 1,
          isDefault: false,
          isDeleted: false,
          // id: 0,
          name: value,
          description: value,
        });
      }
    }
    event.chipInput!.clear();
  }

  remove(option: any, type: string, i: number | null): void {
    if (this.editing === true && this.editData.questionResponseType === 2)
      return;
    if (type === 'one') {
      const index = this.optionList.indexOf(option);

      if (index >= 0) {
        this.optionList.splice(index, 1);
      }
    }
    if (type === 'two' && i !== null) {
      const index = this.subOptionList[i].indexOf(option);

      if (index >= 0) {
        this.subOptionList[i].splice(index, 1);
      }
    }
  }

  updateSequenceNo($event: any) {
    if ($event) {
      this.createRouteQuestionForm.patchValue({
        sequenceNo: $event.target.value,
      });
    }
  }

  onQuestionTypeChange() {
    this.createRouteQuestionForm.controls['questionOptions'].enable();
    if (this.createRouteQuestionForm.value.questionResponseType === 2) {
      this.createRouteQuestionForm.controls['addDependentQuestion'].enable();
      this.optionList = [
        {
          optionValue: 'true',
          sequenceNo: 1,
          isDefault: false,
          isDeleted: false,
          name: 'true',
          description: 'true',
        },
        {
          optionValue: 'false',
          sequenceNo: 2,
          isDefault: false,
          isDeleted: false,
          name: 'false',
          description: 'false',
        },
      ];
      this.createRouteQuestionForm.controls['questionOptions'].disable();
    } else if (this.createRouteQuestionForm.value.questionResponseType === 7) {
      this.createRouteQuestionForm.controls['addDependentQuestion'].enable();
      if (this.investmentTierList.length > 0) {
        this.optionList = this.investmentTierList.map(
          (value: IInvestmentTier, index: number) => ({
            // optionValue: value.id.toString(),
            optionValue: value.name,
            sequenceNo: index + 1,
            isDefault: false,
            isDeleted: false,
            name: value.name,
            description: value.description,
          })
        );
      }
    } else if (
      this.createRouteQuestionForm.value.questionResponseType === 3 ||
      this.createRouteQuestionForm.value.questionResponseType === 4 ||
      this.createRouteQuestionForm.value.questionResponseType === 6
    ) {
      this.optionList = [];
      this.createRouteQuestionForm.controls['addDependentQuestion'].enable();
    } else {
      this.optionList = [];
      this.createRouteQuestionForm.controls['addDependentQuestion'].disable();
    }
  }

  onQuestionTypeChange2(value: any, index: number) {
    if (value.value === 2) {
      this.subOptionList[index] = [
        {
          optionValue: 'true',
          sequenceNo: 1,
          isDefault: false,
          isDeleted: false,
          name: 'true',
          description: 'true',
        },
        {
          optionValue: 'false',
          sequenceNo: 1,
          isDefault: false,
          isDeleted: false,
          name: 'false',
          description: 'false',
        },
      ];
    }
  }

  ngOnDestroy(): void {
    this.pushQuestionSub ? this.pushQuestionSub.unsubscribe() : null;
    this.getMigrationRouteByIdSub
      ? this.getMigrationRouteByIdSub.unsubscribe()
      : null;
    this.getFamilyTypeSub ? this.getFamilyTypeSub.unsubscribe() : null;
    this.getQuestionTypeSub ? this.getQuestionTypeSub.unsubscribe() : null;
  }
}
