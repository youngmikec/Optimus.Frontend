import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogDataService {
  private data: any;

  constructor() {}

  setData(data: any) {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }
}
