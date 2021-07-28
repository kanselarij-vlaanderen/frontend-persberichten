import { tracked } from '@glimmer/tracking';

/**
 * Snapshot of a PressRelease (Pers bericht) record and related records to keep track of changes,
 * because ember-data lacks dirty tracking for relationships and attributes of type 'array'.
 *
 * Contains application-specific logic to track the dirty state of relationships.
 * If the model of a Source changes in the future, this class will probably require an update as well.
*/
export default class PressReleaseSnapshot {
  @tracked pressRelease;

  constructor(pressRelease) {
    this.pressRelease = pressRelease;
  }

  /**
   * Commits the current state of the source record.
   *
   * Assumes relations to telephone, mobile-phone and mail-address are stable.
   * I.e. these relations are established on creation and won't change.
   * Only the attributes of the related records change.
  */
  async commit() {
    // commit changes when pressRelease gets relations => e.g. source-snapshop.js
  }

  /**
   * Compares the snapshotted state of the Source record with the current state.
   * Returns true if there is a difference.
  */
  async isDirty() {
    return this.pressRelease.hasDirtyAttributes;
  }

  /**
   * Rollback the Source record to the snapshotted state.
  */
  async rollback() {
    this.pressRelease.rollbackAttributes();
  }

  async save() {

    const now = new Date();
    if (this.pressRelease.isNew) {
      this.pressRelease.created = now;
    }
    this.pressRelease.modified = now;
    await this.pressRelease.save();

    // Set saved state as new committed state to track changes for
    // commit only when there are relations
    // await this.commit();
  }
}
