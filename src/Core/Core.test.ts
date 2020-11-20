import { expect } from 'chai';
import { Core } from './Core';
import { JSDOM } from 'jsdom';
import { defaultCoreState } from './defaultCoreState';

const DOM = new JSDOM('<html><body></body></html>');
const document = DOM.window.document;

describe('Core', () => {
  it ('when init sets the default state', () => {
    const core = new Core();

    expect(core.getState()).to.deep.equal(defaultCoreState);
  })
})