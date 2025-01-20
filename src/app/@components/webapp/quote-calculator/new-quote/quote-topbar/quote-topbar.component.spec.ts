import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteTopbarComponent } from './quote-topbar.component';

describe('QuoteTopbarComponent', () => {
  let component: QuoteTopbarComponent;
  let fixture: ComponentFixture<QuoteTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
