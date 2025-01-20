import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateApplicationsComponent } from './create-applications/create-applications.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
})
export class ApplicantsComponent implements OnInit {
  permissions: boolean[] = [];
  searchInputParam!: any | null;

  constructor(
    private dialog: MatDialog,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit() {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Applicant');
    });
  }

  onInputSearch() {
    if (this.searchInputParam !== null) {
      this.searchFilterService.onSearch(this.searchInputParam);
    }
  }

  onCreateApplicant(instance: 'create' | 'update', applicantData?: any) {
    this.dialog.open(CreateApplicationsComponent, {
      data: {
        instance: instance,
        department: applicantData,
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
      panelClass: 'opt2-dialog',
    });
  }

  // search(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource!.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource!.paginator) {
  //     this.dataSource!.paginator.firstPage();
  //   }
  // }
}
