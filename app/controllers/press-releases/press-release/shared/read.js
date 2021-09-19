import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;

  @tracked collaborators;
}
