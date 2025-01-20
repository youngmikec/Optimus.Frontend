import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesLoanService {
  private messageSource = new BehaviorSubject<any>(null);
  currentMessage = this.messageSource.asObservable();

  constructor() {}

  changeMessage(loanData: any) {
    this.messageSource.next(loanData);
  }
}
