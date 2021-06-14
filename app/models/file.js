import Model, { attr, belongsTo } from '@ember-data/model';

export default class FileModel extends Model {
  @attr('string') name;
  @attr('string') format;
  @attr('number') size;
  @attr('string') extension;
  @attr('datetime') created;

  @belongsTo('press-release') pressRelease;
  @belongsTo('file', { inverse: null }) download;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }

  get namedDownloadLink() {
    return `${this.downloadLink}?name=${encodeURIComponent(this.name)}`;
  }

  get humanReadableSize() {
    const bytes = this.size;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) {
      return '0 byte';
    } else {
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
  }
}
