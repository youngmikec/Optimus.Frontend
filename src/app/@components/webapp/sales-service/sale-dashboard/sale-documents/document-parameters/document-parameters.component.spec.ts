import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentParametersComponent } from './document-parameters.component';

describe('DocumentParametersComponent', () => {
  let component: DocumentParametersComponent;
  let fixture: ComponentFixture<DocumentParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
