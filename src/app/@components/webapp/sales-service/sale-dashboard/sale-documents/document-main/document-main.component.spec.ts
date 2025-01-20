import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentMainComponent } from './document-main.component';

describe('DocumentMainComponent', () => {
  let component: DocumentMainComponent;
  let fixture: ComponentFixture<DocumentMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
