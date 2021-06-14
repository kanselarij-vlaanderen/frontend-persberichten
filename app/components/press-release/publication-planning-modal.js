import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PressReleasePublicationPlanningModalComponent extends Component {
  @tracked plannedDate = new Date();
}
