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
    //after table add source_id navigation
    const source = await this.store.findRecord(
      'contact',
      '60ADCEF2598BA10009000001'
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
    // delete comes here;
  }

  @action
  saveSource() {
    console.log('saving source');
    this.source.modified = new Date();
    try {
      this.source.save();
    } catch (err) {
      console.log(err);
    }
  }
}

// https://guides.emberjs.com/release/models/creating-updating-and-deleting-records/
// rollbackAttributes()
