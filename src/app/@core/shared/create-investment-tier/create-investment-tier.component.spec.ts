import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvestmentTierComponent } from './create-investment-tier.component';

describe('CreateInvestmentTierComponent', () => {
  let component: CreateInvestmentTierComponent;
  let fixture: ComponentFixture<CreateInvestmentTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvestmentTierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvestmentTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
