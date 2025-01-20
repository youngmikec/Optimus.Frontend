import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      request.url === `${environment.OptivaAuthUrl}/Authentication/login` ||
      request.url ===
        `${environment.OptivaAuthUrl}/Authentication/forgotpassword` ||
      request.url ===
        `${environment.OptivaAuthUrl}/Authentication/resetpassword` ||
      request.url === `${environment.OptivaAuthUrl}/Utility/getdevicetype` ||
      request.url.includes(
        `${environment.OptivaAuthUrl}/Utility/getdevicetype`
      ) ||
      request.url.includes(
        `${environment.OptivaAuthUrl}/Authentication/verifyuser`
      )
    ) {
      if (localStorage.getItem('Optiva_auth') !== null) {
        const OptivaAuthData: {
          expiryDate: number;
          bearer_token: string;
        } = JSON.parse(localStorage.getItem('Optiva_auth')!);

        const modifiedRequest = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${OptivaAuthData.bearer_token}`
          ),
        });

        return next.handle(modifiedRequest);
      } else {
        return next.handle(request); //Tentative
      }
    } else if (
      ((request.url !== `${environment.OptivaAuthUrl}/Authentication/login` ||
        request.url !==
          `${environment.OptivaAuthUrl}/Authentication/forgotpassword` ||
        request.url !==
          `${environment.OptivaAuthUrl}/Authentication/resetpassword` ||
        request.url !== `${environment.OptivaAuthUrl}/Utility/getdevicetype`) &&
        request.url.includes(environment.OptivaAuthUrl)) ||
      request.url.includes(environment.OptivaImmigrationUrl) ||
      request.url.includes(environment.OptivaAfterSalesUrl)
    ) {
      if (localStorage.getItem('Optiva') !== null) {
        const OptivaData: {
          accessToken: string;
          userToken: string;
          exp: number;
        } = JSON.parse(localStorage.getItem('Optiva')!);

        const modifiedRequest = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${OptivaData.accessToken}`
          ),
        });

        return next.handle(modifiedRequest);
      } else {
        return next.handle(request);
      }
    } else {
      return next.handle(request);
    }
  }
}
