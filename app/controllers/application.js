import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  @tracked orange = 'green';
  @tracked selectedMonth = this.months[new Date().getMonth()];

  @action
  changeMonth(month) {
    this.selectedMonth = month;
  }
}
