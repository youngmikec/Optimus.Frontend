import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteFormBuilderComponent } from './quote-form-builder.component';

describe('QuoteFormBuilderComponent', () => {
  let component: QuoteFormBuilderComponent;
  let fixture: ComponentFixture<QuoteFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteFormBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
