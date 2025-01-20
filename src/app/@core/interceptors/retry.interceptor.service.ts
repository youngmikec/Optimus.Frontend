import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, timer, throwError, of } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RetryInterceptorService implements HttpInterceptor {
  retryDelay = 2000;
  retryMaxAttempts = 5;

  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(this.retryAfterDelay());
  }

  retryAfterDelay(): any {
    return retryWhen((errors) => {
      return errors.pipe(
        mergeMap((err, count) => {
          // throw error when we've retried ${retryMaxAttempts} number of times and still get an error
          if (count === this.retryMaxAttempts) {
            // const notification: Notification = {
            //   state: 'error',
            //   title: 'System Notification',
            //   message: `Network request failed`,
            // };

            // this.notificationService.openSnackBar(
            //   notification,
            //   'opt-notification-error'
            // );

            return throwError(err);
          }
          return of(err).pipe(
            // tap((error) =>
            //   console.log(`Retrying ${error.url}. Retry count ${count + 1}`)
            // ),
            mergeMap(() => timer(this.retryDelay))
          );
        })
      );
    });
  }
}
