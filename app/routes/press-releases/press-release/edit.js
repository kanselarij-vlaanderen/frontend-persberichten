import Route from '@ember/routing/route';
import PressReleaseSnapshot from '../../../utils/press-release-snapshot';

export default class PressReleasesPressReleaseEditRoute extends Route {
  async beforeModel() {
    this.pressRelease = this.modelFor('press-releases.press-release');
    const publicationEvent = await this.pressRelease.publicationEvent;
    if (publicationEvent && publicationEvent.isPublished) {
      this.transitionTo('press-releases.press-release.published');
    } else {
      const collaboration = await this.pressRelease.collaboration;
      if (collaboration) {
        this.transitionTo('press-releases.press-release.shared');
      }
    }
  }

  async model() {
    const snapshot = new PressReleaseSnapshot(this.pressRelease);
    await snapshot.commit();
    return snapshot;
  }
}
