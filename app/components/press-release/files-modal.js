import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class PressReleaseFilesModalComponent extends Component {
  @tracked file;

  @action
  addFile(file) {
    this.file = file;
  }

  @action
  closeModal() {
    if (this.file) {
      this.destroyFile.perform(this.file);
    }
    this.args.onCancel();
  }

  @task
  *destroyFile(file) {
    yield file.destroyRecord();
  }

  @task
  *upload() {
    yield this.args.onUpload(this.file);
  }
}
