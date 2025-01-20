import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignOfficerModalComponent } from './assign-officer-modal/assign-officer-modal.component';
import { CreateMeetingModalComponent } from './create-meeting-modal/create-meeting-modal.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { CancelTaskComponent } from './cancel-task/cancel-task.component';
import { ActivatedRoute, Router } from '@angular/router';

import * as NoteActions from '../../../../../@core/stores/notes/notes.actions';
import * as NoteSelectors from '../../../../../@core/stores/notes/notes.selectors';
import * as fromApp from '../../../../../@core/stores/app.reducer';
import * as SalesActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as saleSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as usersSelections from 'src/app/@core/stores/users/users.selectors';
import * as usersActions from 'src/app/@core/stores/users/users.actions';
import { ViewTaskComponent } from './view-task/view-task.component';
import { Meeting } from 'src/app/@core/interfaces/meeting.interface';
import {
  IACTIVITIES_BY_ID,
  IASSIGNED_OFFICERS,
  IMAIN_OFFICER,
  ISUPPORTING_OFFICER,
  ISalesOverViewPartialPageData,
  OfficerType,
} from 'src/app/@core/models/sales';
import * as ApplicationPhaseActions from '../../../../../@core/stores/applicationPhase/application-phase.actions';
import * as ApplicationPhaseSelectors from '../../../../../@core/stores/applicationPhase/application-phase.selectors';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as DocumentCollectionSelector from 'src/app/@core/stores/document-collection/document-collection.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralLoaderActions from 'src/app/@core/stores/general/general.actions';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';

import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { DaoAssignToCmaComponent } from './dao-assign-to-cma/dao-assign-to-cma.component';
import { OnboardingMeetingModalComponent } from './onboarding-meeting-modal/onboarding-meeting-modal.component';
import { slideInOutFromRight } from 'src/app/@core/animations/animation';
import { PermissionService } from 'src/app/@core/services/permission.service';

export type ApplicationPhases =
  // Sub-Action for onboarding Phase
  | 'assign-cma'
  | 'start-onboarding'
  | 'call-applicant'
  | 'schedule-onboarding-meeting'
  | 'complete-onboarding'

  // Sub-Action for document collation Phase
  | 'start-document-collation'
  | 'completed-family-member-details'
  | 'completed-document-questions'
  | 'complete-document-collation'

  // Sub-Action for document processing Phase
  | 'start-document-processing'
  | 'complete-document-processing'

  // Sub-Action for document support
  | 'start-document-support'
  | 'complete-document-support'

  // Sub-Action for document audit Phase
  | 'start-document-audit'
  | 'complete-document-audit';

export enum PhasesEnum {
  ONBOARDING = 'onboarding',
  DOCUMENT_COLLATION = 'document-collation',
  DOCUMENT_PROCESSING = 'document-processing',
  DOCUMENT_SUPPORT = 'document-support',
  DOCUMENT_AUDIT = 'document-audit',
}

export enum PhaseStatusEnum {
  NOT_STARTED = 1,
  STARTED = 2,
}

@Component({
  selector: 'app-sale-overview',
  templateUrl: './sale-overview.component.html',
  styleUrls: ['./sale-overview.component.scss'],
  exportAs: 'salesOverview',
  animations: [slideInOutFromRight],
})
export class SaleOverviewComponent implements OnInit, OnDestroy {
  @Output() private routeTabs: EventEmitter<{
    tabIndex: number;
    extras?: PhasesEnum | undefined;
    id: number | undefined;
  }> = new EventEmitter();

  @Input() applicant: any;
  public users: any[] = []; // pass to  modals

  public applicationId: number = parseInt(
    this.activatedRoute.snapshot.paramMap.get('applicationId')!
  );

  public applicantId: number = parseInt(
    this.activatedRoute.snapshot.paramMap.get('applicantId')!
  );
  public applicantQuoteId: number = parseInt(
    this.activatedRoute.snapshot.queryParamMap.get('quoteId')!
  );

  public tasks: any[] = [];
  public meetings: any[] = [];
  public salesOverviewPartial!: ISalesOverViewPartialPageData;
  public allActivities: IACTIVITIES_BY_ID = {
    progress: 0,
    query: [],
  };
  public truncActivities: IACTIVITIES_BY_ID = {
    progress: 0,
    query: [],
  };
  public avatarBackground = ['#AF2A95', '#518EF8', '#FFAC33'];

  public Phases = PhasesEnum;
  public PhaseStatus = PhaseStatusEnum;
  public currentPhase: any = {};
  public viewPaymentPlanSchedule: boolean = false;

  public applicationPhaseLoading$: Observable<boolean> = this.store
    .select(ApplicationPhaseSelectors.phasesLoadingSelector)
    .pipe(shareReplay());

  public applicationPhaseError$: Observable<string | null> = this.store.select(
    ApplicationPhaseSelectors.phasesErrorSelector
  );

  applicationPhases$!: Observable<any>;
  public notes$: Observable<any> = this.store
    .select(NoteSelectors.noteSuccessSelector)
    .pipe(
      map((notes: any) =>
        [...notes]
          .sort(
            (a: any, b: any) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          )
          ?.slice(0, 5)
      )
    );

  public salesAnalytics$: Observable<any> = this.store
    .select(saleSelectors.getSaleStatistics)
    .pipe(shareReplay());

  private subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    public permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.getSalesAnalytics();
    this.getApplicationPhase();
    this.getTasks();
    this.getMeetings();
    this.getUsers();
    this.getAssignedOfficers();
    this.getActivities();

    this.store.dispatch(NoteActions.loadNotes());
  }

  assignedOfficers: IASSIGNED_OFFICERS[] = [];

  get getCurrentPhase() {
    return this.currentPhase;
  }

  getActivities(): void {
    this.store.dispatch(
      SalesActions.GetActivitiesByApplicationId({
        payload: { id: this.applicationId },
      })
    );

    this.subscription.add(
      this.store
        .select(saleSelectors.getActivities)
        .subscribe((resData: IACTIVITIES_BY_ID | null) => {
          if (resData) {
            this.allActivities = resData;
            if (resData?.query?.length >= 4) {
              this.truncActivities.progress = resData.progress;
              this.truncActivities.query = resData.query.slice(3);
              return;
            }

            this.truncActivities.progress = resData.progress;
            this.truncActivities.query = resData.query;
          }
        })
    );
  }

  getApplicationPhase() {
    this.store.dispatch(
      ApplicationPhaseActions.loadApplicationPhases({
        applicationId: this.applicationId,
      })
    );

    this.applicationPhases$ = this.store
      .select(ApplicationPhaseSelectors.phasesSuccessSelector)
      .pipe(
        map((phases: any[]) => {
          const phasesOrdered = [...phases]
            .sort((a, b) => a.phaseId - b.phaseId)
            .map((phase: any, phaseIndex: number) => ({
              ...phase,
              phase:
                phaseIndex === 0
                  ? PhasesEnum.ONBOARDING
                  : phaseIndex === 1
                  ? PhasesEnum.DOCUMENT_COLLATION
                  : phaseIndex === 2
                  ? PhasesEnum.DOCUMENT_PROCESSING
                  : phaseIndex === 3
                  ? PhasesEnum.DOCUMENT_SUPPORT
                  : phaseIndex === 4
                  ? PhasesEnum.DOCUMENT_AUDIT
                  : null,
            }));

          for (let i = 0; i < phasesOrdered.length; i++) {
            if (
              (phasesOrdered[i].serialNo === 1 ||
                phasesOrdered[i].phase === PhasesEnum.ONBOARDING) &&
              phasesOrdered[i].phaseStatus !== 3
            ) {
              this.currentPhase = phasesOrdered[i];
              break;
            }

            if (
              (phasesOrdered[i].serialNo === 2 ||
                phasesOrdered[i].phase === PhasesEnum.DOCUMENT_COLLATION) &&
              phasesOrdered[i].phaseStatus !== 3
            ) {
              this.currentPhase = phasesOrdered[i];
              break;
            }

            if (
              (phasesOrdered[i].serialNo === 3 ||
                phasesOrdered[i].phase === PhasesEnum.DOCUMENT_PROCESSING) &&
              phasesOrdered[i].phaseStatus !== 3
            ) {
              this.currentPhase = phasesOrdered[i];
              break;
            }

            if (
              (phasesOrdered[i].serialNo === 4 ||
                phasesOrdered[i].phase === PhasesEnum.DOCUMENT_SUPPORT) &&
              phasesOrdered[i].phaseStatus !== 3
            ) {
              this.currentPhase = phasesOrdered[i];
              break;
            }

            if (
              (phasesOrdered[i].serialNo === 5 ||
                phasesOrdered[i].phase === PhasesEnum.DOCUMENT_AUDIT) &&
              phasesOrdered[i].phaseStatus !== 3
            ) {
              this.currentPhase = phasesOrdered[i];
              break;
            }
          }

          return phasesOrdered;
        })
      );
  }

  getSalesAnalytics() {
    this.store.dispatch(
      SalesActions.GetSaleOverviewStatistics({
        applicationQuoteId: this.applicantQuoteId,
      })
    );
  }

  updatePhase(
    subPhase: ApplicationPhases,
    description: string,
    serialNo: number
  ) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));

    const { id } = this.currentPhase;
    this.store.dispatch(
      ApplicationPhaseActions.updateApplicationPhase({
        applicationId: this.applicationId,
        applicationPhaseId: id,
        subPhase,
        description,
        serialNo,
      })
    );
  }

  setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  triggerPhaseAction(phase: PhasesEnum) {
    let subPhase = this.currentPhase.subPhase as ApplicationPhases;
    const currentApplicationId = this.currentPhase.id;

    if (phase === PhasesEnum.ONBOARDING) {
      if (!subPhase) subPhase = 'assign-cma';

      switch (subPhase) {
        case 'assign-cma':
          this.assignCMA();
          break;
        case 'start-onboarding':
          this.startOnboarding(currentApplicationId);
          break;
        case 'call-applicant':
          this.callApplicant();
          break;
        case 'schedule-onboarding-meeting':
          this.scheduleOnboardingMeeting();
          break;
        case 'complete-onboarding':
          this.completeOnboarding(currentApplicationId);
          break;
      }
    }

    if (phase === PhasesEnum.DOCUMENT_COLLATION) {
      if (!subPhase) subPhase = 'start-document-collation';

      switch (subPhase) {
        case 'start-document-collation':
          this.startDocumentCollation(currentApplicationId);
          break;
        case 'complete-document-collation':
          this.completeDocumentCollation(currentApplicationId);
          break;
      }
    }

    if (phase === PhasesEnum.DOCUMENT_PROCESSING) {
      if (!subPhase) subPhase = 'start-document-processing';

      switch (subPhase) {
        case 'start-document-processing':
          this.startDocumentProcessing(currentApplicationId);
          break;
        case 'complete-document-processing':
          this.completeDocumentProcessing(currentApplicationId);
          break;
      }
    }

    if (phase === PhasesEnum.DOCUMENT_SUPPORT) {
      if (!subPhase) subPhase = 'start-document-support';

      switch (subPhase) {
        case 'start-document-support':
          this.startDocumentSupport(currentApplicationId);
          break;
        case 'complete-document-support':
          this.completeDocumentSupport(currentApplicationId);
          break;
      }
    }

    if (phase === PhasesEnum.DOCUMENT_AUDIT) {
      if (!subPhase) subPhase = 'start-document-audit';

      switch (subPhase) {
        case 'start-document-audit':
          this.startDocumentAudit(currentApplicationId);
          break;
        case 'complete-document-audit':
          this.completeDocumentAudit(currentApplicationId);
          break;
      }
    }
  }

  // Onboarding Actions
  assignCMA() {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(ApplicationPhaseActions.assignSM());

    this.store.dispatch(
      ApplicationPhaseActions.assignSMOfficer({
        applicationId: this.applicationId,
      })
    );

    this.store.select(ApplicationPhaseSelectors.assignCMASelector).subscribe({
      next: (value: boolean) => {
        if (!value) {
          this.updateOnboardingPhase(
            'start-onboarding',
            'To start document onboarding operation'
          );
        }
      },
    });
  }

  startOnboarding(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(ApplicationPhaseActions.startOnboarding());

    this.store.dispatch(
      ApplicationPhaseActions.startApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(ApplicationPhaseSelectors.startOnboardingSelector)
      .subscribe({
        next: (value: boolean) => {
          if (!value) {
            this.store.dispatch(
              GeneralLoaderActions.IsLoading({ payload: true })
            );
            this.store.dispatch(ApplicationPhaseActions.assignOthers());

            this.store.dispatch(
              ApplicationPhaseActions.assignOtherOfficer({
                applicationId: this.applicationId,
              })
            );

            this.store
              .select(ApplicationPhaseSelectors.assignOthersSelector)
              .subscribe({
                next: (value: boolean) => {
                  if (!value) {
                    this.updateOnboardingPhase(
                      'call-applicant',
                      'To call applicant for onboarding operation'
                    );

                    this.getAssignedOfficers();
                  }
                },
              });
          }
        },
      });
  }

  callApplicant() {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(ApplicationPhaseActions.callApplicant());

    this.store.dispatch(
      ApplicationPhaseActions.callApplicantTask({
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(ApplicationPhaseSelectors.callApplicantSelector)
      .subscribe({
        next: (value: boolean) => {
          if (!value) {
            this.updateOnboardingPhase(
              'schedule-onboarding-meeting',
              'To schedule onboarding meetings for onboarding operation'
            );

            this.getTasks();
          }
        },
      });
  }

  scheduleOnboardingMeeting() {
    const meetingPhase = this.getLocalStorage('meetingPhase');

    switch (meetingPhase) {
      case 'SM Meeting':
        this.createDMSMeeting();
        break;
      case 'Doctors Meeting':
        this.createDoctorsMeeting();
        break;
      case 'Photographers Meeting':
        this.createPhotographersMeeting();
        break;

      default:
        this.createDMSMeeting();
        break;
    }
  }

  createDMSMeeting() {
    const meetingModal = this.dialog.open(OnboardingMeetingModalComponent, {
      data: {
        applicationId: this.applicationId,
        // title: 'DMS Meeting Details',
        title: 'SM Meeting Details',
        // guestLabel: 'DMS and other guest',
        guestLabel: 'SM and other guest',
        officer: this.assignedOfficers.filter(
          (officer) => officer.role === 'DMS'
        )?.[0],
      },
      disableClose: true,
      width: '550px',
    });

    this.subscription.add(
      meetingModal
        .afterClosed()
        .subscribe((result: { success: boolean; formValues: any }) => {
          if (result && result.success) {
            const { title, startDate } = result.formValues;
            this.createTask(this.applicantId, title, startDate);
            this.getMeetings();
            this.createDoctorsMeeting();
          }
        })
    );
  }

  createDoctorsMeeting() {
    this.setLocalStorage('meetingPhase', 'Doctors Meeting');
    const meetingModal = this.dialog.open(OnboardingMeetingModalComponent, {
      data: {
        applicationId: this.applicationId,
        title: 'Doctor Meeting Details',
        guestLabel: 'Doctor and Other Guests',
      },
      disableClose: true,
      width: '550px',
    });

    this.subscription.add(
      meetingModal
        .afterClosed()
        .subscribe((result: { success: boolean; formValues: any }) => {
          if (result && result.success) {
            const { title, startDate } = result.formValues;
            this.createTask(this.applicantId, title, startDate);
            this.getMeetings();
            this.createPhotographersMeeting();
          }
        })
    );
  }

  createPhotographersMeeting() {
    this.setLocalStorage('meetingPhase', 'Photographers Meeting');
    const meetingModal = this.dialog.open(OnboardingMeetingModalComponent, {
      data: {
        applicationId: this.applicationId,
        title: 'Photographer Meeting Details',
        guestLabel: 'Photographer and Other Guests',
      },
      disableClose: true,
      width: '550px',
    });

    this.subscription.add(
      meetingModal
        .afterClosed()
        .subscribe((result: { success: boolean; formValues: any }) => {
          if (result && result.success) {
            const { title, startDate } = result.formValues;
            this.createTask(this.applicantId, title, startDate);
            this.getMeetings();
            this.updateOnboardingPhase(
              'complete-onboarding',
              'To complete onboarding operation'
            );
            this.removeLocalStorage('meetingPhase');
          }
        })
    );
  }

  completeOnboarding(id: number) {
    this.store.dispatch(
      ApplicationPhaseActions.completeApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );
  }

  updateOnboardingPhase(nextPhase: ApplicationPhases, description: string) {
    this.updatePhase(nextPhase, description, 1);
  }

  // Document Collation Actions
  startDocumentCollation(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(ApplicationPhaseActions.startCollation());

    this.store.dispatch(
      ApplicationPhaseActions.startApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(ApplicationPhaseSelectors.startCollationSelector)
      .subscribe({
        next: (value: boolean) => {
          if (!value) {
            this.updateDocumentCollationPhase(
              'complete-document-collation',
              'To complete document collation operation'
            );
            this.routeTo(1, PhasesEnum.DOCUMENT_COLLATION);
          }
        },
      });
  }

  completeDocumentCollation(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicationPhaseActions.completeApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );
  }

  updateDocumentCollationPhase(
    nextPhase: ApplicationPhases,
    description: string
  ) {
    this.updatePhase(nextPhase, description, 2);
  }

  // Document Processing Actions
  startDocumentProcessing(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(ApplicationPhaseActions.startProcessing());
    this.store.dispatch(
      ApplicationPhaseActions.startApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(ApplicationPhaseSelectors.startProcessingSelector)
      .subscribe({
        next: (value: boolean) => {
          if (!value) {
            this.updateDocumentProcessingPhase(
              'complete-document-processing',
              'To complete document processing operation'
            );

            this.routeTo(1, PhasesEnum.DOCUMENT_PROCESSING);
          }
        },
      });
  }

  completeDocumentProcessing(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicationPhaseActions.completeApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );
  }

  updateDocumentProcessingPhase(
    nextPhase: ApplicationPhases,
    description: string
  ) {
    this.updatePhase(nextPhase, description, 3);
  }

  // Document Support Actions
  startDocumentSupport(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(ApplicationPhaseActions.startSupport());

    this.store.dispatch(
      ApplicationPhaseActions.startApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(ApplicationPhaseSelectors.startSupportSelector)
      .subscribe({
        next: (value: boolean) => {
          if (!value) {
            this.updateDocumentSupportPhase(
              'complete-document-support',
              'To complete document support operation'
            );

            this.routeTo(1, PhasesEnum.DOCUMENT_SUPPORT);
          }
        },
      });
  }

  completeDocumentSupport(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicationPhaseActions.completeApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );
  }

  updateDocumentSupportPhase(
    nextPhase: ApplicationPhases,
    description: string
  ) {
    this.updatePhase(nextPhase, description, 4);
  }

  // Document Audit Actions
  startDocumentAudit(id: number) {
    const dialog = this.dialog.open(ConfirmationModalComponent, {
      data: {
        iconType: 'warning',
        title: 'Are the documents complete?',
        subTitle:
          'Ensure to check that all expected documents are available in the documents folder',
      },
      width: '450px',
      height: '280px',
      position: {
        top: '25px',
      },
    });

    dialog.afterClosed().subscribe({
      next: (value: boolean) => {
        if (value) {
          this.store.dispatch(
            GeneralLoaderActions.IsLoading({ payload: true })
          );
          this.store.dispatch(ApplicationPhaseActions.startAudit());

          this.store.dispatch(
            ApplicationPhaseActions.startApplicationPhase({
              id,
              applicationId: this.applicationId,
            })
          );

          this.store
            .select(ApplicationPhaseSelectors.startAuditSelector)
            .subscribe({
              next: (value: boolean) => {
                if (!value) {
                  this.updateDocumentAuditPhase(
                    'complete-document-audit',
                    'Complete document audit phase'
                  );
                }
              },
            });
        } else this.daoAssignToCMA();
      },
    });
  }

  completeDocumentAudit(id: number) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicationPhaseActions.completeApplicationPhase({
        id,
        applicationId: this.applicationId,
      })
    );
  }

  daoAssignToCMA() {
    const dialog = this.dialog.open(DaoAssignToCmaComponent, {
      width: '600px',
      height: '300px',
      position: {
        top: '25px',
      },
    });

    dialog.afterClosed().subscribe({
      next: (reason: string) => {},
    });
  }

  updateDocumentAuditPhase(nextPhase: ApplicationPhases, description: string) {
    this.updatePhase(nextPhase, description, 5);
  }

  getSaleOverview() {
    this.store.dispatch(
      SalesActions.GetSaleOverview({
        payload: {
          applicationId: this.applicationId,
        },
      })
    );
  }

  /** By partial we imply the data gotten by merge several api call responses **/
  getSalesOverviewPartial() {
    this.store.select(saleSelectors.getSalesOverviewPartial).subscribe({
      next: (data) => {
        if (data) {
          this.salesOverviewPartial = data;
        }
      },
    });
  }

  getUsers() {
    this.store.dispatch(
      usersActions.GetActiveUsers({ payload: { skip: 0, take: 0 } })
    );

    this.subscription.add(
      this.store.select(usersSelections.getActiveUsers).subscribe((resData) => {
        if (resData) {
          this.users = resData;
        }
        // this.filterUsers();
      })
    );
  }

  getAssignedOfficers() {
    this.store.dispatch(
      DocumentCollectionActions.getDocumentOfficers({
        applicationId: this.applicationId,
      })
    );

    this.subscription.add(
      this.store
        .select(DocumentCollectionSelector.documentOfficersSelector)
        .subscribe((data) => {
          if (data) {
            this.assignedOfficers = data;
          }
        })
    );
  }

  linkToCreateInvoice() {
    if (this.applicantQuoteId)
      this.router.navigate([
        `app/calculator/quote/quote-invoice/${this.applicantQuoteId}/create`,
      ]);
    return;
  }

  linkToViewInvoice() {
    if (this.applicantQuoteId)
      this.router.navigate([
        `/app/calculator/quote/quote-invoice/${this.applicantQuoteId}/view`,
      ]);
    return;
  }

  createCallApplicantTask() {
    this.dialog.open(AddTaskComponent, {
      data: {
        applicationId: this.applicationId,
        users: this.users,
        title: 'Call Applicant Task',
      },
    });
  }

  confirmCompletion(title: string, subTitle: string) {
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        title,
        subTitle,
      },
      width: '450px',
      height: '280px',
      position: {
        top: '25px',
      },
    });
  }

  getTasks() {
    this.store.dispatch(
      SalesActions.GetAllActiveTask({
        payload: {
          applicationId: this.applicationId,
        },
      })
    );

    this.subscription.add(
      this.store.select(saleSelectors.getActiveTasks).subscribe((resData) => {
        if (resData) {
          this.tasks = resData;
        }
      })
    );
  }

  getMeetings() {
    this.store.dispatch(
      SalesActions.GetAllMeetingsByApplicationId({
        payload: {
          applicationId: this.applicationId,
        },
      })
    );

    this.subscription.add(
      this.store
        .select(saleSelectors.getMeetings)
        .subscribe((resData: any[]) => {
          if (resData) {
            this.meetings = resData;
          }
        })
    );
  }

  completeTask(id: number) {
    this.store.dispatch(
      SalesActions.MarkTaskAsDone({
        payload: {
          id: id,
          applicationId: this.applicationId,
        },
      })
    );
  }

  createTask(
    applicationId: number,
    title: string = '',
    startDate: string = ''
  ) {
    this.store.dispatch(
      GeneralActions.IsLoading({
        payload: true,
      })
    );

    if (this.users.length > 0) {
      const assignedToUserId = this.users[0].userId
        ? this.users[0].userId
        : null;
      const payload = {
        applicationId,
        title,
        dueDate: startDate,
        assignedTo: assignedToUserId,
        closeOnSuccess: false,
      };

      this.store.dispatch(
        SaleServiceActions.AddTask({
          payload,
        })
      );
    }
  }

  openCreateMeetingModal(meeting?: Meeting, formMode: string = 'create') {
    const meetingModal = this.dialog.open(CreateMeetingModalComponent, {
      data: {
        applicationId: this.applicationId,
        users: this.users,
        meeting: meeting,
        formMode: formMode,
      },
      disableClose: true,
      width: '33.875rem',
    });

    this.subscription.add(
      meetingModal.afterClosed().subscribe(() => {
        this.getMeetings();
      })
    );
  }

  cancelMeeting(id: number) {
    this.store.dispatch(
      SalesActions.CancelMeeting({
        payload: {
          meetingId: id,
        },
      })
    );
  }

  addTaskModal() {
    this.dialog.open(AddTaskComponent, {
      data: {
        applicationId: this.applicationId,
        users: this.users,
      },
      disableClose: true,
    });
  }

  editTaskModal(task: any) {
    this.dialog.open(EditTaskComponent, {
      data: {
        task: task,
        users: this.users,
        applicationId: this.applicationId,
      },
      disableClose: true,
    });
  }

  cancelTaskModal(id: number) {
    this.dialog.open(CancelTaskComponent, {
      data: {
        id: id,
        applicationId: this.applicationId,
      },
      disableClose: true,
    });
  }

  openAssignOfficerModal(
    officerType: OfficerType,
    mainOfficer: IMAIN_OFFICER[],
    supportOfficer: ISUPPORTING_OFFICER[]
  ) {
    this.dialog.open(AssignOfficerModalComponent, {
      data: {
        officerType,
        id: mainOfficer[0].id,
        applicantId: this.applicationId,
        userId: this.applicantId,
        mainOfficer,
        supportOfficer,
      },
    });
  }

  viewTask(task: any) {
    this.dialog.open(ViewTaskComponent, {
      data: task,
      disableClose: true,
    });
  }

  routeTo(tabIndex: number, extras?: PhasesEnum | undefined) {
    this.routeTabs.emit({ tabIndex, extras, id: this.applicationId });
  }

  resolveStartEndDate(application: any) {
    return `
      Date Started: ${this.datePipe.transform(
        application.createdDate,
        'd/M/yy'
      )}
      Date Completed: ${this.datePipe.transform(
        application.lastModifiedDate,
        'd/M/yy'
      )}
    `;
  }

  viewApplicantDetails(applicantId: number) {
    this.router.navigate([`app/applicants/applicants-info/${applicantId}`]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
