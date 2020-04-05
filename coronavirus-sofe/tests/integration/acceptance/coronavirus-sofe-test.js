import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | super rentals', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.owner.setupRouter();
  });

  test('testing the nav-bar', async function(assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav img').hasAttribute('src', '../assets/images/corona-logo.png');
    assert.dom('nav img').hasAttribute('alt', 'Corona logo');

    await click('nav a.menu-index');
    assert.equal(currentURL(), '/');
  });

});
