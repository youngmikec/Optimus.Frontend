import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSelectComponent } from './quote-select.component';

describe('QuoteSelectComponent', () => {
  let component: QuoteSelectComponent;
  let fixture: ComponentFixture<QuoteSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
