import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ResourcesResourceController extends Controller {
  @service router;
  @service store;

  @tracked resource;

  @action
  async onLoadResource() {
    console.log('rendering');
    const resource = await this.store.findRecord(
      'contact',
      '38d04ce5-bbef-492f-b19d-0a5da640b2e9'
    );
    // const resource = await this.store.findRecord('contact', this.model.resource_id).catch(err => console.log(err));
    this.resource = resource;
  }

  @action
  navigateToResource() {
    this.resource.rollbackAttributes();
    this.router.transitionTo('resources.active');
  }

  @action
  onInput(target, value) {
    this.resource[target] = value;
    if (target === 'familyName' || target === 'givenName') {
      this.resource.fullName = `${this.resource.givenName} ${this.resource.familyName}`;
    }
  }

  @action
  openActionModal() {
    // this.resource.familyName = 'changed name';
    try {
      this.resource.save();
    } catch (err) {
      console.log(err);
    }
  }

  @action
  saveResource() {
    console.log('saving resource');
  }
}

// https://guides.emberjs.com/release/models/creating-updating-and-deleting-records/
// rollbackAttributes()
