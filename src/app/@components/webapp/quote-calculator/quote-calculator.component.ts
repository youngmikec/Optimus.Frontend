import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/@core/services/permission.service';

@Component({
  selector: 'app-quote-calculator',
  templateUrl: './quote-calculator.component.html',
  styleUrls: ['./quote-calculator.component.scss'],
})
export class QuoteCalculatorComponent implements OnInit {
  permissions: boolean[] = [];
  searchInputParam: string | null = '';

  constructor(private permissionService: PermissionService) {}

  ngOnInit() {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Quote Calculator');
    });
  }
}
