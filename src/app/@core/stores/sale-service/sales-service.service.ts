import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { Guest } from '../../interfaces/meetingGuest.interface';

export interface OnboardingMeetingEnum {
  applicationId: string;
  title: string;
  startDate: string;
  location: string;
  meetingGuestRequests: Guest[];
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private optivaAfterSalesUrl = environment.OptivaAfterSalesUrl;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  createOnBoardingMeetings(payload: OnboardingMeetingEnum) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const formData = new FormData();
        formData.append('UserId', user.UserId);
        formData.append('Title', payload.title);
        formData.append('ApplicationId', payload.applicationId);
        formData.append('EndDate', payload.startDate);
        formData.append('StartDate', payload.startDate);
        formData.append('Location', payload.location);
        formData.append(
          'MeetingGuestRequests',
          JSON.stringify(payload.meetingGuestRequests)
        );
        if (payload.message) {
          formData.append('message', payload.message);
        }

        return this.http.post(
          `${this.optivaAfterSalesUrl}/meeting/createmeeting`,
          formData
        );
      })
    );
  }
}
