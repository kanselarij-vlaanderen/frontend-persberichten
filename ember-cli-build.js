'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-string-helpers': {
      only: ['capitalize', 'html-safe']
    },
    'ember-dayjs': {
      locales: ['nl-be'],
      plugins: ['relativeTime']
    },
    sassOptions: {
      extension: 'scss',
      includePaths: [
        'node_modules/@kanselarij-vlaanderen/au-kaleidos-css/'
      ],
    },
  });

  app.import('node_modules/@kanselarij-vlaanderen/au-kaleidos-icons/iconfont/icons.css'); // imported to /assets by default
  app.import('node_modules/@kanselarij-vlaanderen/au-kaleidos-icons/iconfont/icons.woff2', {
    destDir: 'assets' // font files need to be next to their css file, because the css font-file references them hardcoded
  });
  app.import('node_modules/@kanselarij-vlaanderen/au-kaleidos-icons/iconfont/icons.woff', {
    destDir: 'assets' // font files need to be next to their css file, because the css font-file references them hardcoded
  });
  app.import('node_modules/@kanselarij-vlaanderen/au-kaleidos-icons/iconfont/icons.ttf', {
    destDir: 'assets' // font files need to be next to their css file, because the css font-file references them hardcoded
  });

  return app.toTree();
};
