
import AOP from '../AOP';
import {StubClass} from './StubClass';

@AOP.target(StubClass)
export class StubBeforeAspect extends AOP.Aspect {
  @AOP.before('stubBeforeMethod')
  stubBeforeJoin() {}
}

@AOP.target(StubClass)
export class StubAfterAspect extends AOP.Aspect {
  @AOP.after('stubAfterMethod')
  stubAfterJoin() {}
}

@AOP.target(StubClass)
export class StubInterceptAspect extends AOP.Aspect {

  stubBeforeJoin() {}

  @AOP.intercept('stubInterceptMethod')
  stubInterceptJoin(target, args, proceed) {
    this.stubBeforeJoin();
    return proceed.apply(target, args);
  }

}
