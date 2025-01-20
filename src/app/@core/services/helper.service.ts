import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthAction from 'src/app/@core/stores/auth/auth.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class HelperService implements OnDestroy {
  getDeveloperTokenStatusSub!: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  manageDeveloperTokenAndCallFunction(customFunction: Function) {
    const optivaAuthData: {
      bearer_token: string;
      expiryDate: number;
    } = JSON.parse(localStorage.getItem('Optiva_auth')!);

    if (
      optivaAuthData === null ||
      optivaAuthData.expiryDate < new Date().getTime()
    ) {
      this.store.dispatch(AuthAction.InitializeApp_DeveloperToken());

      this.getDeveloperTokenStatusSub = this.store
        .pipe(select(authSelectors.getDeveloperTokenStatus))
        .subscribe((status): any => {
          if (status && status === true) {
            customFunction();
          }
        });
    } else {
      customFunction();
    }
  }

  ngOnDestroy(): void {
    if (this.getDeveloperTokenStatusSub) {
      this.getDeveloperTokenStatusSub.unsubscribe();
    }
  }
}
