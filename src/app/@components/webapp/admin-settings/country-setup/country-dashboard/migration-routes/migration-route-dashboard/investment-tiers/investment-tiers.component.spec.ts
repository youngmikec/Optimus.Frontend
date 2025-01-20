import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentTiersComponent } from './investment-tiers.component';

describe('InvestmentTiersComponent', () => {
  let component: InvestmentTiersComponent;
  let fixture: ComponentFixture<InvestmentTiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentTiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
