import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordMessageComponent } from './reset-password-message.component';

describe('ResetPasswordMessageComponent', () => {
  let component: ResetPasswordMessageComponent;
  let fixture: ComponentFixture<ResetPasswordMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
