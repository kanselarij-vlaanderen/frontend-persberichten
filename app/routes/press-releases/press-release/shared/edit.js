import Route from '@ember/routing/route';
import PressReleaseSnapshot from '../../../../utils/press-release-snapshot';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedEditRoute extends Route {
  @service toaster;
  @service store;
  @service router;

  async beforeModel() {
    this.collaboration = this.modelFor('press-releases.press-release.shared');

    // Using this.store.query to ensure non-stale token-claim from backend
    // instead of cached ember-data record
    const tokenClaim = await this.store.queryOne('token-claim', {
      'filter[collaboration-activity][:id:]': this.collaboration.id,
      include: 'user'
    });

    if (!tokenClaim) {
      // Make current user claim the edit-token of the press-release
      const url = `/collaboration-activities/${this.collaboration.id}/claims`;
      const response = await fetch(url, {
          method: 'POST',
        }
      );
      if (response.status !== 201) {
        this.toaster.error('Er is iets misgelopen bij het openen van de bewerk-modus.');
        this.router.transitionTo('press-releases.press-release.shared.read');
      }
    }
  }

  async model() {
    const pressRelease = this.modelFor('press-releases.press-release');
    const snapshot = new PressReleaseSnapshot(pressRelease);
    await snapshot.commit();
    return snapshot;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaboration = this.collaboration;
  }
}
