import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchFilterService implements OnDestroy {
  searchValue!: string;
  searchParam!: string;
  searchSubject = new BehaviorSubject<string | null>(null);
  private subscription: Subscription = new Subscription();
  filterResult: any[] = [
    { name: 'name', column: 'Name', selected: false },
    { name: 'email', column: 'Email address', selected: false },
  ];

  constructor(private activatedRoute: ActivatedRoute) {}

  listenToActivatedRouteSubscription() {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        if (params?.['filter']) {
          this.filterResult = this.filterResult.map((el) => {
            if (params?.['filter']?.includes(el.name)) {
              el.selected = true;
            } else {
              el.selected = false;
            }

            return el;
          });
        }
      })
    );

    if (sessionStorage.getItem('search')) {
      // this.searchParam = sessionStorage.getItem('search') || '';
    }
  }

  listenToSearchSubject() {
    this.subscription.add(
      this.searchSubject.pipe(debounceTime(500)).subscribe((resData) => {
        if (resData !== null) {
          this.search(resData);
        }
      })
    );
  }

  onSearch(searchInputParam: string) {
    if (searchInputParam !== ' ') {
      this.searchSubject.next(searchInputParam);
    }
  }

  getSearchParams() {
    return this.searchParam || null;
  }

  search(searchValue: string) {
    sessionStorage.setItem('search', searchValue);
    // this.router.navigate([], {
    //   queryParams: {
    //     search: searchValue ? searchValue : undefined,
    //   },
    //   queryParamsHandling: 'merge',
    // });
  }

  onClickFilterOption() {
    // const filterParams = this.filterResult
    //   .filter((el) => {
    //     if (el.selected === true) {
    //       return el.name;
    //     }
    //   })
    //   .map((el) => {
    //     return el.name;
    //   });
    // this.router.navigate([], {
    //   queryParams: {
    //     filter:
    //       filterParams.length > 0 ? JSON.stringify(filterParams) : undefined,
    //   },
    //   queryParamsHandling: 'merge',
    // });
  }

  clearFilterSelection() {
    this.filterResult = this.filterResult.map((el) => {
      return {
        ...el,
        selected: false,
      };
    });

    this.onClickFilterOption();
  }

  ngOnDestroy(): void {
    sessionStorage.setItem('search', '');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
