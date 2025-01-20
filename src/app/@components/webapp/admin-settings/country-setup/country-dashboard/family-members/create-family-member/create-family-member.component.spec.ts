import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFamilyMemberComponent } from './create-family-member.component';

describe('CreateFamilyMemberComponent', () => {
  let component: CreateFamilyMemberComponent;
  let fixture: ComponentFixture<CreateFamilyMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFamilyMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFamilyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
