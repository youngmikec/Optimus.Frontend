import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialStatementDialogComponent } from './financial-statement-dialog.component';

describe('FinancialStatementDialogComponent', () => {
  let component: FinancialStatementDialogComponent;
  let fixture: ComponentFixture<FinancialStatementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialStatementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialStatementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
