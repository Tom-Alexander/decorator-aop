# decorator-aop

Javascript aspect orientated programming with ES7 decorators.

## Installation
```
npm install decorator-aop
```

## Usage

Assign the class to the aspect.

```
@Aspect.target(Example)
class ExampleAspect extends Aspect {
}
```

### Join points
Use the following decorators to register join points on the aspect.

#### Before

```
@Aspect.before('myMethod')
doBeforeMyMethod(target, args) {
  console.log('executed before myMethod is called');
}
```

#### After

```
@Aspect.after('myMethod')
doAfterMyMethod(target, args) {
  console.log('executed after myMethod is called');
}
```

#### Intercept

```
@Aspect.intercept('myMethod')
doInterceptMyMethod(target, args, proceed) {
  console.log('intercept the execution of myMethod');
  return proceed.apply(target, args);
}
```
