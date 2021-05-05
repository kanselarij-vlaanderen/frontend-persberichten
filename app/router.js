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

  this.route('contacts', {
    path: 'contacten'
  }, function() {});

  this.route('press-releases', {
    path: 'persberichten'
  }, function() {});

  this.route('mailing-lists', {
    path: 'verzendlijsten'
  }, function() {});
});
