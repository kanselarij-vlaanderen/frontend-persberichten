import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';

export default class InputFieldSearchInputComponent extends Component {
  @tracked value;

  constructor() {
    super(...arguments);
    this.value = this.args.value;
  }

  get delay() {
    return this.args.delay || 300;
  }

  get placeholder() {
    return this.args.placeholder || 'Zoeken';
  }

  @restartableTask
  *delayedInput() {
    yield timeout(this.delay);
    this.args.onChange(this.value);
  }
}
