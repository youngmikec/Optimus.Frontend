/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleNoteComponent } from './sale-note.component';

describe('SaleNoteComponent', () => {
  let component: SaleNoteComponent;
  let fixture: ComponentFixture<SaleNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
