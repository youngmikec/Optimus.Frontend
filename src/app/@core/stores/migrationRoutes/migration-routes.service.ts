import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MigrationRouteService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(
    private store: Store<fromApp.AppState>,
    private http: HttpClient
  ) {}

  getActiveMigrationRouteByCountryId(countryId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const userId = user.UserId;
        return this.http.get<any>(
          `${this.optivaImmigrationUrl}/MigrationRoutes/getactivemigrationroutes/${userId}/${countryId}`
        );
      })
    );
  }
}
