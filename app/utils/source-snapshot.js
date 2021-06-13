import { tracked } from '@glimmer/tracking';

function serializePublicationChannels(medium) {
  const publicationChannels = (medium.publicationChannels || []).slice(0);
  publicationChannels.sort();
  return publicationChannels.join('+');
}

function deserializePublicationChannels(channels) {
  return channels.split('+');
}

/**
 * Snapshot of a Source (Contact) record and related records to keep track of changes,
 * because ember-data lacks dirty tracking for relationships and attributes of type 'array'.
 *
 * Contains application-specific logic to track the dirty state of relationships.
 * If the model of a Source changes in the future, this class will probably require an update as well.
*/
export default class SourceSnapshot {
  @tracked source;
  @tracked telephone;
  @tracked telephonePublicationChannels;
  @tracked mobilePhone;
  @tracked mobilePhonePublicationChannels;
  @tracked mailAddress;
  @tracked mailAddressPublicationChannels;
  @tracked organization;
  @tracked status;

  constructor(source) {
    this.source = source;
  }

  /**
   * Commits the current state of the source record.
   *
   * Assumes relations to telephone, mobile-phone and mail-address are stable.
   * I.e. these relations are established on creation and won't change.
   * Only the attributes of the related records change.
  */
  async commit() {
    this.organization = await this.source.organization;
    this.status = await this.source.status;
    this.telephone = await this.source.telephone;
    this.telephonePublicationChannels = serializePublicationChannels(this.telephone);
    this.mobilePhone = await this.source.mobilePhone;
    this.mobilePhonePublicationChannels = serializePublicationChannels(this.mobilePhone);
    this.mailAddress = await this.source.mailAddress;
    this.mailAddressPublicationChannels = serializePublicationChannels(this.mailAddress);
  }

  /**
   * Compares the snapshotted state of the Source record with the current state.
   * Returns true if there is a difference.
  */
  async isDirty() {
    const organization = await this.source.organization;
    const status = await this.source.status;
    return this.source.hasDirtyAttributes
      || this.telephone.hasDirtyAttributes
      || this.mobilePhone.hasDirtyAttributes
      || this.mailAddress.hasDirtyAttributes
      || this.telephonePublicationChannels != serializePublicationChannels(this.telephone)
      || this.mobilePhonePublicationChannels != serializePublicationChannels(this.mobilePhone)
      || this.mailAddressPublicationChannels != serializePublicationChannels(this.mailAddress)
      || (this.organization && organization && this.organization.uri != organization.uri)
      || (this.status && status && this.status.uri != status.uri);
  }

  /**
   * Rollback the Source record to the snapshotted state.
  */
  async rollback() {
    this.telephone.rollbackAttributes();
    this.telephone.publicationChannels = deserializePublicationChannels(this.telephonePublicationChannels);
    this.mobilePhone.rollbackAttributes();
    this.mobilePhone.publicationChannels = deserializePublicationChannels(this.mobilePhonePublicationChannels);
    this.mailAddress.rollbackAttributes();
    this.mailAddress.publicationChannels = deserializePublicationChannels(this.mailAddressPublicationChannels);
    this.source.rollbackAttributes();
    this.source.organization = this.organization;
    this.source.status = this.status;
  }

  async save() {
    await Promise.all([
      this.telephone.save(),
      this.mobilePhone.save(),
      this.mailAddress.save()
    ]);

    const now = new Date();
    if (this.source.isNew) {
      this.source.created = now;
    }
    this.source.modified = now;
    await this.source.save();

    // Set saved state as new committed state to track changes for
    await this.commit();
  }
}
