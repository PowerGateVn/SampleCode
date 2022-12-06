# Rangle.io Angular 2 Guidelines

_An opinionated but pragmatic approach to writing large-scale Angular 2 applications._

## Preface

This document outlines the conventions and patterns we use to build Angular 2 applications. It is intended to address problems faced when writing non-trivial applications that require significant developer effort to maintain. As such, it is primarily concerned with code style **consistency**, **readability** and **maintainability**.

This style guide is a living document <sup>[1](#footnote1)</sup>. We welcome new ideas and perspectives on improving it. Feel free to contribute by opening issues, forking, cloning, branching, committing, pushing, PR-ing, etc…

## Table of Contents

1. Basic Rules
2. Naming Conventions
3. Directory Structure
4. Modules
5. Components
6. Templates
7. Services
8. Directives
9. Dependency Injection (DI)
10. Routing
11. Testing
12. Packaging
13. Notes About Typescript


## 1 Basic Rules

_As applications grow in size and functionality, it often feels like the ensuing rise in complexity is beyond proportional. It becomes very difficult to reason about how one logical part of the system affects another, making any change a challenge to predict. To manage the complexity we're faced with in these situations, we apply a lot of thought to the application's architecture. The following is an overview of our preferred architectural patterns and serves to inform the rest of the guidelines._

### 1.1 Prefer reference and state immutability

- **Use** `const` bindings when declaring references.
- **Use** [Immutable](https://facebook.github.io/immutable-js/)'s efficient persistent data structures.
- Reduces the "book-keeping" burden (both mental and technical kinds) of having to track mutations and their sources.


```js
// avoid
function addToFavourites(favouritesList, newFavouriteUser) {
  // mutate the old favourites list to add a new favourite
  favouritesList.push(newFavouriteUser);
}

function addFollower(user, follower) {
  let ret;

  ret = user.update('followers', (oldList) => oldList.push(follower));
  ret = user.set('hasNewFollower', true);

  return ret;
}


// good
function addToFavourites(favouritesList, newFavouriteUser) {
  // return a new favourites list with the new favourite appended
  return favouritesList.concat([newFavouriteUser]);
}

function addFollower(user, follower) {  
  const updatedUser = user.update('followers', (oldList) => oldList.push(follower));
  const updatedUserWithFlag = user.set('hasNewFollower', true);

  return updatedUserWithFlag;
}
```

### 1.2 Prefer small functions as a primary means of abstraction

- Simplifies understanding program operations and execution along with programmer intent.
- Maximizes reuse of code through granularity of abstractions.

```js
// avoid
const newMember = new User();
newMember.setName(fullName);
newMember.setEmail(email);

const newTeam = TeamsManager.get(team);
newTeam.invite(newMember);


// avoid
function invite(team, { fullName, email }) {
  const names = fullName.split(' ');

  const newMember = {
    no: team.length
    firstName: names[0],
    lastName: names[1],
    joinedOn: new Date(),
  };

  const newTeam = team.concat([newMember]);

  return newTeam;
}


// good
function createUser(fullName, email) {
  const names = fullName.split(' ');

  return {
    firstName: names[0],
    lastName: names[1],
    joinedOn: new Date(),
  };
}

function addToTeam(team, candidate) {
  const newMember = Object.assign(
    {},
    { no: team.length },
    candidate
  );

  return team.concat([newMember]);
}

function invite(team, { name, email }) {
  const newUser = createUser(name, email);
  const newTeam = addToTeam(team, newUser);

  return newTeam;
}
```

### 1.3 Consider passing side-effect producing objects as parameters

- Removes reliance on environment-specific globals.
- Allows for easier testing of functions with side-effects.

```js
// avoid
function saveUser(user) {
  localStorage.set('user', user);
}

function getRecords() {
  return fetch.get('/records')
              .then(function(response) {
                return response.json()
              });
}


// prefer
function saveUser(store, user) {
  store('user', user);
}

function getRecords(http) {
  return http.get('/records')
             .then(function(response) {
               return response.json()
             });
}
```

### 1.4 Prefer Redux for state management

- **Use** the actual [Redux](https://github.com/reactjs/redux) library and/or framework-specific wrappers like [ng2-redux](https://github.com/wbuchwalter/ng2-redux).
- Allows for predictable state management.

## 2 Naming conventions

### 2.1 Use a consistent and predictable style for filenames

- **Use** the feature name in the filename or the folder name when leveraging `index.ts` files.
- (optional) **Consider** adding the feature type as a suffix to the feature name.
- **Use** dashes to separate words.
- **Use** a dot-separated `test` suffix to indicate test files.

```
// avoid
/src/components/navigator/navigation_bar.ts


// avoid
/src/components/navigator/navigation-bar-test.ts


// good
/src/components/modal/index.ts  // implement model component here


// good
/src/components/modal/index.ts // export `modal.ts` here
/src/components/modal/modal.ts


// good
/src/components/modal/modal.component.ts
```

### 2.2 Use upper CamelCase for classes (i.e. components, services and pipes definitions)

```js
// avoid
class button {}


// good
class Button {}
```

### 2.3 Use lower camelCase for variables, function names, class instances, directive selectors, property bindings, event bindings, template variables and template element attributes

```js
// avoid
const UserList = [ ... ]
function CalculateTax(...) {}
<my-cmp *ng-if="cond"\>
<my-cmp [my-prop]="exp"\>
<my-cmp (my-event)="action()"\>
<my-cmp [(my-prop)]="prop"\>
<my-cmp #my-cmp\>
<template ng-for #my-item [ng-for-of]=items #my-index="index">

// good
const userList = [ ... ];
function calculateTax(...) {}
<my-cmp *ngIf="cond">
<my-cmp [myProp]="exp">
<my-cmp (myEvent)="action()">
<my-cmp [(myProp)]="prop">
<my-cmp #myCmp>
<template ngFor #myItem [ngForOf]=items #myIndex="index">
```

### 2.4 Use lower kebab-case for Angular 2 component selectors

- Allows browsers to interpret them as custom elements

```js
// avoid
@Component({
  selector: 'mdButton',
})
class MdButton {
}


// good
@Component({
  selector: 'md-button',
})
class MdButton {
}
```

## 3 Directory structure

_As far as folder structures go, this one has a healthy suspicion of deep and nested hierarchies. Things are grouped according to their functions in the architecture rather than their functions in the application. This may all sound controversial but it's effective. As application functionality changes and evolves, code is adapted along the architecture's communication boundaries. We make change in the context of how small parts fit into the whole and this directory structure is meant to reflect that fact. It is an adaptive pattern that make complex changes more tractable and prevents unnecessary coupling (usually brought upon by proximity and convenience)._

```
src
├── actions
│   ├── cart-actions.ts
│   ├── order-history-actions.ts
│   ├── profile-actions.ts
│   ├── store-front-actions.ts
│   └── ...
├── assets
│   ├── brand-logo.svg
│   └── ...
│── components
│   ├── search-bar
│   │   ├── search-bar.css
│   │   ├── search-bar.html
│   │   ├── search-bar.test.ts
│   │   └── index.ts
│   ├── product-card
│   │   ├── product-card.css
│   │   ├── product-card.html
│   │   ├── product-card.test.ts
│   │   └── index.ts
│   └── button
│       ├── button.css
│       ├── button.html
│       ├── button.test.ts
│       └─ index.ts
├── constants
│   ├── cart-constants.ts
│   ├── order-history-constants.ts
│   ├── profile-constants.ts
│   ├── store-front-constants.ts
│   ├── ...
│   └── index.ts
├── containers
│   ├── app.ts
│   ├── cart.ts
│   ├── order-history.ts
│   ├── profile.ts
│   ├── store-front.ts
│   └── ...
├── reducers
│   ├── cart-reducer.ts
│   ├── order-history-reducer.ts
│   ├── profile-reducer.ts
│   ├── store-front-reducer.ts
│   ├── ...
│   └── index.ts
├── store
│   ├── configure-store.ts
│   ├── ...
│   └── index.ts
├── services
│   ├── api-service.ts
│   ├── models-service.ts
│   ├── order-management-service.ts
│   └── ...
├── pipes
│   ├── currency-pipe.ts
│   └── ...
└── utils
    ├── api-client.ts
    ├── api-client.test.ts
    ├── models.ts
    ├── models.test.ts
    ├── currency.ts
    ├── currency.test.ts
    ├── order-management.ts
    ├── order-management.test.ts
    └── ...

```

- **utils:** contains the majority of business logic, implemented as plain JavaScript libraries, and is the initial source of application functionality (see <a href="#packaging">Packaging</a> for advice on managing growth and changes in this folder).

- **actions:** contains Redux action helpers that heavily utilize `/utils` libraries in order to dispatch actions.

- **assets:** contains non-code assets to be bundled with the application.

- **components:** contains state-less view components that take data "from above" and present a UI.

- **containers:** contains stateful, and often routable, components that pass down data and behaviour-encapsulating callbacks to presentational components (and sometimes other containers).

- **constants:** contains Redux constants which are typically action types.

- **reducers:** contains Redux reducers that respond to dispatched actions and leverage models and data manipulation functions from `/utils` to execute application state transitions.

- **store:** contains helpers that build a Redux store.

- **services:** contains `/utils` libraries wrapped in Angular 2 services to take advantage of dependency injection, where appropriate.

- **pipes:** contains `/utils` libraries wrapped in Angular 2 pipes to be executed directly on templates, where appropriate.

## 4. Modules

### 4.1 Use ES6 modules

- **Use** a transpiler for larger browser support.
- **Consider** exporting only one thing per file using the `default` keyword and exposing them as a library using an index file.
- **Prefer** grouping all dependency imports together at the top of the file.
- **Prefer** grouping all exports at the bottom of the file.

## 5. Components

### 5.1 Prefer stateless components

- Keeps state management in Redux (and out of Angular) as much as possible.
- Pass properties and event handlers down.
- **Prefer** adding an `on` prefix to event handlers.


### 5.2 Use a prefix for component selectors

- Prevents name collisions in the templates.

```js
// avoid
@Component({
  selector: 'button',
  ...
})
class Button {}


// good
@Component({
  selector: 'rio-button',
  ...
})
class Button {}

```

### 5.3 Consider external template files

- **Use** `templateUrl` when depending on external template files.
- Eases management of template when using markup over strings.

### 5.4 Prefer `@Input` and `@Output` decorators over their `@Component` properties.

When declaring component inputs and outputs, prefer the decorator version.

```typescript
// Avoid
@Component({
  // ...
  inputs: [ foo, bar ],
  outputs: [ quux]
})
class MyComponent {
  foo: number;
  bar: string;
  quux: EventEmitter<string>;
}

// Prefer:
@Component({
  // ...
})
class MyComponent {
  @Input() foo: number;
  @Input() bar: string;
  @Output() quux: EventEmitter<string>;
}
```

* It's DRY-er: you no longer have to declare the 'input-ness' and the member variable in two different places.
* It associates the type with the input in one easily-readable location
(preferably at the top of your component class).

## 6. Templates

### 6.1 Use one-way data binding

- Keeps data changes predictable and in-sync

### 6.2 Avoid referencing local template variables

### 6.3 Avoid side-effects in template expressions

### 6.4 Use the `NgClass` directive for managing multiple class names at the same time

### 6.5 Use the `NgStyle` directive when setting several inline styles at the same time

### 6.6 Use property binding with `ngSwitch`

### 6.7 Use an asterisk (*) in front of `ngSwitchWhen` and `ngSwitchDefault`

## 7. Services

### 7.1 Avoid depending on services in stateless view components

## 8. Directives

### 8.1 Use attribute selectors

## 9. Dependency Injection (DI)

### 9.1 Use `@Injectable()` on all service definitions

- Maintains consistency.
- Prevents subtle bugs when a dependency is added later.

## 10. Routing

### 10.1 Use containers as component routers

## 11. Testing

- All code, with the exception of `/components` and `/containers`, can be tested using framework-agnostic testing tools.

## 12. Packaging

- As libraries in the `/utils` folder mature, it is recommended that you bundle and version them as external npm packages. In the ideal case, your business logic is brought into your application as a collection of independent npm packages and your application only uses Angular and Redux to render it's UI.

## 13. Notes About Typescript

- A decoupled codebase typically results in less cohesions between the different parts. Type definitions in the form of interfaces make implicit contracts between those parts explicit and allows for tooling that helps catch "integration" bugs.

## Footnotes

<sup>1</sup> Since Angular 2 is so young (in beta at the time of writing), this document is especially alive. It’s likely to undergo many revisions over the next months as we and the community gain experience with Angular 2. Please check back regularly. <a name="footnote1">↩</a>

## License

(The MIT License)

Copyright (c) 2015-2016 Rangle.io

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
