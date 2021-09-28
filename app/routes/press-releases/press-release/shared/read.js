import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {
  @service currentSession;

  async afterModel(model) {
    console.log('after model hook')
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
    const approvalActivities = await this.collaboration.approvalActivities;
    approvalActivities.forEach(async activity => {
      const activityCollaborator = await activity.collaborator;
      const approved = activityCollaborator.uri === this.currentSession.organization.uri;
      if (approved) {
        controller.didUserApprove = approved;
        return;
      }
    })
  }
}
