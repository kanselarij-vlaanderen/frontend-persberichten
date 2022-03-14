import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  async beforeModel() {
    try {
      await this.currentSession.load();
      if (!this.currentSession.organization) {
        this.router.transitionTo('unknown-organization');
      }
    } catch (error) {
      this.session.invalidate();
    }
  }
}
