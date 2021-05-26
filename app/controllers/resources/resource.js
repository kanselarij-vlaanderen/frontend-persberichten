import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SourcesSourceController extends Controller {
  @service router;
  @service store;

  @tracked source;

  @action
  async onLoadSource() {
    console.log('rendering');
    const source = await this.store.findRecord(
      'contact',
      '38d04ce5-bbef-492f-b19d-0a5da640b2e9'
    );
    // const source = await this.store.findRecord('contact', this.model.source_id).catch(err => console.log(err));
    this.source = source;
  }

  @action
  navigateToSource() {
    this.source.rollbackAttributes();
    this.router.transitionTo('sources.active');
  }

  @action
  onInput(target, value) {
    this.source[target] = value;
    if (target === 'familyName' || target === 'givenName') {
      this.source.fullName = `${this.source.givenName} ${this.source.familyName}`;
    }
  }

  @action
  openActionModal() {
    // this.source.familyName = 'changed name';
    try {
      this.source.save();
    } catch (err) {
      console.log(err);
    }
  }

  @action
  saveSource() {
    console.log('saving source');
  }
}

// https://guides.emberjs.com/release/models/creating-updating-and-deleting-records/
// rollbackAttributes()
