import Service, { inject } from '@ember/service';

export default class ActivityTrackerService extends Service {
  @inject store;
  @inject currentSession;

  async addActivity(pressRelease, type, participants = []) {
    const activity = this.store.createRecord('press-release-activity', {
      pressRelease,
      type,
      startDate: new Date(),
      organization: this.currentSession.organization,
      creator: this.currentSession.user,
      participants
    });
    await activity.save();
  }
}
