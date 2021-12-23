'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-string-helpers': {
      only: ['capitalize', 'html-safe', 'uppercase']
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
    fingerprint: {
      exclude: ['tinymce/**/**'],
    },
  });

  /*
  ******************
  **** Tiny MCE ****
  ******************
  */
  const tinymceIcons = new Funnel('node_modules/tinymce/icons', {
    destDir: 'tinymce/icons',
  });

  const tinymcePlugins = new Funnel('node_modules/tinymce/plugins', {
    destDir: 'tinymce/plugins',
  });

  const tinymceSkins = new Funnel('node_modules/tinymce/skins', {
    destDir: 'tinymce/skins',
  });

  const tinymceThemes = new Funnel('node_modules/tinymce/themes', {
    destDir: 'tinymce/themes',
  });

  app.import('node_modules/tinymce/tinymce.js', {
    using: [{ transformation: 'cjs', as: 'tinymce/tinymce' }],
  });
  /*
  ******************
  **** Tiny MCE ****
  ******************
  */

  app.import('node_modules/@kanselarij-vlaanderen/au-kaleidos-icons/iconfont/icons.css');

  const iconAssets = new Funnel('node_modules/@kanselarij-vlaanderen/au-kaleidos-icons', {
    srcDir: '/iconfont',
    include: ['*.woff2', '*.woff', '*.ttf'],
    destDir: '/assets'
  });

  const fontAssets = new Funnel('node_modules/@kanselarij-vlaanderen/au-kaleidos-css', {
    srcDir: '/fonts',
    include: ['*.woff2', '*.woff'],
    destDir: '/assets/fonts'
  });

  return app.toTree([
    tinymceIcons,
    tinymcePlugins,
    tinymceSkins,
    tinymceThemes,
    iconAssets,
    fontAssets]);
};
