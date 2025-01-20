import { ITableView } from '../interfaces/tableView.interface';

interface IAppTableViewData {
  clientService: {
    tableViews: ITableView[];
  };
}

export const AppTableViewData: IAppTableViewData = {
  clientService: {
    tableViews: [
      {
        id: 1,
        tableViewName: 'Client Service',
        name: 'Default', // Optimus,
        description: `Choose which columns to display from the list view below. Rearrange their order using drag-and-drop or the "up" and "down" buttons beside each column.`,
        active: true,
        tableColumns: [
          {
            name: 'Applicant ID',
            propertyName: 'applicationId',
            serialNumber: 1,
            isSelected: true,
          },
          {
            name: 'Applicant Name',
            propertyName: 'applicantName',
            serialNumber: 2,
            isSelected: true,
          },
          {
            name: 'Country Program',
            propertyName: 'countryName',
            serialNumber: 3,
            isSelected: true,
          },
          {
            name: 'Migration Route',
            propertyName: 'routeName',
            serialNumber: 4,
            isSelected: true,
          },
          {
            name: 'Amount Paid',
            propertyName: 'amountPaid',
            serialNumber: 5,
            isSelected: false,
          },
          {
            name: 'Processing Fee',
            propertyName: 'countryProcessingAmount',
            serialNumber: 6,
            isSelected: false,
          },
          {
            name: 'Invoice Amount',
            propertyName: 'invoiceAmount',
            serialNumber: 7,
            isSelected: false,
          },
          {
            name: 'Application stage',
            propertyName: 'stage',
            serialNumber: 8,
            isSelected: true,
          },
          {
            name: 'Assigned/Unassigned',
            propertyName: 'assigned',
            serialNumber: 9,
            isSelected: true,
          },
          {
            name: 'Status',
            propertyName: 'status',
            serialNumber: 10,
            isSelected: true,
          },
          {
            name: 'Created Date',
            propertyName: 'createdDate',
            serialNumber: 11,
            isSelected: true,
          },
        ],
        createdDate: new Date(),
      },
      {
        id: 2,
        tableViewName: 'Client Service',
        name: 'Report View', // Optimus,
        description: `Choose which columns to display from the list view below. Rearrange their order using drag-and-drop or the "up" and "down" buttons beside each column.`,
        active: true,
        tableColumns: [
          {
            name: 'Applicant ID',
            propertyName: 'applicationId',
            serialNumber: 1,
            isSelected: true,
          },
          {
            name: 'Applicant Name',
            propertyName: 'applicantName',
            serialNumber: 2,
            isSelected: true,
          },
          {
            name: 'Country Program',
            propertyName: 'countryName',
            serialNumber: 3,
            isSelected: true,
          },
          {
            name: 'Migration Route',
            propertyName: 'routeName',
            serialNumber: 4,
            isSelected: true,
          },
          {
            name: 'Amount Paid',
            propertyName: 'amountPaid',
            serialNumber: 5,
            isSelected: true,
          },
          {
            name: 'Processing Fee',
            propertyName: 'countryProcessingAmount',
            serialNumber: 6,
            isSelected: true,
          },
          {
            name: 'Invoice Amount',
            propertyName: 'invoiceAmount',
            serialNumber: 7,
            isSelected: true,
          },
          {
            name: 'Application stage',
            propertyName: 'assignmentStatus',
            serialNumber: 8,
            isSelected: true,
          },
          {
            name: 'Assigned/Unassigned',
            propertyName: 'assigned',
            serialNumber: 9,
            isSelected: false,
          },
          {
            name: 'SM',
            propertyName: 'sm',
            serialNumber: 9,
            isSelected: false,
          },
          {
            name: 'PA',
            propertyName: 'pa',
            serialNumber: 9,
            isSelected: false,
          },
          {
            name: 'Status',
            propertyName: 'status',
            serialNumber: 10,
            isSelected: false,
          },
          {
            name: 'Created Date',
            propertyName: 'createdDate',
            serialNumber: 11,
            isSelected: true,
          },
        ],
        createdDate: new Date(),
      },
    ],
  },
};
