'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'frontend-persberichten',
    podModulePrefix: 'frontend-persberichten/pods',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: '{{OAUTH_API_KEY}}',
          baseUrl: '{{OAUTH_BASE_URL}}',
          redirectUri: '{{OAUTH_REDIRECT_URL}}',
          logoutUrl: '{{OAUTH_LOGOUT_URL}}',
          returnUrl: '{{OAUTH_RETURN_URL}}',
          scope: [
            'vo',
            'profile',
            'openid',
            'phone',
            'email',
            'dkbuzavlivia'
          ].join(' '),
        }
      }
    }
  };

  if (environment === 'development') {
    const authConfig = ENV.torii.providers['acmidm-oauth2'];
    authConfig.apiKey = 'bd0483de-67e3-4ccf-8fcc-1aff6ff29675';
    authConfig.baseUrl = 'https://authenticatie-ti.vlaanderen.be/op/v1/auth';
    authConfig.redirectUri = 'https://VLIVIA-dev.vlaanderen.be/authorization/callback';
    authConfig.logoutUrl = 'https://authenticatie-ti.vlaanderen.be/op/v1/logout';
    authConfig.returnUrl = 'https://VLIVIA-dev.vlaanderen.be';

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
