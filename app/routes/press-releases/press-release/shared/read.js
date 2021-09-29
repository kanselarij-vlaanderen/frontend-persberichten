import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {
  @service currentSession;

  async afterModel(model) {
    this.collaboration = await model.collaboration;
    this.collaborators = await this.collaboration.collaborators;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaboration = this.collaboration;
    controller.collaborators = this.collaborators;
    controller.didUserApprove = false;
    this.loadUserApprovalStatus(controller);
  }

  async loadUserApprovalStatus(controller) {
    const activity = await this.store.findRecord('collaboration-activity', this.collaboration.id, {
      include: [
        'approval-activities',
      ].join(',')
    });
    const approvalActivities = await activity.approvalActivities;
    approvalActivities.forEach(async activity => {
      const collaborator = await activity.collaborator;
      const approved = collaborator.uri === this.currentSession.organization.uri;
      if (approved) {
        controller.didUserApprove = approved;
        return;
      }
    })
  }
}
