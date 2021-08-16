export function initialize(appInstance) {
  const intl = appInstance.lookup('service:intl');
  intl.locale = 'nl-be';
}

export default {
  initialize
};
