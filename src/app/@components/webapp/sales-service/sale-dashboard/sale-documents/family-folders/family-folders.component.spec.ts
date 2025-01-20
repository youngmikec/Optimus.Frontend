import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyFoldersComponent } from './family-folders.component';

describe('FamilyFoldersComponent', () => {
  let component: FamilyFoldersComponent;
  let fixture: ComponentFixture<FamilyFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyFoldersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
