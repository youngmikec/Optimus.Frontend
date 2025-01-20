import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmQuoteComponent } from './confirm-quote.component';

describe('ConfirmQuoteComponent', () => {
  let component: ConfirmQuoteComponent;
  let fixture: ComponentFixture<ConfirmQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
