import Route from '@ember/routing/route';
import PressReleaseSnapshot from '../../../../utils/press-release-snapshot';

export default class PressReleasesPressReleaseSharedEditRoute extends Route {
  async beforeModel() {
    const pressRelease = this.modelFor('press-releases.press-release');
    this.collaboration = await pressRelease.collaboration;
    const tokenClaim = await this.store.queryOne('token-claim', {
      'filter[collaboration-activity][:id:]': this.collaboration.id,
      include: 'user'
    });

    if (!tokenClaim) {
      const url = `/collaboration-activities/${this.collaboration.id}/claims`;
      const response = await fetch(url, {
          method: 'POST',
        }
      );
      if (response.status !== 201) {
        this.transitionTo('press-releases.press-release.shared.read');
      }
    }
  }

  async model() {
    const pressRelease = this.modelFor('press-releases.press-release');
    const snapshot = new PressReleaseSnapshot(pressRelease);
    await snapshot.commit();
    return snapshot;
  }

  async afterModel() {
    this.collaborators = await this.collaboration.collaborators;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaborators = this.collaborators;
  }
}
