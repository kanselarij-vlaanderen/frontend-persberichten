import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PressReleaseHistoryStepComponent extends Component {
  @service currentSession;

  get collaborators() {
    const mainParticipant = this.args.activity.organization.get('uri');
    const collaborators = this.args.activity.participants.rejectBy('uri', mainParticipant);
    return collaborators.map((organization) => {
      return organization.shortName || organization.name;
    });
  }
}
