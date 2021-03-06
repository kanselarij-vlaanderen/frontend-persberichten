import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedRoute extends Route {
  @service currentSession;
  @service toaster;
  @service router;

  model() {
    this.pressRelease = this.modelFor('press-releases.press-release');
    return this.pressRelease.collaboration;
  }

  async afterModel(model) {
    if (model) {
      const collaborators = await model.collaborators;
      const currentOrganization = this.currentSession.organization;
      if (!collaborators.includes(currentOrganization)) {
        // Organization of current user is not a collaborator
        this.toaster.error('U heeft geen toegang tot het persbericht.');
        this.router.transitionTo('press-releases.overview.shared');
      }
    } else {
      // No collaboration related to the press-release
      this.router.transitionTo('press-releases.press-release.edit', this.pressRelease.id);
    }
  }
}
