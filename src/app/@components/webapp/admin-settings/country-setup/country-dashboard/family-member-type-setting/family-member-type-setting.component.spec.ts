import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberTypeSettingComponent } from './family-member-type-setting.component';

describe('FamilyMemberTypeSettingComponent', () => {
  let component: FamilyMemberTypeSettingComponent;
  let fixture: ComponentFixture<FamilyMemberTypeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyMemberTypeSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMemberTypeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
