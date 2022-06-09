import SessionService from 'ember-simple-auth/services/session';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';
import { warn } from '@ember/debug';

export default class ExtendedSessionService extends SessionService {
  @service currentSession;
  @service router;

  async handleAuthentication() {
    try {
      await this.currentSession.load();
      if (this.currentSession.organization) {
        super.handleAuthentication('index');
      } else {
        this.router.transitionTo('unknown-organization');
      }
    } catch (error) {
      warn(error, { id: 'authentication-error' });
      this.invalidate();
    }
  }

  handleInvalidation() {
    try {
      const config = ENV.torii?.providers?.['acmidm-oauth2'];
      const logoutUrl = `${config.logoutUrl}?client_id=${config.apiKey}&post_logout_redirect_uri=${encodeURIComponent(config.returnUrl)}`;
      const url = new URL(logoutUrl);
      window.location.replace(url.toString());
    } catch (error) {
      if (ENV.environment == 'development')
        this.router.transitionTo('mock-login');
      else
        this.router.transitionTo('login');
    }
  }
}
