import Application from 'frontend-persberichten/app';
import config from 'frontend-persberichten/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
