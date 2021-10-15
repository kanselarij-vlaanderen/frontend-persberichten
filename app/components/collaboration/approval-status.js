import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class CollaborationApprovalStatusComponent extends Component {
  @service store;

  @tracked approvalActivity;

  constructor() {
    super(...arguments);
    this.loadApprovalActivity.perform();
  }

  @task
  *loadApprovalActivity() {
    this.approvalActivity = yield this.store.queryOne('approval-activity', {
      'filter[collaboration-activity][press-release][:id:]': this.args.pressRelease.id,
      'filter[collaborator][:id:]': this.args.collaborator.id
    });
  }
}
