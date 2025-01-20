import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromFeatures from './features.reducer';

const getFeaturesState = (state: fromApp.AppState) => state.features;

export const getFeaturesIsLoading = createSelector(
  getFeaturesState,
  (state: fromFeatures.State) => state.isLoading
);

export const getAllFeatures = createSelector(
  getFeaturesState,
  (state: fromFeatures.State) => state.allFeatures
);

export const getAllAccessLevels = createSelector(
  getFeaturesState,
  (state: fromFeatures.State) => state.allAccessLevels
);

export const getPermissionsByAccessLevel = createSelector(
  getFeaturesState,
  (state: fromFeatures.State) => state.allPermissionsByAccessLevel
);

// export const getAllVendorPermission = createSelector(
//   getFeaturesState,
//   (state: fromFeatures.State) => {
//     if (state.allFeatures) {
//       return state.allFeatures?.entities.filter(
//         (permission: any) =>
//           permission.parentFeatureId > 0 &&
//           permission.permissionAccessLevels.find(
//             (permissionAccessLevel: any) =>
//               permissionAccessLevel.accessLevel === 3
//           ) !== undefined
//       );
//     }
//     return null;
//   }
// );
