import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteQuoteModalComponent } from './delete-quote-modal.component';

describe('DeleteQuoteModalComponent', () => {
  let component: DeleteQuoteModalComponent;
  let fixture: ComponentFixture<DeleteQuoteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteQuoteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteQuoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
