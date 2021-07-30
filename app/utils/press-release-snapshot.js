import { tracked } from '@glimmer/tracking';

function serializePublicationChannels(publicationChannels) {
  let publicationChannelsStringArray = [];
  let publicationChannelsString = '';
  if (publicationChannels.length) {
    publicationChannels.forEach(channel => publicationChannelsStringArray.push(channel.uri));
  }
  publicationChannelsString = publicationChannelsStringArray
                                .sort((a, b) => a > b ?  1 : -1)
                                .join("+");

  return publicationChannelsString;
}

function setInitialPublicationChannels(pressReleasePublicationChannels) {
  let publicationChannelsArray = [];
  if (pressReleasePublicationChannels.length) {
    pressReleasePublicationChannels.forEach(channel => publicationChannelsArray.pushObject(channel));
  }
  return publicationChannelsArray;
}

function getInitialPublicationChannels(initialPublicationChannels, publicationChannels) {
  if (initialPublicationChannels.length) {
    initialPublicationChannels.forEach(channel => publicationChannels.pushObject(channel));
  }
  return publicationChannels;
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
  @tracked pressReleasePublicationChannels = [];
  @tracked pressReleasePublicationEvent;
  @tracked initialPressReleasePublicationChannels = [];
  @tracked initialPressReleasePublicationChannelsContents = '';

  constructor(pressRelease) {
    this.pressRelease = pressRelease;
  }


  async commit() {
    this.pressReleasePublicationChannels = await this.pressRelease.publicationChannels;
    this.pressReleasePublicationEvent = await this.pressRelease.publicationEvent;
    this.initialPressReleasePublicationChannelsContents = serializePublicationChannels(this.pressReleasePublicationChannels);
    this.initialPressReleasePublicationChannels = setInitialPublicationChannels(this.pressReleasePublicationChannels);
    // commit changes when pressRelease gets relations => e.g. source-snapshop.js
  }

  /**
   * Compares the snapshotted state of the PressRelease record with the current state.
   * Returns true if there is a difference.
  */
  async isDirty() {
    return this.pressRelease.hasDirtyAttributes
      || this.initialPressReleasePublicationChannelsContents !== serializePublicationChannels(this.pressReleasePublicationChannels);
  }

  /**
   * Rollback the PressRelease record to the snapshotted state.
  */
  async rollback() {
    this.pressReleasePublicationChannels.clear();
    this.pressRelease.rollbackAttributes();
    this.pressReleasePublicationChannels = getInitialPublicationChannels(this.initialPressReleasePublicationChannels, this.pressReleasePublicationChannels);
  }

  async save() {
    let pressReleasePublicationEvent = await this.pressRelease.publicationEvent;
    let publicationEventPublicationChannels;
    if(pressReleasePublicationEvent) {
      let publicationEventPublicationChannels = await pressReleasePublicationEvent.publicationChannels;
      this.pressReleasePublicationChannels.forEach(channel => publicationEventPublicationChannels.pushObject(channel));
    }
    await Promise.all([
      this.pressReleasePublicationChannels.save(),
      publicationEventPublicationChannels ? publicationEventPublicationChannels.save() : null,
      pressReleasePublicationEvent ? pressReleasePublicationEvent.save() : null
    ]);

    this.pressRelease.publicationEvent = pressReleasePublicationEvent;
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
