import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedRoute extends Route {
  @service currentSession;

  async afterModel(model) {
    const collaboration = await model.collaboration;
    const collaborators = await collaboration.collaborators;
    const currentOrganization = this.currentSession.organization;
    if (!collaborators.includes(currentOrganization)) {
      // Organization of current user is not a collaborator
      this.transitionTo('press-releases.overview.shared');
    }
  }
}
