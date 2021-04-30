/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  //see https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data/issues/52
  process.env.GIT_DISCOVERY_ACROSS_FILESYSTEM=1;
  let ENV = {
    build: {
      environment: 'production'
    },
    'ssh-index': { // copy and deploy index.html
      username: 'root',
      host: 'persberichten-dev.s.redpencil.io',
      port: 22,
      remoteDir: '/data/app-persberichten-dev/persberichten-app',
      allowOverwrite: true,
      agent: process.env.SSH_AUTH_SOCK
    },
    'rsync': { // copy assets
      host: 'root@persberichten-dev.s.redpencil.io',
      port: 22,
      dest: '/data/app-persberichten-dev/persberichten-app',
      delete: false,
      arg:['--verbose']
    }
  };



  // if (deployTarget === 'production') {
  //   //TODO:
  // }

  // if (deployTarget === 'controle') {
  //   ENV['ssh-index'].remoteDir = '/data/app-digitaal-loket-dev/controle-app';
  //   ENV['rsync']['dest']  = '/data/app-digitaal-loket-dev/controle-app';
  // }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
