import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentQuestionsComponent } from './document-questions.component';

describe('DocumentQuestionsComponent', () => {
  let component: DocumentQuestionsComponent;
  let fixture: ComponentFixture<DocumentQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
