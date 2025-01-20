import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientServiceDashboardComponent } from './client-service-dashboard.component';

describe('ClientServiceDashboardComponent', () => {
  let component: ClientServiceDashboardComponent;
  let fixture: ComponentFixture<ClientServiceDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientServiceDashboardComponent]
    });
    fixture = TestBed.createComponent(ClientServiceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
