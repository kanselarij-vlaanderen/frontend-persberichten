import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SourcesNewController extends Controller {
  @service router;
  @service store;

  source;

  @action
  renderNewSource() {
    this.source = null;
    this.source = this.store.createRecord('contact');
  }

  @action
  navigateToSource() {
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
  async createSource() {
    // first create nested rels
    // const phone = await this.store.createRecord('mobile-phone', {
    //   number: '0404432132144',
    // });
    this.source.created = new Date();
    this.source.modified = new Date();
    console.log(this.source.modified);
    this.source.contactStatus = 'actief';
    try {
      console.log('saving source');
      this.source.save().then(() => this.router.transitionTo('sources.active'));
    } catch (err) {
      console.log(err);
    }
  }
}
