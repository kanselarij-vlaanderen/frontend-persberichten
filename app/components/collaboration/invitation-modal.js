import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollaborationInvitationModalComponent extends Component {
  @service currentSession;

  @tracked externalCollaborators = [];

  get isDisabled() {
    return this.externalCollaborators.length === 0;
  }

  get collaborators() {
    return [this.currentSession.organization, ...this.externalCollaborators];
  }

  @action
  selectExternalCollaborators(collaborators) {
    this.externalCollaborators = collaborators;
  }
}
