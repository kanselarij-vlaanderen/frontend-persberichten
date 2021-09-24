import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
// import { later, cancel } from '@ember/runloop';

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;
  @service router;

  @tracked collaborators;
  @tracked editingUser;
  @tracked editingUserGroup;
  @tracked isEditPossible;
}
