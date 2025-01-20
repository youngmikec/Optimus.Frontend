import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { SidebarService } from 'src/app/@core/services/sidebar.service';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { Subscription } from 'rxjs';
// import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { PermissionService } from 'src/app/@core/services/permission.service';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  toggleSidebarSub!: Subscription;
  openSidebarSub!: Subscription;
  closeSidebarSub!: Subscription;

  canViewDashboard: boolean = false;
  canViewApplicants: boolean = false;
  canViewCalculator: boolean = false;
  canViewSales: boolean = false;
  canViewInvoice: boolean = false;
  canViewLoans: boolean = false;
  canViewApprovalRequest: boolean = false;
  canViewAdminSettings: boolean = false;
  canViewDiscountRequest: boolean = false;

  @ViewChild('sidebar', { static: false }) sidebar!: ElementRef;

  constructor(
    private sidebarService: SidebarService,
    private renderer: Renderer2,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService, // private route: ActivatedRoute
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.listenToToggleSidebarSub();

    this.listenToOpenSidebarSub();

    this.listenToCloseSidebarSub();
    // Resize when width is less than or equals 992px
    // window.addEventListener('resize', () => {
    //   if (window.matchMedia('(max-width: 991.98px)').matches) {
    //     if (this.sidebar.nativeElement.classList.contains('collapsed')) {
    //       this.renderer.removeClass(this.sidebar.nativeElement, 'collapsed');
    //     }
    //   }
    // });

    // Close sidebar onclick outside for mobile
    window.addEventListener('mouseup', (event) => {
      if (window.innerWidth <= 992) {
        // if (event.target !== this.sidebar.nativeElement) {
        this.renderer.removeClass(this.sidebar.nativeElement, 'open');
        // }
      }
    });

    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.canViewDashboard =
        this.permissionService.getPermissionStatuses('Dashboard')[0];
      this.canViewApplicants =
        this.permissionService.getPermissionStatuses('Applicant')[0];
      this.canViewCalculator =
        this.permissionService.getPermissionStatuses('Quote Calculator')[0];
      this.canViewSales =
        this.permissionService.getPermissionStatuses('Sales Service')[0];
      this.canViewInvoice =
        this.permissionService.getPermissionStatuses('Invoices')[0];
      this.canViewLoans =
        this.permissionService.getPermissionStatuses('Loan')[0];
      this.canViewAdminSettings =
        this.permissionService.getPermissionStatuses('Admin Settings')[0];
      this.canViewApprovalRequest =
        this.permissionService.getPermissionStatuses('Approval Request')[0];
      this.canViewDiscountRequest =
        this.permissionService.getPermissionStatuses('Discount Request')[0];

      // if (this.canViewAdminSettings === false) {
      //   this.permissionService.routeToSpecifiedPath('/app/dashboard');
      // }
    });
  }

  listenToToggleSidebarSub() {
    this.toggleSidebarSub = this.sidebarService.toggleSidebar.subscribe(() => {
      if (
        (this.sidebar.nativeElement as HTMLElement).classList.contains('open')
      ) {
        this.sidebarService.closeSidebar.next(true);
      } else {
        this.sidebarService.openSidebar.next(true);
      }
    });
  }

  listenToOpenSidebarSub() {
    this.openSidebarSub = this.sidebarService.openSidebar.subscribe(() => {
      this.renderer.addClass(this.sidebar.nativeElement, 'open');
    });
  }

  listenToCloseSidebarSub() {
    this.closeSidebarSub = this.sidebarService.closeSidebar.subscribe(() => {
      this.renderer.removeClass(this.sidebar.nativeElement, 'open');
    });
  }

  toggleSidebar() {
    // console.log(this.route.snapshot); // for quote calculator to know
    // console.log(this.route);          // when it is in the route and close the sidebar

    // this.sidebarService.toggleSidebar.next(true);
    if (window.innerWidth <= 992) {
      // basically and or stateent with the iff
      this.renderer.removeClass(this.sidebar.nativeElement, 'open');
    } else {
      this.renderer.addClass(this.sidebar.nativeElement, 'half');
    }
  }

  toggleSidebar2() {
    // this.sidebarService.toggleSidebar.next(true);
    if (window.innerWidth <= 992) {
      this.renderer.removeClass(this.sidebar.nativeElement, 'open');
    } else {
      this.renderer.removeClass(this.sidebar.nativeElement, 'half');
    }
  }

  onLogOut() {
    const notification: Notification = {
      state: 'success',
      message: 'Logging you out.',
    };

    this.notificationService.openSnackBar(
      notification,
      'opt-notification-success'
    );

    this.store.dispatch(AuthActions.Logout());
  }

  ngOnDestroy(): void {
    if (this.toggleSidebarSub) {
      this.toggleSidebarSub.unsubscribe();
    }

    if (this.openSidebarSub) {
      this.openSidebarSub.unsubscribe();
    }

    if (this.closeSidebarSub) {
      this.closeSidebarSub.unsubscribe();
    }
  }
}
