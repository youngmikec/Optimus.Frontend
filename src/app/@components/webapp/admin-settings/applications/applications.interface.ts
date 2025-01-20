export interface ApplicationTable {
  primary_applicant: string;
  route_name: string;
  product_category: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  status: 'Fully Paid' | 'Partly Paid' | 'Due' | 'Unpaid';
  isActive: Boolean;
}
