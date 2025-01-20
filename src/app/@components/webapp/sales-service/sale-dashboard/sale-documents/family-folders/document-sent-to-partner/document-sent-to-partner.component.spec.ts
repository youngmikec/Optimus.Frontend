import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSentToPartnerComponent } from './document-sent-to-partner.component';

describe('DocumentSentToPartnerComponent', () => {
  let component: DocumentSentToPartnerComponent;
  let fixture: ComponentFixture<DocumentSentToPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentSentToPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSentToPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
