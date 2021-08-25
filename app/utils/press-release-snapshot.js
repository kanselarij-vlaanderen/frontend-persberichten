import { tracked } from '@glimmer/tracking';

function serializeRelation(relations) {
  return relations.map(relation => relation.uri).sort().join('+');
}

/**
 * Snapshot of a PressRelease (Pers bericht) record and related records to keep track of changes,
 * because ember-data lacks dirty tracking for relationships and attributes of type 'array'.
 *
 * Tracks relationship publicationChannels, governmentFields, sources, themes and attachments, to be able to find any changes, and detect those in the isDirty check.
 *
 * Contains application-specific logic to track the dirty state of relationships.
 * If the model of a PressRelease changes in the future, this class will probably require an update as well.
*/
export default class PressReleaseSnapshot {
  @tracked pressRelease;
  @tracked publicationChannels = [];
  @tracked governmentFields = [];
  @tracked themes = [];
  @tracked sources = [];
  @tracked attachments = [];

  constructor(pressRelease) {
    this.pressRelease = pressRelease;
  }


  async commit() {
    this.publicationChannels = (await this.pressRelease.publicationChannels).slice(0);
    this.governmentFields = (await this.pressRelease.governmentFields).slice(0);
    this.themes = (await this.pressRelease.themes).slice(0);
    this.sources = (await this.pressRelease.sources).slice(0);
    this.attachments = (await this.pressRelease.attachments).slice(0);
  }

  /**
   * Compares the snapshotted state of the PressRelease record with the current state.
   * Returns true if there is a difference.
  */
  async isDirty() {
    return this.pressRelease.hasDirtyAttributes
      || serializeRelation(this.publicationChannels) !== serializeRelation(await this.pressRelease.publicationChannels)
      || serializeRelation(this.governmentFields) !== serializeRelation(await this.pressRelease.governmentFields)
      || serializeRelation(this.themes) !== serializeRelation(await this.pressRelease.themes)
      || serializeRelation(this.sources) !== serializeRelation(await this.pressRelease.sources)
      || serializeRelation(this.attachments) !== serializeRelation(await this.pressRelease.attachments);
  }

  /**
   * Rollback the PressRelease record to the snapshotted state.
  */
  async rollback() {
    this.pressRelease.rollbackAttributes();
    this.pressRelease.publicationChannels = this.publicationChannels;
    this.pressRelease.governmentFields = this.governmentFields;
    this.pressRelease.themes = this.themes;
    this.pressRelease.sources = this.sources;

    // Destroys attachments that are added without saving
    const attachments = await this.pressRelease.attachments;
    await Promise.all(
      attachments.map(async attachment => {
        const isNewlyAdded = !this.attachments.includes(attachment);
        if (isNewlyAdded) {
          return await attachment.destroyRecord();
        } else {
          return null;
        }
      })
    );

    // Rollback on every attachment that is marked for deletion without saving
    this.attachments.forEach(attachment => {
      if (attachment.hasDirtyAttributes) {
        attachment.rollbackAttributes();
      }
    });

    this.pressRelease.attachments = this.attachments;
  }

  async save() {
    const publicationChannels = await this.pressRelease.publicationChannels;
    const publicationEvent = await this.pressRelease.publicationEvent;
    if (publicationEvent) {
      publicationEvent.publicationChannels = publicationChannels;
      await publicationEvent.save();
    }

    // Destroys the attachments (incl. file on disk)
    // for the attachments marked for deletion
    await Promise.all(
      this.attachments.map(async attachment => {
        if (attachment.isDeleted) {
          return await attachment.destroyRecord();
        } else {
          return null;
        }
      })
    );

    const now = new Date();
    if (this.pressRelease.isNew) {
      this.pressRelease.created = now;
    }
    this.pressRelease.modified = now;
    await this.pressRelease.save();

    // Set saved state as new committed state to track changes for
    await this.commit();
  }
}
