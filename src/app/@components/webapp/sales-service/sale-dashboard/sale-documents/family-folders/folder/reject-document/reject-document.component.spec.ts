import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectDocumentComponent } from './reject-document.component';

describe('RejectDocumentComponent', () => {
  let component: RejectDocumentComponent;
  let fixture: ComponentFixture<RejectDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
