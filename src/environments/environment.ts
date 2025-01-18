// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_ipapi_access_token: '<inserted by pipeline>',
  OptivaDeveloperLoginCredentials: {
    name: 'OptivaApp',
  },
  OptivaAuthUrl: 'https://optimus-auth-dev.reventholdings.com/api',
  OptivaImmigrationUrl:
    'https://optimus-immigration-dev.reventholdings.com/api',
  // OptivaAfterSalesUrl: 'https://optimus-aftersales-dev.reventholdings.com/api',
  OptivaAfterSalesUrl: 'https://optimus-aftersale-dev.reventholdings.com/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
