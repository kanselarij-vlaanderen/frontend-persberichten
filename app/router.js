import EmberRouter from '@ember/routing/router';
import config from 'frontend-persberichten/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('contact');

  this.route('settings', { path: 'instellingen' });

  this.route('login', { path: 'aanmelden' });

  this.route(
    'sources',
    {
      path: 'bronnen',
    },
    function () {
      this.route('new', { path: 'nieuw' });
      this.route('index', function () {});
      this.route('active', { path: 'actief' });
      this.route('source', { path: '/:source_id' });
    }
  );

  this.route(
    'press-releases',
    {
      path: 'persberichten',
    },
    function () {}
  );

  this.route(
    'contacts',
    {
      path: 'contacten',
    },
    function () {}
  );
});
