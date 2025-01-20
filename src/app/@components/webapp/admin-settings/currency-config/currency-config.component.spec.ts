import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConfigComponent } from './currency-config.component';

describe('CurrencyConfigComponent', () => {
  let component: CurrencyConfigComponent;
  let fixture: ComponentFixture<CurrencyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
