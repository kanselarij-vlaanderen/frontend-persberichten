import Route from '@ember/routing/route';
import PressReleaseSnapshot from '../../../utils/press-release-snapshot';

export default class PressReleasesPressReleaseEditRoute extends Route {
  async beforeModel() {
    const isPublished = (await this.modelFor('press-releases.press-release')).publicationEvent.get('isPublished');
    if (isPublished) {
      this.transitionTo('press-releases.press-release.published');
    }
  }

  async model() {
    const pressRelease = await this.modelFor('press-releases.press-release');
    const snapshot = new PressReleaseSnapshot(pressRelease);
    await snapshot.commit();
    return snapshot;
  }
}
