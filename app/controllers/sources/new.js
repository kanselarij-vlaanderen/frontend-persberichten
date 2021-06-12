import Controller from '@ember/controller';
import { task } from 'ember-concurrency-decorators';

export default class SourcesNewController extends Controller {
  @task
  *saveSource() {
    const now = new Date();
    this.model.created = now;
    this.model.modified = now;

    try {
      const telephone = yield this.model.telephone;
      const mobilePhone = yield this.model.mobilePhone;
      const mailAddress = yield this.model.mailAddress;

      // save related models first
      yield Promise.all([
        telephone.save(),
        mobilePhone.save(),
        mailAddress.save()
      ]);

      // save source
      yield this.model.save();

      this.transitionToRoute('sources.overview.active');
    } catch (err) {
      console.log(err);
    }
  }
}
