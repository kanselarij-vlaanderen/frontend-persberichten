import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleasePublicationPlanningModalComponent extends Component {
  @tracked plannedDate;

  constructor() {
    super(...arguments);
    if (this.args.plannedDate) {
      this.plannedDate = this.args.plannedDate;
    } else {
      this.plannedDate = new Date();
    }
  }

  @action
  setPlannedDate(selectedDates) {
    this.plannedDate = selectedDates[0];
  }
}
