import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class FamilyMembersService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  GetAllFamilyMembersByCountryId(countryId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const userId = user.UserId;
        return this.http.get<any>(
          `${this.optivaImmigrationUrl}/FamilyMembers/getfamilymembersbycountry/${userId}/${countryId}`
        );
      })
    );
  }

  getFamilyMembersByApplicationId(applicationId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        return this.http.get<any>(
          `${this.optivaImmigrationUrl}/FamilyMembers/getfamilymembersbyapplicationid/${user.UserId}/${applicationId}`
        );
      })
    );
  }
}
