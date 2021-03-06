import EmberRouter from '@ember/routing/router';
import config from 'frontend-persberichten/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('press-releases', { path: 'persberichten' }, function() {
    this.route('overview', { path: 'overzicht' }, function() {
      this.route('concept');
      this.route('shared', { path: 'gedeeld' });
      this.route('planned', { path: 'gepland' });
      this.route('published', { path: 'gepubliceerd' });
    });
    this.route('press-release', { path: '/:press_release_id' }, function() {
      this.route('edit', { path: 'bewerk' });
      this.route('published', { path: 'gepubliceerd' });
      this.route('shared', { path: 'gedeeld' }, function() {
        this.route('read', { path: 'lezen' });
        this.route('edit', { path: 'bewerk' });
      });
    });
  });

  this.route('contacts', { path: 'bestemmelingen' }, function() {
    this.route('new', { path: 'nieuw'});
    this.route('mailing-list', { path: 'verzendlijst/:mailing_list_id'});
    this.route('overview', { path: 'overzicht' }, function() {
      this.route('mailing-lists', { path: 'verzendlijsten' });
      this.route('persons', { path: 'personen' });
    });
  });

  this.route('sources', { path: 'perscontacten' }, function() {
    this.route('new', { path: 'nieuw' });
    this.route('overview', { path: 'overzicht' }, function() {
      this.route('active', { path: 'actief' });
      this.route('inactive', { path: 'inactief' });
    });
    this.route('source', { path: '/:source_id' });
  });

  this.route('login', { path: 'aanmelden' });
  this.route('mock-login');
  this.route('unknown-organization', { path: 'organizatie-niet-gekend' });
});
