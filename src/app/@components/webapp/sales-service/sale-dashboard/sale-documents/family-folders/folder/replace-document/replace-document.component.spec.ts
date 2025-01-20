import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceDocumentComponent } from './replace-document.component';

describe('ReplaceDocumentComponent', () => {
  let component: ReplaceDocumentComponent;
  let fixture: ComponentFixture<ReplaceDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplaceDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
