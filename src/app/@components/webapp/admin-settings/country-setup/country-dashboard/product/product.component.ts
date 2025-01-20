import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import * as ProductsActions from 'src/app/@core/stores/product/product.actions';
import * as ProdutsSelector from 'src/app/@core/stores/product/product.selector';
import * as ProductCategoryActions from 'src/app/@core/stores/productCategory/productCategory.actions';
import * as ProdutCategorySelector from 'src/app/@core/stores/productCategory/productCategory.selector';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Subscription } from 'rxjs';
import { CreateProductComponent } from './create-product/create-product.component';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';

export interface ProductData {
  countryId?: number;
  id?: number;
  name: string;
  description: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'country',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];

  dataSource: MatTableDataSource<ProductData[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  productCategoryList: any[] = [];

  totalRecords = 10;
  getAllProductSub!: Subscription;
  getAllProductCategorySub!: Subscription;
  readonly editRoute: string = 'edit';
  permissions: boolean[] = [];
  searchInputParam!: any | null;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  allCurrencyList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Product');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllProduct();
  }

  ngAfterViewInit(): void {
    this.getAllProductCategoryByCountryId();
  }

  getAllProducts() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');

    this.store.dispatch(
      ProductsActions.GetAllProductsByCountryId({
        payload: { id: countryId },
      })
    );
  }

  getAllProductCategoryByCountryId() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');

    this.store.dispatch(
      ProductCategoryActions.GetAllProductCategoryByCountryId({
        payload: { id: countryId },
      })
    );

    this.getAllProductCategorySub = this.store
      .pipe(select(ProdutCategorySelector.getAllProductCategoryByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          this.productCategoryList = resData;
        }
      });
  }

  manageAllProduct() {
    this.getAllProducts();

    this.getAllProductSub = this.store
      .pipe(select(ProdutsSelector.getAllProductByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedList: any[] = [];

          resData?.forEach((data: any) => {
            const modifiedData = {
              ...data,
              createdDate: new Date(data.createdDate).getTime(),
              lastModifiedDate: new Date(data.lastModifiedDate).getTime(),
            };

            modifiedList.push(modifiedData);
          });

          const sortedRoles = modifiedList.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedRoles);

          this.searchInputParam = this.searchFilterService.getSearchParams();
          this.onInputSearch();

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.count!;
          });
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource!.data);
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    // const skip = pageIndex * pageSize;
    // const take = pageIndex > 0 ? (pageIndex + 1) * pageSize : pageSize;
    // this.store.dispatch(
    //   CurrencyActions.GetAllRole({
    //     payload: { skip, take, searchValue: '', filter: [] },
    //   })
    // );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  onInputSearch() {
    if (this.searchInputParam !== null) {
      this.searchFilterService.onSearch(this.searchInputParam);
      this.search(this.searchInputParam);
    }
  }

  search(input: string) {
    this.dataSource!.filter = input?.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }

    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const name = data.name.toLowerCase();
        return name.includes(filter);
      };
    }
  }

  onChangeRoleStatus(event: any, id: number) {
    this.store.dispatch(ProductsActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        ProductsActions.ActivateProducts({
          payload: { id: id },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        ProductsActions.DeactivateProducts({
          payload: { id: id },
        })
      );
    }
  }

  openAddOrEditProduct(type: string, editData: any) {
    this.dialog.open(CreateProductComponent, {
      data: {
        type,
        editData,
        productCategoryList: this.productCategoryList,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllProductSub) {
      this.getAllProductSub;
    }
  }
}
