import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCollectedComponent } from './document-collected.component';

describe('DocumentCollectedComponent', () => {
  let component: DocumentCollectedComponent;
  let fixture: ComponentFixture<DocumentCollectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCollectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCollectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
