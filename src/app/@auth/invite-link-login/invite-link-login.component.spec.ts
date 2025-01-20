import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteLinkLoginComponent } from './invite-link-login.component';

describe('InviteLinkLoginComponent', () => {
  let component: InviteLinkLoginComponent;
  let fixture: ComponentFixture<InviteLinkLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteLinkLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteLinkLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
