import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPartnerComponent } from './create-edit-partner.component';

describe('CreateEditPartnerComponent', () => {
  let component: CreateEditPartnerComponent;
  let fixture: ComponentFixture<CreateEditPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
