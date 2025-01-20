import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersModalComponent } from './partners-modal.component';

describe('PartnersModalComponent', () => {
  let component: PartnersModalComponent;
  let fixture: ComponentFixture<PartnersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
