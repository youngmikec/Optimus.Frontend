import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInformationComponent } from './partner-information.component';

describe('PartnerInformationComponent', () => {
  let component: PartnerInformationComponent;
  let fixture: ComponentFixture<PartnerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
