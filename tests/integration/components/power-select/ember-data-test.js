import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import typeInSearch from '../../../helpers/type-in-search';
import mirageInitializer from '../../../../initializers/ember-cli-mirage';

/**
10 - Ember data integration
  a) [DONE] Passing as options of a `store.findAll` works.
  b) [DONE] Passing as options the result of `store.query` works.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Ember-data integration)', {
  integration: true,
  beforeEach() {
    mirageInitializer.initialize(this.container);
    this.store = this.container.lookup('service:store');
  }
});

test('Passing as options of a `store.findAll` works', function(assert) {
  let done = assert.async();
  server.createList('user', 10);

  this.users = this.store.findAll('user');
  this.render(hbs`
    {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    Ember.run(() => typeInSearch('2'));
    assert.equal($('.ember-power-select-option').length, 1, 'Filtering works');
    done();
  }, 10);
});

test('Passing as options the result of `store.query` works', function(assert) {
  let done = assert.async();
  server.createList('user', 10);

  this.users = this.store.query('user', { foo: 'bar' });
  this.render(hbs`
    {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    Ember.run(() => typeInSearch('2'));
    assert.equal($('.ember-power-select-option').length, 1, 'Filtering works');
    done();
  }, 10);
});