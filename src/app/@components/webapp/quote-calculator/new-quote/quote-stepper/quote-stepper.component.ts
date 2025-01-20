import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { MatStepper, matStepperAnimations } from '@angular/material/stepper';
import {
  AnswerInterface,
  FormBuilderTypes,
  FormBuilderTypesInterface,
  QuestionOption,
  StepInfoInterface,
} from '../../quote-calculator.interface';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRoutesSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';
import * as RouteQuestionAction from 'src/app/@core/stores/routeQuestions/routeQuestions.actions';
import * as RouteQuestionsSelector from 'src/app/@core/stores/routeQuestions/routeQuestions.selectors';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as applicantsSelectors from 'src/app/@core/stores/applicants/applicants.selectors';
import * as DiscountActions from 'src/app/@core/stores/discount/discount.actions';
import * as DiscountSelectors from 'src/app/@core/stores/discount/discount.selectors';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { MigrationData } from '../../../admin-settings/country-setup/country-dashboard/migration-routes/migration-routes.component';
import { CountryData } from '../../../admin-settings/country-setup/country-setup.component';
import { ConfirmQuoteComponent } from '../confirm-quote/confirm-quote.component';
import { ApplicationResponseSchema } from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as QuoteCalculatorActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import { QuoteQuestionInterface } from 'src/app/@core/interfaces/quoteCalculator.interface';
import { IInvestmentTier } from 'src/app/@core/interfaces/investmentTier.interface';
import { generateUUID } from 'src/app/@core/utils/helpers';
import { IDiscountDetails } from 'src/app/@core/models/discount-request.model';
import { ApplyDiscountModalComponent } from './apply-discount-modal/apply-discount-modal.component';

@Component({
  selector: 'app-quote-stepper',
  templateUrl: './quote-stepper.component.html',
  styleUrls: ['./quote-stepper.component.scss'],
  animations: [
    matStepperAnimations.horizontalStepTransition,
    // matStepperAnimations.verticalStepTransition,
  ],
})
export class QuoteStepperComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() emitSelectedIndex = new EventEmitter<any>();
  @Output() quoteGenerated = new EventEmitter<any>();
  @ViewChild('stepper') stepper!: MatStepper;

  formBuilderTypes: FormBuilderTypesInterface | any = FormBuilderTypes;
  displayStepper = false;
  matSteps!: HTMLCollectionOf<HTMLElement> | any;
  selectedIndex = 0;
  animationDuration = '5000ms';
  isLoading!: Observable<boolean>;
  isApplicationSuccess!: Observable<boolean>;
  isApplicationLoading!: Observable<boolean>;
  isRouteSuccess!: Observable<boolean>;
  isLoadingQuestion!: Observable<boolean>;

  getAllContriesSub!: Subscription;
  getAllMigrationRouteSub!: Subscription;
  createdApplicationSub!: Subscription;
  countryList: any[] = [];
  countryMigrationList: any[] = [];

  showMigrationError: boolean = false;
  showQuestionError: boolean = false;
  showMultiQuestionError: boolean = false;

  selectedCountry!: CountryData;
  selectedCountryName = '';
  selectedCountryId!: number;
  selectedRoute!: MigrationData;
  currentApplication!: any;

  applicationResponses: ApplicationResponseSchema[] = [];
  haveAnswered: boolean = false;
  rangeValue!: number | null;
  selectedInvestedTypeId!: number;
  freeTextValue!: string | null;
  activeDiscount: IDiscountDetails | null = null;

  stepperInfo: StepInfoInterface[] = [
    {
      type: this.formBuilderTypes.WELCOME,
      tagline: '',
      question: '',
      label_highlight: '',
      options: [],
      show_previous_question: false,
      questionOptions: [],
    },
    {
      type: this.formBuilderTypes.COUNTRY,
      tagline: '',
      question: 'Select preferred program',
      label_highlight: 'country',
      options: [],
      show_previous_question: false,
      placeholder: 'Select Country',
      questionOptions: [],
    },
    {
      type: this.formBuilderTypes.ROUTE,
      tagline: '',
      question: 'Select route',
      label_highlight: 'route',
      options: [],
      show_previous_question: false,
      placeholder: 'Select state',
      questionOptions: [],
    },
  ];
  routeQuestionSub!: Subscription;
  getSingleApplicantsSub!: Subscription;

  applicantsSuccessSub!: Subscription;
  routeSuccessSub!: Subscription;
  getApplicationQuoteSub!: Subscription;

  singleApplicant!: any;
  routeQuestionList: any[] = [];
  // currentSelectedValueName!: string;
  currentSelectedValue!: QuestionOption | null;
  quoteData!: any | null;
  reCalculateInterval: any;

  editApplicationQuoteId!: number;
  editingApplicationQuote = false;
  getApplicationQuoteByIdSub!: Subscription;
  editSelectedApplicationQuote!: any;

  selectedAnswers: AnswerInterface[] = [];
  investmentTierList: IInvestmentTier[] = [];

  previousQuestionArr: ApplicationResponseSchema[] = [];
  isCurrentQuestion = false;
  shouldApplyDiscount: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.getAllCountry();
    this.getApplicantSub();
    this.displayStepper = true;

    this.isLoading = this.store.pipe(
      select(MigrationRoutesSelector.getMigrationRouteIsLoading)
    );
    this.isLoadingQuestion = this.store.pipe(
      select(RouteQuestionsSelector.getRouteQuestionIsLoading)
    );

    this.isApplicationSuccess = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesSuccessAction)
    );

    this.isApplicationLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );

    this.isRouteSuccess = this.store.pipe(
      select(RouteQuestionsSelector.getSuccessAction)
    );
    this.editApplicationQuoteId = parseInt(
      this.route.snapshot.paramMap.get('applicationQuoteId') || '0'
    );

    // if (this.editApplicationQuoteId && this.editApplicationQuoteId > 0) {
    //   this.editingApplicationQuote = true;
    //   this.getApplicationQuoteById();
    // }
  }

  ngAfterViewInit(): void {
    this.matSteps = Array.from(
      document.getElementsByClassName(
        'mat-step'
      ) as HTMLCollectionOf<HTMLElement>
    );

    this.setSelectedIndexProperties();

    // && this.currentApplication && this.applicationResponses

    // if(this.editingApplicationQuote){
    //   this.reGenerateApplicationQuote();
    // }
    if (this.editApplicationQuoteId && this.editApplicationQuoteId > 0) {
      this.editingApplicationQuote = true;
      this.getApplicationQuoteById();
    }
  }

  getAllInvestmentTiersByMigrationId() {
    this.store.dispatch(
      MigrationRoutesActions.GetAllInvestmentTiersByMigrationRouteId({
        payload: {
          migrationRouteId: this.selectedRoute.id,
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

  getAllCountry() {
    this.store.dispatch(CountriesActions.GetActiveCountries());
    this.getAllContriesSub = this.store
      .pipe(select(CountriesSelector.getActiveCountries))
      .subscribe((resData: any) => {
        if (resData) {
          this.countryList = resData;
        }
      });
  }

  getActiveDiscountByCountryId(countryId: number, migrationRouteId: number) {
    this.store.dispatch(
      DiscountActions.GetActiveDiscountByCountryIdAndMigrationRouteId({
        payload: { skip: 0, take: 10, countryId, migrationRouteId },
      })
    );

    const subscription = this.store
      .pipe(
        select(
          DiscountSelectors.getActiveDiscountByCountryIdAndMigrationRouteId
        ),
        distinctUntilChanged()
      )
      .subscribe((resData: any) => {
        if (resData) {
          this.activeDiscount = resData;
          // this.activeDiscount = resData.data.find(
          //   (item: any) =>
          //     item.migrationRouteId === migrationRouteId &&
          //     item.statusDesc === 'Active'
          // );
          if (this.activeDiscount) {
            this.openApplyDiscountModal(this.activeDiscount);
            this.store.dispatch(DiscountActions.ClearActiveDiscountState());
            subscription.unsubscribe();
          }
        }
      });
  }

  openApplyDiscountModal(discount: IDiscountDetails): void {
    const dialogRef = this.dialog.open(ApplyDiscountModalComponent, {
      data: {
        discount,
        country: { id: discount.countryId, name: discount.countryName },
        migrationRoute: {
          id: discount.migrationRouteId,
          name: discount.migrationRouteName,
        },
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.shouldApplyDiscount = data.shouldApplyDiscount;
      }
      this.activeDiscount = null;
    });
  }

  onCountrySelect(event: any) {
    this.selectedCountryName = event.value.name;
    this.selectedCountryId = event.value.id;
    this.getAllMigrationRoutes(event.value.id);
  }

  getAllMigrationRoutes(countryId: number) {
    this.store.dispatch(
      MigrationRoutesActions.GetActiveMigrationRoutesByCountryId({
        payload: { id: countryId },
      })
    );

    this.getAllMigrationRouteSub = this.store
      .pipe(select(MigrationRoutesSelector.getActiveMigrationRoutesByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          resData.length > 0
            ? (this.showMigrationError = false)
            : (this.showMigrationError = true);
          this.countryMigrationList = resData;
        }
      });
  }

  public stepChanged({ selectedIndex }: StepperSelectionEvent) {
    this.selectedIndex = selectedIndex;
    const properties = {
      selectedIndex: this.selectedIndex,
      stepArr: this.stepperInfo,
    };
    this.emitSelectedIndex.emit(properties);
    this.setSelectedIndexProperties();
  }

  setSelectedIndexProperties() {
    if (this.editingApplicationQuote === true) {
      // this.onEditingProcesses();
    } else {
      if (this.selectedIndex === 0) {
        setTimeout(() => {
          this.stepper.next();
        }, 3000);
      }

      this.matSteps[this.selectedIndex].style.display = 'block';
      this.matSteps.forEach((step: HTMLElement, index: number) => {
        if (index === this.selectedIndex) {
          step.classList.add('show-step');
        } else {
          step.classList.remove('show-step');
        }
      });
    }
  }

  public constructLabel(item: StepInfoInterface) {
    // TODO: Dynamically highlight Label
    return item.question;
  }

  previousPage() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  selectedMigrationRoute(data: any) {
    if (data.id) {
      this.selectedRoute = data;
      this.getAllRouteQuestionByMigrationId(data.id);
      this.manageAllInvestmentTiers();
      if (this.selectedCountryId) {
        this.getActiveDiscountByCountryId(this.selectedCountryId, data.id);
      }
    }
  }

  getAllRouteQuestionByMigrationId(id: number) {
    this.store.dispatch(RouteQuestionAction.SuccessAction({ payload: true }));
    this.store.dispatch(RouteQuestionAction.IsLoading({ payload: true }));
    this.store.dispatch(
      RouteQuestionAction.GetActiveRouteQuestionsByMigrationId({
        payload: {
          id: id,
        },
      })
    );

    this.routeQuestionSub = this.store
      .pipe(select(RouteQuestionsSelector.getActiveRouteQuestionByMigrationId))
      .subscribe((resData: any) => {
        if (resData) {
          resData.length > 0
            ? (this.showQuestionError = false)
            : (this.showQuestionError = true);
          this.routeQuestionList = resData;

          if (this.editingApplicationQuote === true) {
            this.stepperNext(this.stepperInfo[2], 3);
            this.addAnswers();
          }
        }
      });
  }

  getApplicantSub() {
    this.getSingleApplicantsSub = this.store
      .pipe(select(applicantsSelectors.getSingleApplicants))
      .subscribe((resData) => {
        if (resData) {
          this.singleApplicant = resData;
        }
      });
  }

  stepperNext(quesion: StepInfoInterface, index: number) {
    this.getQuoteData();

    if (quesion.type === 'WELCOME' || quesion.type === 'COUNTRY') {
      this.stepper.next();
      this.store.dispatch(
        QuoteCalculatorActions.AddQuestionToQuoteQuestion({
          question: {
            id: index,
            question: quesion.question,
            answer: this.selectedCountryName ?? '',
            type: quesion.type,
          },
        })
      );
    } else if (quesion.type === 'Confirm') {
      this.dialog.open(ConfirmQuoteComponent, {
        data: {
          quoteData: this.quoteData,
        },
      });
    } else if (quesion.type === 'ROUTE') {
      if (this.editingApplicationQuote === false) {
        this.store.dispatch(
          QuoteCalculatorActions.AddQuestionToQuoteQuestion({
            question: {
              id: index,
              question: quesion.question,
              answer: this.selectedRoute.name ?? '',
              type: quesion.type,
            },
          })
        );
        this.createApplication();
      }

      this.routeQuestionList.forEach((x: any, index: number, arr: any[]) => {
        let optionsArr = x.questionOptions ? [...x.questionOptions] : [];
        optionsArr = optionsArr.map((y: any) => {
          return {
            ...y,
            checked: false,
          };
        });

        const questions: StepInfoInterface = {
          ...x,
          type: x.questionResponseTypeDesc,
          tagline: '',
          options: optionsArr,
          finalQuestion: index + 1 === arr.length ? true : false,
        };
        this.stepperInfo.push(questions);
      });

      // add last / confirmation page
      const lastQuestion: StepInfoInterface = {
        type: this.formBuilderTypes.Confirm,
        tagline: '',
        question: '',
        label_highlight: '',
        options: [],
        show_previous_question: false,
        questionOptions: [],
      };
      this.stepperInfo.push(lastQuestion);

      setTimeout(() => {
        this.updateStepper();
        if (this.editingApplicationQuote === false) {
          this.getCreatedApplication(); // to get the application response from state
        }
      }, 200);
    } else if (quesion.finalQuestion === true) {
      this.questionNextStep(quesion, index);
      this.createApplicationQuote();
    } else {
      this.questionNextStep(quesion, index);
    }
  }

  updateStepper() {
    this.matSteps = Array.from(
      document.getElementsByClassName(
        'mat-step'
      ) as HTMLCollectionOf<HTMLElement>
    );
    this.stepper._steps.reset(this.matSteps.length);

    this.matSteps[3].style.display = 'block';
    this.matSteps.forEach((step: HTMLElement) => {
      step.classList.add('show-step');
    });

    if (this.editingApplicationQuote === true) {
      this.stepper.selectedIndex = this.matSteps.length - 1;
    } else {
      this.stepper.next();
    }
  }

  questionNextStep(question: StepInfoInterface, index: number) {
    if (this.editingApplicationQuote && this.isCurrentQuestion) {
      this.isCurrentQuestion = false;
      this.store.dispatch(
        QuoteCalculatorActions.RemoveLastQuestionInQuoteQuestion()
      );
    }
    // Range or Number Question Type
    if (question.type === 'Number') {
      this.store.dispatch(
        QuoteCalculatorActions.AddQuestionToQuoteQuestion({
          question: {
            id: index,
            question: question.question,
            answer: question.answer2?.toString() ?? '',
            type: question.type,
          },
        })
      );
      this.pushQuestionResponses(question, question.answer2);
      this.haveAnswered = false;
    }
    // Free Text Question Type
    else if (question.type === 'FreeText') {
      this.store.dispatch(
        QuoteCalculatorActions.AddQuestionToQuoteQuestion({
          question: {
            id: index,
            question: question.question,
            answer: this.freeTextValue ?? '',
            type: question.type,
          },
        })
      );
      this.pushQuestionResponses(question, this.freeTextValue);
      this.haveAnswered = false;
    }
    // True or False Question Type
    else if (question.type === 'TrueOrFalse') {
      this.store.dispatch(
        QuoteCalculatorActions.AddQuestionToQuoteQuestion({
          question: {
            id: index,
            question: question.question,
            answer: this.currentSelectedValue?.toString() ?? '',
            type: question.type,
          },
        })
      );
      this.pushQuestionWithOneOptionsResponses(
        question,
        this.currentSelectedValue
      );
    }
    // Single Selection Question Type
    else if (question.type === 'SingleSelection') {
      this.store.dispatch(
        QuoteCalculatorActions.AddQuestionToQuoteQuestion({
          question: {
            id: index,
            question: question.question,
            answer: this.currentSelectedValue?.name ?? '',
            type: question.type,
          },
        })
      );
      if (question.questionOptions.length > 0) {
        this.pushQuestionWithOneOptionsResponses(
          question,
          this.currentSelectedValue
        );
      }
    } else if (question.type === 'RealEstateInvestmentType') {
      this.store.dispatch(
        QuoteCalculatorActions.AddQuestionToQuoteQuestion({
          question: {
            id: index,
            question: question.question,
            answer: this.currentSelectedValue?.name ?? '',
            type: question.type,
          },
        })
      );
      if (question.questionOptions.length > 0) {
        this.pushQuestionWithOneOptionsResponses(
          question,
          this.currentSelectedValue
        );
      }
    }
    // Multi Selection Question Type and family member type
    else if (
      question.type === 'MultiSelection' ||
      question.type === 'FamilyMemberType'
    ) {
      this.store.dispatch(
        QuoteCalculatorActions.AddQuestionToQuoteQuestion({
          question: {
            id: index,
            question: question.question,
            answer: this.currentSelectedValue?.name ?? '',
            type: question.type,
          },
        })
      );
      if (question.questionOptions.length > 0) {
        this.pushQuestionWithMultiOptionsResponses(
          question,
          this.currentSelectedValue
        );
      }
    }

    this.currentSelectedValue = null;
    if (this.editingApplicationQuote === true) {
      this.haveAnswered = true;
    }
  }

  // for number and free text question type
  pushQuestionResponses(question: any, answer: any) {
    const item: ApplicationResponseSchema = {
      applicationId: this.currentApplication.id,
      routeQuestionId: question.id,
      responseValue: answer.toString(),
      selectedOptions: [],
      isDeleted: false,
      name: answer.toString(),
      description: answer.toString(),
    };
    this.applicationResponses.push(item);
    // reset ng model
    // this.rangeValue = null;
    this.freeTextValue = null;

    if (question.finalQuestion === false) {
      this.stepper.next();
    }
  }

  // for question with one selected option (truefalse and single selection)
  pushQuestionWithOneOptionsResponses(question: any, answer: any) {
    const selectedQuestionOption = question?.questionOptions.filter(
      (option: any) => option.optionValue === answer
    );
    const selectedOptions = selectedQuestionOption.map((selected: any) => {
      const newObj = {
        optionValue: selected.optionValue,
        isDeleted: false,
        id: selected.id,
        name: selected.optionValue,
        description: selected.optionValue,
      };
      return newObj;
    });

    const item: ApplicationResponseSchema = {
      applicationId: this.currentApplication.id,
      routeQuestionId: question.id,
      responseValue: answer,
      selectedOptions: selectedOptions,
      isDeleted: false,
      name: answer,
      description: answer,
    };

    if (item.responseValue) {
      this.applicationResponses.push(item);
    } else if (this.previousQuestionArr.length > 0) {
      this.applicationResponses.push(this.previousQuestionArr[0]);
      this.previousQuestionArr.pop();
    }

    // VERY IMPORTANT TO MAKE QUESTION GO TO APPROPRIATE NEXT QUESTION
    if (question.finalQuestion === false) {
      this.jumpToQuestionBasedOnSelectedOption(
        selectedQuestionOption[0],
        question.subQuestions
      );
    }
  }

  // for question with multi selected option and family member type
  pushQuestionWithMultiOptionsResponses(question: any, answer: any) {
    const selectedOptions = answer.map((selected: any) => {
      const newObj = {
        optionValue: selected.optionValue,
        isDeleted: false,
        id: selected.id,
        name: selected.optionValue,
        description: selected.optionValue,
      };
      return newObj;
    });

    const item: ApplicationResponseSchema = {
      applicationId: this.currentApplication.id,
      routeQuestionId: question.id,
      responseValue: answer,
      selectedOptions: selectedOptions,
      isDeleted: false,
      name: answer,
      description: answer,
    };

    if (item.responseValue) {
      this.applicationResponses.push(item);
    } else if (this.previousQuestionArr.length > 0) {
      this.applicationResponses.push(this.previousQuestionArr[0]);
      this.previousQuestionArr.pop();
    }

    this.applicationResponses.push(item);

    if (question.finalQuestion === false) {
      this.stepper.next();
    }
  }

  jumpToQuestionBasedOnSelectedOption(questionOption: any, subQuestion: any[]) {
    // debugger;
    if (subQuestion && subQuestion.length > 0) {
      const possibleQuestions: StepInfoInterface[] = [];

      this.stepperInfo.forEach((x: any) => {
        if (x.questionTriggers && x.questionTriggers.length > 0) {
          possibleQuestions.push(x);
        }
      });
      const nextQuestion: any[] = [];

      if (possibleQuestions.length > 0) {
        possibleQuestions.forEach((x: any) => {
          if (x.questionTriggers && x.questionTriggers.length > 0) {
            x.questionTriggers.forEach((y: any) => {
              if (
                y.questionOptionId === questionOption.id &&
                y.name === questionOption.name
              ) {
                nextQuestion.push(x);
              }
            });
          }
        });
      } else {
        this.stepper.next();
      }

      if (nextQuestion && nextQuestion.length > 0) {
        const nextQuestionIndex = this.stepperInfo.findIndex(
          (obj) => obj.id === nextQuestion[0]?.id
        );
        this.stepper.selectedIndex = nextQuestionIndex;
      } else {
        // this.stepper.next();
        const nextQuestionIndex = this.stepperInfo.findIndex(
          (obj) =>
            obj?.name?.toLowerCase() ===
            possibleQuestions[possibleQuestions.length - 1]?.name?.toLowerCase() // you're meant to use id instead of name to compare
        );
        if (
          possibleQuestions[possibleQuestions.length - 1]?.finalQuestion ===
          false
        ) {
          this.stepper.selectedIndex = nextQuestionIndex + 1;
        } else {
          // this.stepper.selectedIndex = nextQuestionIndex + 1; // God hep us !!!
          this.createApplicationQuote();
        }
      }
    } else {
      this.stepper.next();
    }
  }

  createApplication() {
    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicationQuotesActions.CreateApplication({
        payload: {
          name: this.singleApplicant.lastName,
          description: this.singleApplicant.lastName,
          applicantId: parseInt(this.route.snapshot.paramMap.get('id') || ''),
          migrationRouteId: this.selectedRoute?.id || 0,
          rmId: this.singleApplicant.rmId,
          applicationResponses: [],
        },
      })
    );
  }

  // reGenerateApplicationQuote(){
  //   this.reCalculateInterval = setInterval(() => {
  //     this.generateApplicationQuote();
  //   }, 10000);
  // }

  generateApplicationQuote() {
    const payload = {
      applicationId: this.currentApplication.id,
      applicationResponses: this.applicationResponses,
      investmentTierId:
        this.selectedCountryName == 'Malta' ? 0 : this.selectedInvestedTypeId,
      shouldApplyDiscount: this.shouldApplyDiscount,
    };

    this.store.dispatch(
      ApplicationQuotesActions.CreateApplicationQuotes({
        payload: {
          requestId: generateUUID(),
          ...payload,
        },
      })
    );

    this.store
      .pipe(select(ApplicationQuotesSelector.getCreatedApplicationResponse))
      .subscribe((resData: any) => {
        if (resData) {
          this.quoteGenerated.emit(resData);
        }
      });
  }

  createApplicationQuote() {
    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));

    if (this.editingApplicationQuote === true) {
      this.generateApplicationQuote();
      this.isApplicationSuccess.subscribe((x: any) => {
        if (x === true) {
          this.stepper.selectedIndex = this.stepperInfo.length - 1;
        }
      });
    } else {
      this.generateApplicationQuote();

      this.isApplicationSuccess.subscribe((x: any) => {
        if (x === true) {
          this.stepper.selectedIndex = this.stepperInfo.length - 1;
        }
      });
    }
  }

  getCreatedApplication() {
    this.createdApplicationSub = this.store
      .pipe(select(ApplicationQuotesSelector.getCreatedApplication))
      .subscribe((resData: any) => {
        if (resData) {
          this.currentApplication = resData;
        }
      });
  }

  getSelectedValue(value: any, type: string) {
    if (type === 'TrueOrFalse') {
      this.currentSelectedValue = value;
      this.haveAnswered = true;
    } else if (type === 'SingleSelection') {
      this.currentSelectedValue = value.optionValue;
      this.haveAnswered = true;
    } else if (type === 'RealEstateInvestmentType') {
      this.currentSelectedValue = value.optionValue;
      const investment = this.investmentTierList.find(
        (item) => value.name === item.name
      );
      if (investment) {
        this.selectedInvestedTypeId = investment.id;
      }
      this.haveAnswered = true;
    } else if (type === 'MultiSelection' || type === 'FamilyMemberType') {
      this.currentSelectedValue = value.filter(
        (value: any) => value.checked === true
      );
      this.haveAnswered = true;
    }
  }

  onRangeChange(value: any) {
    if (value !== null) {
      this.haveAnswered = true;
    } else {
      this.haveAnswered = false;
    }
  }

  onFreeTextChange(value: any) {
    if (value.value !== null || value.value !== '') {
      this.haveAnswered = true;
    } else {
      this.haveAnswered = false;
    }
  }

  goToPreviousQuestion(currentQuestion: StepInfoInterface) {
    if (this.editingApplicationQuote === false) {
      this.stepper.previous();
      this.store.dispatch(
        QuoteCalculatorActions.RemoveLastQuestionInQuoteQuestion()
      );
      if (this.applicationResponses.length > 0) {
        this.previousQuestionArr.push(
          this.applicationResponses[this.applicationResponses.length - 1]
        );
        this.applicationResponses.pop();
      }
    } else if (this.editingApplicationQuote === true) {
      if (
        this.stepperInfo.findIndex(
          (question: any) => question === currentQuestion
        ) <= 3
      ) {
        return;
      } else {
        this.stepper.previous();
        // if (this.applicationResponses.length > 0) {
        this.store.dispatch(
          QuoteCalculatorActions.RemoveLastQuestionInQuoteQuestion()
        );
        this.previousQuestionArr.push(
          this.applicationResponses[this.applicationResponses.length - 1]
        );
        this.applicationResponses.pop();

        if (currentQuestion.type === 'Confirm') {
          return;
        } else {
          this.isCurrentQuestion = true;
        }
        // }
      }

      this.selectedCountry =
        this.countryList.find(
          (country) => country.id === this.selectedRoute.countryId
        ) ?? {};
    }
    this.haveAnswered = true;
  }

  getQuoteData() {
    this.getApplicationQuoteSub = this.store
      .pipe(select(ApplicationQuotesSelector.getCreatedApplicationResponse))
      .subscribe((resData: any) => {
        if (resData) {
          this.quoteData = resData;
        }
      });
  }

  getApplicationQuoteById() {
    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      ApplicationQuotesActions.GetApplicationQuoteById({
        payload: {
          id: this.editApplicationQuoteId,
        },
      })
    );

    this.getApplicationQuoteByIdSub = this.store
      .pipe(select(ApplicationQuotesSelector.getApplicationQuoteById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.getCountryById(res?.application?.migrationRoute?.countryId);

          this.selectedRoute = res.application.migrationRoute ?? {};
          this.currentApplication = res.application;
          this.editSelectedApplicationQuote = res;
          this.onEditingProcesses();
          const responses =
            this.editSelectedApplicationQuote?.application
              ?.applicationResponses;
          this.selectedAnswers.push({
            answer: '',
            questionId: 0,
          });
          this.selectedAnswers.push({
            answer: '',
            questionId: 0,
          });
          this.selectedAnswers.push({
            answer: '',
            questionId: 0,
          });

          const newQuestionAnswerArr: QuoteQuestionInterface[] = [];

          responses.forEach((item: any, idx: number) => {
            const newItem: AnswerInterface = {
              answer: '',
              questionId: 0,
            };

            const newItemResponses: any = {
              applicationId: Number(item.applicationId),
              routeQuestionId: item.routeQuestion.id,
              responseValue: item.response,
              selectedOptions: [],
              isDeleted: false,
              name: item.response,
              description: item.response,
            };
            newItem.answer = item.response;
            newItem.questionId = item.routeQuestion.id;

            if (item.response === 'true' || item.response === 'false') {
              const selectOption: any = {
                optionValue: item.response,
                isDeleted: false,
                id: item.questionOptionId,
                name: item.response,
                description: item.response,
              };

              newItemResponses.selectedOptions = [selectOption];
            }

            const questionObj = {
              id: idx,
              question: item.routeQuestion.name,
              answer: item.response,
              type: item.routeQuestion.questionResponseTypeDesc,
            };

            newQuestionAnswerArr.push(questionObj);

            this.store.dispatch(
              QuoteCalculatorActions.AddQuestionToQuoteQuestion({
                question: questionObj,
              })
            );

            this.selectedAnswers.push(newItem);
            this.applicationResponses.push(newItemResponses);
          });
        }
      });
  }

  getCountryById(countryId?: number) {
    if (!countryId) return;

    this.store.dispatch(
      CountriesActions.GetCountryById({
        payload: {
          id: countryId,
        },
      })
    );

    this.store
      .pipe(select(CountriesSelector.getCountryById))
      .subscribe((resData: any) => {
        if (resData) {
          this.selectedCountry = resData;
        }
      });
  }

  onEditingProcesses() {
    this.getAllMigrationRoutes(
      this.editSelectedApplicationQuote?.application?.migrationRoute?.countryId
    );
    this.getAllRouteQuestionByMigrationId(
      this.editSelectedApplicationQuote?.application?.migrationRoute?.id
    );
  }

  addAnswers() {
    this.stepperInfo = this.stepperInfo.map(
      (item: StepInfoInterface, index: number) => {
        return {
          ...item,
          answer: this.selectedAnswers[index],
          answer2: Number(this.selectedAnswers[index]?.answer),
        };
      }
    );
    const newQuestionAnswerArr: QuoteQuestionInterface[] = [];

    this.stepperInfo = this.removeDuplicatesByName(this.stepperInfo);

    this.stepperInfo.forEach((step, index) => {
      if (index === 1) {
        // country step
        newQuestionAnswerArr.push({
          id: index,
          question: step.question,
          answer: this.selectedRoute.countryName ?? '',
          type: step.type,
        });
      } else if (index === 2) {
        // migration route step
        newQuestionAnswerArr.push({
          id: index,
          question: step.question,
          answer: this.selectedRoute.name,
          type: step.type,
        });
      } else if (index > 2) {
        // other questions
        newQuestionAnswerArr.push({
          id: index,
          question: step.question,
          answer: step.answer?.answer ?? '',
          type: step.type,
        });
      }
    });

    this.store.dispatch(
      QuoteCalculatorActions.SetQuestionsToQuoteQuestion({
        questions: newQuestionAnswerArr,
      })
    );
  }

  removeDuplicatesByName(arr: any[]): any[] {
    const seen = new Set();
    return arr.filter((item) => {
      if (!item || !item.name) {
        return true; // Keep items without a name field or falsy values
      }
      const name = item.name;
      if (seen.has(name)) {
        return false;
      }
      seen.add(name);
      return true;
    });
  }

  ngOnDestroy(): void {
    this.stepperInfo = [];
    this.store.dispatch(
      RouteQuestionAction.ClearActiveRouteQuestionsByMigrationId()
    );
    this.store.dispatch(QuoteCalculatorActions.ClearQuoteQuestion());
    this.store.dispatch(QuoteCalculatorActions.ResetStore());
    this.activeDiscount = null;
    this.store.dispatch(DiscountActions.ClearState());

    this.getAllContriesSub
      ? this.getAllContriesSub.unsubscribe()
      : this.getAllContriesSub;
    this.routeQuestionSub
      ? this.routeQuestionSub.unsubscribe()
      : this.routeQuestionSub;
    this.getSingleApplicantsSub
      ? this.getSingleApplicantsSub.unsubscribe()
      : null;

    this.applicantsSuccessSub ? this.applicantsSuccessSub.unsubscribe() : null;

    this.routeSuccessSub ? this.routeSuccessSub.unsubscribe() : null;

    this.getApplicationQuoteSub
      ? this.getApplicationQuoteSub.unsubscribe()
      : null;

    this.getApplicationQuoteByIdSub
      ? this.getApplicationQuoteByIdSub.unsubscribe()
      : null;

    clearInterval(this.reCalculateInterval);
  }
}
