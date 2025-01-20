import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddEditFeatureComponent } from './add-edit-feature/add-edit-feature.component';
import { AddEditPermissionComponent } from './add-edit-permission/add-edit-permission.component';

import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as FeaturesActions from 'src/app/@core/stores/features/features.actions';
import * as featuresSelectors from 'src/app/@core/stores/features/features.selectors';
// import { CreateFeatureComponent } from './create-feature/create-feature.component';
// import { CreatePermissionComponent } from './create-permission/create-permission.component';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit, OnDestroy {
  selectedFeature: number = 0;
  featureName: string = '';
  features!: any[];
  selectedFeatures!: any[];
  permissions!: any[];
  masterChecked: boolean = false;
  masterIndeterminate: boolean = false;
  object = Object.values;
  isLoading!: Observable<boolean>;
  getAllFeaturesSub!: Subscription;

  canCreateFeature = false;
  canEditFeatures = false;
  canActivateFeatures = false;
  permissions1: boolean[] = [];

  @ViewChild('featureList', { static: false }) featureList!: ElementRef;

  searchInputParam!: string | null;

  constructor(
    private dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions1 =
        this.permissionService.getPermissionStatuses('Features');

      if (this.permissions1[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    // this.searchInputParam = this.searchFilterService.getSearchParams();

    this.isLoading = this.store.pipe(
      select(featuresSelectors.getFeaturesIsLoading)
    );

    this.getAllFeatures();

    this.store
      .pipe(select(authSelectors.getUserPermissions))
      .subscribe((permissions: any) => {
        if (permissions) {
          this.canCreateFeature = permissions.includes('Create Features');
          this.canEditFeatures = permissions.includes('Edit Features');
          this.canActivateFeatures = permissions.includes(
            'Activate/ Deactivate Features'
          );
        }
      });
  }

  onInputSearch() {
    if (this.searchInputParam !== null) {
      this.searchFilterService.onSearch(this.searchInputParam);
      this.search(this.searchInputParam);
    }
  }

  search(input: string) {
    this.selectedFeatures = this.features.filter((item: any) =>
      item.name.toLowerCase().includes(input?.toLowerCase())
    );
  }

  getAllFeatures() {
    this.store.dispatch(FeaturesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      FeaturesActions.GetAllFeatures({
        payload: {
          skip: 0,
          take: 0,
        },
      })
    );

    this.getAllFeaturesSub = this.store
      .pipe(select(featuresSelectors.getAllFeatures))
      .subscribe((res: any) => {
        if (res !== null) {
          this.features = this.mapData(res.entities);
          this.loadSelectedFeaturePermission(this.features[0], 0);

          this.searchInputParam = this.searchFilterService.getSearchParams();
          this.onInputSearch();
        }
      });
  }

  loadSelectedFeaturePermission(feature: any, i: number) {
    this.featureName = feature?.name;
    this.permissions = feature?.children;
    this.selectedFeature = i;
    // console.log(this.permissions);
    // this.updatePermissionCheckList(feature);
  }

  updatePermissionCheckList(permission: any) {
    const checkedCount = 0;

    // this.permissions.forEach((permission: any) => {
    //   if (permission.isChecked === true) {
    //     checkedCount++;
    //     permission.status = 1;
    //   } else {
    //     permission.status = 2;
    //   }
    // });

    this.features.forEach((featureEl) => {
      if (featureEl.parentName === permission.parentName) {
        featureEl.checkedCount = checkedCount;
      }
    });

    if (checkedCount > 0 && checkedCount < this.permissions.length) {
      this.masterIndeterminate = true;
    } else if (checkedCount == this.permissions.length) {
      this.masterIndeterminate = false;
      this.masterChecked = true;
    } else {
      this.masterIndeterminate = false;
      this.masterChecked = false;
    }
  }

  mapData(allFeatures: any): any {
    const modifiedFeatures: any = {};
    //console.log(allFeatures);
    allFeatures.forEach((feature: any, index: number) => {
      if (feature.parentFeatureId === null || feature.parentFeatureId === 0) {
        modifiedFeatures[feature.name] = {
          ...feature,
          checkedCount: 0,
          children: [],
        };
      }
    });

    const children: any[] = allFeatures.filter(
      (feature: any) =>
        feature.parentFeatureId !== null || feature.parentFeatureId === 0
    );

    children.forEach((child: any) => {
      if (modifiedFeatures[child.parentFeatureName]) {
        modifiedFeatures[child.parentFeatureName]['children'] = [
          ...modifiedFeatures[child.parentFeatureName]['children'],
          {
            ...child,
            isChecked: false,
          },
        ];
      }
    });

    return this.object(modifiedFeatures);
  }

  openAddOrEditfeature(type: string, feature: any) {
    this.dialog.open(AddEditFeatureComponent, {
      data: { feature, type },
      disableClose: true,
      autoFocus: true,
      // panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  openAddOrEditPermission(type: string, permission: any) {
    this.dialog.open(AddEditPermissionComponent, {
      data: { features: this.features, type, permission },
      disableClose: true,
      autoFocus: true,
      // panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  // openDeleteFeature(feature: any) {
  //   this.dialog.open(DeleteFeatureComponent, {
  //     data: { feature },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  // openDeletePermission(permission: any) {
  //   this.dialog.open(DeletePermissionComponent, {
  //     data: { permission },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  showMoreFeatureOption() {
    if (this.featureList.nativeElement.classList.contains('list-group-item')) {
      this.featureList.nativeElement.classList.add('feature-show-more');
    }
  }

  removeShowMore = () => {
    if (
      this.featureList.nativeElement.classList.contains('feature-show-more')
    ) {
      this.featureList.nativeElement.classList.remove('feature-show-more');
    }
  };

  ToggleFeatureOrPermission(data: any) {
    this.store.dispatch(
      FeaturesActions.ToggleFeatureStatus({
        payload: {
          featureId: data.id,
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.getAllFeaturesSub) {
      this.getAllFeaturesSub.unsubscribe();
    }
  }
}
