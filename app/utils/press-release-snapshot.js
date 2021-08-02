import { tracked } from '@glimmer/tracking';

function serializePublicationChannels(publicationChannels) {
  let publicationChannelsStringArray = [];
  let publicationChannelsString = '';

  publicationChannelsStringArray = publicationChannels.map(channel => channel.uri);

  publicationChannelsString = publicationChannelsStringArray
                                .sort()
                                .join('+');

  return publicationChannelsString;
}

/**
 * Snapshot of a PressRelease (Pers bericht) record and related records to keep track of changes,
 * because ember-data lacks dirty tracking for relationships and attributes of type 'array'.
 *
 * Contains application-specific logic to track the dirty state of relationships.
 * If the model of a PressRelease changes in the future, this class will probably require an update as well.
*/
export default class PressReleaseSnapshot {
  @tracked pressRelease;
  @tracked publicationChannels;
  @tracked publicationChannelsContent = [];

  constructor(pressRelease) {
    this.pressRelease = pressRelease;
  }


  async commit() {
    this.publicationChannels = await this.pressRelease.publicationChannels;
    this.publicationChannelsContent = this.publicationChannels.map(channel => channel);
  }

  /**
   * Compares the snapshotted state of the PressRelease record with the current state.
   * Returns true if there is a difference.
  */
  async isDirty() {
    return this.pressRelease.hasDirtyAttributes ||
      serializePublicationChannels(this.publicationChannelsContent) !== serializePublicationChannels(await this.pressRelease.publicationChannels);
  }

  /**
   * Rollback the PressRelease record to the snapshotted state.
  */
  async rollback() {
    this.pressRelease.rollbackAttributes();
    this.pressRelease.publicationChannels = this.publicationChannelsContent;
  }

  async save() {
    await Promise.all([
      this.pressRelease.publicationChannels.save(),
    ]);

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
