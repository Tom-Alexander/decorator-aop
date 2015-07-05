import {
  StubAfterAspect,
  StubBeforeAspect,
  StubInterceptAspect} from './StubAspect';

import sinon from 'sinon';
import {describe, it} from 'mocha';
import {StubClass} from './StubClass';

describe('Decorators', () => {

  describe('Before', () => {
    it('should run the aspect method before executing the taget method', () => {
      let stubClass = new StubClass();
      let stubAspect = new StubBeforeAspect();
      let targetSpy = sinon.spy();
      let aspectSpy = sinon.spy(stubAspect, 'stubBeforeJoin');
      stubClass.stubBeforeMethod(targetSpy);
      sinon.assert.callOrder(aspectSpy, targetSpy);
    });
  });

  describe('After', () => {
    it('should run the aspect method after executing the taget method', () => {
      let stubClass = new StubClass();
      let stubAspect = new StubAfterAspect();
      let targetSpy = sinon.spy();
      let aspectSpy = sinon.spy(stubAspect, 'stubAfterJoin');
      stubClass.stubAfterMethod(targetSpy);
      sinon.assert.callOrder(targetSpy, aspectSpy);
    });
  });

  describe('Intercept', () => {
    it('should intercept the execution of the target method', () => {
      let stubClass = new StubClass();
      let stubAspect = new StubInterceptAspect();
      let targetSpy = sinon.spy();
      let aspectSpy = sinon.spy(stubAspect, 'stubInterceptJoin');
      let aspectSpyBefore = sinon.spy(stubAspect, 'stubBeforeJoin');
      stubClass.stubInterceptMethod(targetSpy);
      sinon.assert.callOrder(
        aspectSpy,
        aspectSpyBefore,
        targetSpy
        );
    });
  });

});
