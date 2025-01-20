import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFamilyMemberTypeSettingsComponent } from './create-family-member-type-settings.component';

describe('CreateFamilyMemberTypeSettingsComponent', () => {
  let component: CreateFamilyMemberTypeSettingsComponent;
  let fixture: ComponentFixture<CreateFamilyMemberTypeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFamilyMemberTypeSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFamilyMemberTypeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
