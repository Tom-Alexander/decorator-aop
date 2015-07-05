import {Aspect, before, after, intercept, target} from '../dist';

class MySQL {
  query(sql) {
    console.log(sql);
    return 'done!';
  }
}

@target(MySQL)
export default class MySQLAspect extends Aspect {

  @before('query')
  doBefore(target, args) {
    console.log('before aspect');
  }

  @after('query')
  doAfter(target, args) {
    console.log('after aspect');
  }

  @intercept('query')
  doInterception(target, args, proceed) {
    console.log('before intercept');
    let returned = proceed.apply(target, args);
    console.log('after intercept');
    return returned;
  }

}
