import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * Kaleidos-styled wrapper for EmberFlatpickr. Takes the same arguments as EmberFlatpickr takes.
 */
export default class Datepicker extends Component {
  get dateFormat() {
    if (this.args.enableTime) {
      return 'd-m-Y H:i';
    } else {
      return 'd-m-Y';
    }
  }

  get enable() {
    if (this.args.enable) {
      return this.args.enable;
    }
    // Return a function that enables all dates as a default, since passing undefined
    // to <EmberFlatpickr>'s @enable doesn't work
    return [() => true];
  }

  get date() {
    // Return 'null' as a default since <EmberFlatpickr> doesn't handle 'undefined'.
    return this.args.date || null;
  }

  get placeholder() {
    return this.args.placeholder || 'Kies een datum';
  }

  @action
  // eslint-disable-next-line no-unused-vars
  onReady(_selectedDates, _dateStr, instance) {
    this.flatpickrRef = instance;
  }

  @action
  updateEnable() { // in order to make the ember-component work in a DDAU fashion (update view when the enable arg changes)
    this.flatpickrRef.set('enable', this.enable);
  }

  @action
  openDatepicker() {
    this.flatpickrRef.toggle();
  }
}
