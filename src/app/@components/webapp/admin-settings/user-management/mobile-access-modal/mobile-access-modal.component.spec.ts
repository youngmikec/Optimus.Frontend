import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAccessModalComponent } from './mobile-access-modal.component';

describe('MobileAccessModalComponent', () => {
  let component: MobileAccessModalComponent;
  let fixture: ComponentFixture<MobileAccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAccessModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
