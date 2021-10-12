import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class CollaborationApprovalStatusComponent extends Component {
  @service store;

  @tracked approved = false;

  style='color: #8BAE00';

  constructor() {
    super(...arguments);
    this.loadApprovalActivity.perform();
  }

  @task
  *loadApprovalActivity() {
    const collaborationActivity = yield this.args.collaborationActivity;
    collaborationActivity.forEach(async activity => {
      const activityCollaborator = await activity.collaborator;
      const approved = activityCollaborator.uri === this.args.collaborator.uri;
      if (approved) {
        this.approved = approved;
        return;
      }
    });
  }
}
