class SalesActionTypes {
  static readonly IS_LOADING = '[Sales Loader] Is Loading';
  static readonly GET_ACTIVE_PHASES =
    '[Sales Overview Phases] Get Active Phases';
  static readonly GET_SALES_OVERVIEW_DATA =
    '[Sales Overview Page] Get Sales Overview Data';
  static readonly SAVE_OVERVIEW_PARTIAL_DATA =
    '[Sales Overview Page] Save Sales Overview Partial Data';
  static readonly GET_ACTIVITIES =
    '[Sales Overview] Track Application Activities';
  static readonly GET_ACTIVITIES_SUCCESS =
    '[Sales Overview] Track Application Activites Success';
  static readonly GET_ACTIVITIES_FAILURE =
    '[Sales Overview] Track Application Activities Failure';
  static readonly MARK_ACTIVITY_AS_DONE = '[Sales Overview] Mark As Done';
  static readonly MARK_ACTIVITY_AS_DONE_SUCCESS =
    '[Sales Overview] Mark As Done Success';
  static readonly MARK_ACTIVITY_AS_DONE_FAILURE =
    '[Sales Overview] Mark As Done Failure';
  static readonly EDIT_ASSIGNED_OFFICER =
    '[Sales Overview] Edit Assigned Officer';
  static readonly EDIT_ASSIGNED_OFFICER_SUCCESS =
    '[Sales Overview] Edit Assigned Officer Success';
  static readonly EDIT_ASSIGNED_OFFICER_FAILURE =
    '[Sales Overview] Edit Assigned Officer Failure';
  static readonly GET_OFFICERS_BY_ROLE =
    '[Assigned Officers Modal] Get All Officers By Role';
  static readonly GET_OFFICERS_BY_ROLE_SUCCESS =
    '[Assigned Officers Modal] Get All Officers By Role Success';
  static readonly GET_OFFICERS_BY_ROLE_FAILURE =
    '[Assigned Officers Modal] Get All Officers By Role Failure';
}

export default SalesActionTypes;
