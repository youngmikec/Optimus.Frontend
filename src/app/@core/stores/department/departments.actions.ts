import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Departments] Reset Store');

export const IsLoading = createAction(
  '[Departments] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllDepartments = createAction(
  '[Departments] Get All Departments',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllDepartments = createAction(
  '[Departments] Save All Departments',
  props<{
    payload: any[];
  }>()
);

export const GetActiveDepartments = createAction(
  '[Departments] Get Active Departments',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveActiveDepartments = createAction(
  '[Departments] Save Active Departments',
  props<{
    payload: any[];
  }>()
);

export const CreateDepartment = createAction(
  '[Departments] Create Department',
  props<{
    payload: {
      name: string;
      divisionId: number;
    };
  }>()
);

export const UpdateDepartment = createAction(
  '[Departments] Update Department',
  props<{
    payload: {
      name: string;
      divisionId?: number;
      description?: string;
      departmentId: number;
    };
  }>()
);

export const ChangeDepartmentStatus = createAction(
  '[Departments] Change Department Status',
  props<{
    payload: {
      departmentId: number;
    };
  }>()
);

// division

export const CreateDivision = createAction(
  '[Department] Create Division',
  props<{
    payload: {
      name: string;
      // departmentId: number;
    };
  }>()
);

export const UpdateDivision = createAction(
  '[Department] Update Division',
  props<{
    payload: {
      divisionId: number;
      name: string;
    };
  }>()
);

export const ChangeDivisionStatus = createAction(
  '[Departments] Change Division Status',
  props<{
    payload: {
      divisionId: number;
    };
  }>()
);

export const GetDivisionsById = createAction(
  '[Department] Get Division By Id',
  props<{
    payload: {
      divisionId: number;
    };
  }>()
);

export const GetAllDivisions = createAction(
  '[Department] Get All Division',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllDivisions = createAction(
  '[Department] Save All Division',
  props<{
    payload: any[];
  }>()
);

export const GetActiveDivisions = createAction(
  '[Department] Get Active Division',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveActiveDivisions = createAction(
  '[Department] Save Active Division',
  props<{
    payload: any[];
  }>()
);

export const GetAllDivisionsByDepartmentId = createAction(
  '[Department] Get Division By Department Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetAllDepartmentsByDivisionId = createAction(
  '[Department] Get Departments By Division Id',
  props<{
    payload: {
      id: number;
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllDivisionsByDepartmentId = createAction(
  '[Department] Save All Division',
  props<{
    payload: any[];
  }>()
);

export const SaveAllDepartmentsByDivisionId = createAction(
  '[Department] Save All Departments',
  props<{
    payload: any[];
  }>()
);

export const DeleteDepartment = createAction(
  '[Department] Delete Department',
  props<{
    payload: {
      departmentId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteBankAccount = createAction(
  '[Department] Delete Bank Account',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteBranch = createAction(
  '[Department] Delete Branch',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteDivision = createAction(
  '[Department] Delete Division',
  props<{
    payload: {
      divisionId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteJobTitle = createAction(
  '[Department] Delete JobTitle',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteUnit = createAction(
  '[Department] Delete Unit',
  props<{
    payload: {
      unitId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

// units
export const CreateUnit = createAction(
  '[Department] Create Unit',
  props<{
    payload: {
      name: string;
      departmentId: number;
    };
  }>()
);

export const UpdateUnit = createAction(
  '[Department] Update Unit',
  props<{
    payload: {
      unitId: number;
      name: string;
      departmentId?: number;
      divisionId?: number;
    };
  }>()
);

export const ChangeUnitStatus = createAction(
  '[Departments] Change Unit Status',
  props<{
    payload: {
      unitId: number;
    };
  }>()
);

export const GetUnitById = createAction(
  '[Department] Get Unit By Id',
  props<{
    payload: {
      unitId: number;
    };
  }>()
);

export const GetAllUnits = createAction(
  '[Department] Get All Unit',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllUnits = createAction(
  '[Department] Save All Unit',
  props<{
    payload: any[];
  }>()
);

export const GetAllUnitsByDepartmentId = createAction(
  '[Department] Get Unit By Department Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllUnitsByDepartmentId = createAction(
  '[Department] Save All Units',
  props<{
    payload: any[];
  }>()
);

//Branches

export const GetAllBranches = createAction(
  '[Branch] Get All Branches',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllBranches = createAction(
  '[Branch] Save All Branches',
  props<{
    payload: any[];
  }>()
);

export const CreateBranch = createAction(
  '[Branch] Create Branch',
  props<{
    payload: {
      name: string;
      branchAddress_Country: string;
      branchAddress_State: string;
      branchAddress_Area: string;
      branchAddress_Building: string;
      branchAddress_Street: string;
      branchAddress_ZipCode: string;
    };
  }>()
);

export const UpdateBranch = createAction(
  '[Branch] Update Branch',
  props<{
    payload: {
      name: string;
      id: number;
      branchAddress_Country: string;
      branchAddress_State: string;
      branchAddress_Area: string;
      branchAddress_Building: string;
      branchAddress_Street: string;
      branchAddress_ZipCode: string;
    };
  }>()
);

export const ActivateCurrency = createAction(
  '[Branch] Activate Branch',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const DeactivateCurrency = createAction(
  '[Branch] Deactivate Branch',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const ActivateBranch = createAction(
  '[Branch] Activate Branch',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const ActivateDeactivateDepartment = createAction(
  '[Department] Activate Department',
  props<{
    payload: {
      id: number;
      action: 'Activate' | 'Deactivate';
      skip?: number;
      take?: number;
    };
  }>()
);

export const ActivateDeactivateJobTitle = createAction(
  '[Department] Activate JobTitle',
  props<{
    payload: {
      id: number;
      action: 'Activate' | 'Deactivate';
      skip?: number;
      take?: number;
    };
  }>()
);

export const ActivateDeactivateBank = createAction(
  '[Department] Activate Bank',
  props<{
    payload: {
      id: number;
      action: 'Activate' | 'Deactivate';
      skip?: number;
      take?: number;
    };
  }>()
);

export const ActivateDeactivateDivision = createAction(
  '[Department] Activate Division',
  props<{
    payload: {
      id: number;
      action: 'Activate' | 'Deactivate';
      skip?: number;
      take?: number;
    };
  }>()
);

export const ActivateDeactivateBranch = createAction(
  '[Department] Activate Branch',
  props<{
    payload: {
      id: number;
      action: 'Activate' | 'Deactivate';
      skip?: number;
      take?: number;
    };
  }>()
);

export const ActivateDeactivateUnit = createAction(
  '[Department] Activate Unit',
  props<{
    payload: {
      id: number;
      action: 'Activate' | 'Deactivate';
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeactivateDepartment = createAction(
  '[Department] Activate Department',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeactivateBranch = createAction(
  '[Branch] Deactivate Branch',
  props<{
    payload: {
      id: number;
    };
  }>()
);

//company profile

export const CreateCompanyProfile = createAction(
  '[Company Profile] Create Company Profile',
  props<{
    payload: {
      companyName: string;
      companyLogo: string;
      address_Country: string;
      address_State: string;
      address_Area: string;
      address_Building: string;
      address_Street: string;
      address_ZipCode: string;
    };
  }>()
);

export const UpdateCompanyProfile = createAction(
  '[Company Profile] Update Company Profile',
  props<{
    payload: {
      id: number;
      companyName: string;
      companyLogo: string;
      address_Country: string;
      address_State: string;
      address_Area: string;
      address_Building: string;
      address_Street: string;
      address_ZipCode: string;
      website: string;
      email: string;
      contactNumber: string;
      contactNumberCountryCode: string;
      headOfficeAddress: string;
    };
  }>()
);

export const CreateBankAccount = createAction(
  '[Company Profile] Create Bank Account',
  props<{
    payload: {
      bankName: string;
      bankCode: string;
      accountName: string;
      accountNumber: string;
      swiftCode: string;
      transitNumber: string;
      countryId: number;
      accountCurrencyType: number;
      bankAddress: {
        country: string;
        state: string;
        area: string;
        streetNumber: string;
        building: string;
        zipCode: string;
        name: string;
        description: string;
      };
      beneficiaryAddress: {
        country: string;
        state: string;
        area: string;
        streetNumber: string;
        building: string;
        zipCode: string;
        name: string;
        description: string;
      };
    };
  }>()
);

export const UpdateBankAccount = createAction(
  '[Company Profile] Update Bank Account',
  props<{
    payload: {
      bankAccountId: number;
      bankName: string;
      bankCode: string;
      accountName: string;
      accountNumber: string;
      swiftCode: string;
      transitNumber: string;
      countryId: number;
      accountCurrencyType: number;
      bankAddress: {
        country: string;
        state: string;
        area: string;
        streetNumber: string;
        building: string;
        zipCode: string;
      };
      beneficiaryAddress: {
        country: string;
        state: string;
        area: string;
        streetNumber: string;
        building: string;
        zipCode: string;
      };
    };
  }>()
);

export const GetAllBankAccounts = createAction(
  '[Location] Get All Bank Accounts',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllBankAccounts = createAction(
  '[Location] Save All Bank Accounts',
  props<{
    payload: any[];
  }>()
);

export const GetActiveBankAccounts = createAction(
  '[BankAccounts] Get Active Bank Accounts',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveActiveBankAccounts = createAction(
  '[BankAccounts] Save Active Bank Accounts',
  props<{
    payload: any[];
  }>()
);

export const ActivateBank = createAction(
  '[Bank] Activate Bank',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const DeactivateBank = createAction(
  '[Bank] Deactivate Bank',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetHeadOffice = createAction('[Location] Get Head Office');

export const SaveHeadOffice = createAction(
  '[Location] Save Head Office',
  props<{
    payload: any[];
  }>()
);

export const GetJobTitle = createAction(
  '[Job Title] Get Job Title',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const GetActiveJobTitle = createAction(
  '[Job Title] Get Active Job Title',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const GetInactiveJobTitle = createAction(
  '[Job Title] Get Inactive Job Title',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const GetJobTitleByStatus = createAction(
  '[Job Title] Get  Job Title By Status',
  props<{
    payload: {
      skip: number;
      take: number;
      status: number;
    };
  }>()
);

export const SaveAllJobTitle = createAction(
  '[Job Title] Save All Job Title',
  props<{
    payload: any[];
  }>()
);

export const ChangeJobTitleStatus = createAction(
  '[Job Title] Change Job Title Status',
  props<{
    payload: {
      id: number;
      status: number;
    };
    paginationData: {
      skip: number;
      take: number;
      status: number;
    };
  }>()
);

export const CreateJobTitle = createAction(
  '[Job Title] Create Job Title',
  props<{
    payload: {
      jobTitle: string;
    };
  }>()
);

export const UpdateJobTitle = createAction(
  '[Job Title] Update Job Title',
  props<{
    payload: {
      jobTitle: string;
      id: number;
    };
  }>()
);
