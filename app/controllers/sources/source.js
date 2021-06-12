import Controller from '@ember/controller';
import { task } from 'ember-concurrency-decorators';

export default class SourcesSourceController extends Controller {
  @task
  *saveSource() {
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
      this.model.modified = new Date();
      yield this.model.save();
    } catch (err) {
      console.log(err);
    }
  }
}
