import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  const inflector = Inflector.inflector;

  // Tell the inflector that the plural of "campus" is "campuses"
  inflector.irregular('contact-status', 'contact-status');
}

export default {
  name: 'custom-inflector-rules',
  initialize
};
