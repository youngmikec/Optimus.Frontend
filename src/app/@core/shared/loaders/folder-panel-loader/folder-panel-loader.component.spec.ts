import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderPanelLoaderComponent } from './folder-panel-loader.component';

describe('FolderPanelLoaderComponent', () => {
  let component: FolderPanelLoaderComponent;
  let fixture: ComponentFixture<FolderPanelLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderPanelLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderPanelLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
