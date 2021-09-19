import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedRoute extends Route {
  @service currentSession;

  async model() {
    const pressRelease = await this.modelFor('press-releases.press-release');
    const collaboration = await pressRelease.collaboration;
    const collaborators = await collaboration.collaborators
    const loggedUser = this.currentSession.organization;
    const index = collaborators.indexOf(loggedUser);
    if (index > -1) {
      return pressRelease;
    }
    return;
  }

  afterModel(model) {
    if (model) {
      this.transitionTo('press-releases.press-release.shared.read')
    } else {
      this.transitionTo('press-releases.overview.shared')
    }
  }
}
