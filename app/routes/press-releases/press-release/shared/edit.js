import Route from '@ember/routing/route';
import PressReleaseSnapshot from '../../../../utils/press-release-snapshot';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedEditRoute extends Route {
  @service toaster;

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
        this.toaster.error('Er is iets misgegaan bij het claimen van de token.');
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
    this.approvalActivities = await this.store.query('approval-activity', {
      'filter[collaboration-activity][:id:]': this.collaboration.id,
      include: 'collaborator'
    });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaborators = this.collaborators;
    controller.approvalActivities = this.approvalActivities;
  }
}
