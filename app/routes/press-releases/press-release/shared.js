import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedRoute extends Route {
  @service currentSession;
  @service toaster;

  model() {
    const pressRelease = this.modelFor('press-releases.press-release');
    return pressRelease.collaboration;
  }

  async afterModel(model) {
    const collaborators = await model.collaborators;
    const currentOrganization = this.currentSession.organization;
    if (!collaborators.includes(currentOrganization)) {
      // Organization of current user is not a collaborator
      this.toaster.error('U heeft geen toegang tot het persbericht.');
      this.transitionTo('press-releases.overview.shared');
    }
  }
}
