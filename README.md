# adms-admissions-application-ui

This repository contains source code for [Admissions Application](https://apply.apps.asu.edu) project.

Admissions Application website is built on SPA (Single Page Application) concept where we use use VueJS@2 and Vite.

## URL(s)

Below are the URL(s) of different environments:

- [Live / Prod environment](https://apply.apps.asu.edu)
- [Staging / QA environment](https://apply-staging.apps.asu.edu)
- [Dev / Development environment](https://apply-dev.apps.asu.edu)

## Technology stack

This project leverages the following technologies/frameworks:

- VueJS@2
- Bootstrap@4
- BootstrapVue
- Yarn
- Fontawesome (Both Free & Pro - paid by EdPlus)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Tag manager plugin

- Add gtm and tealium code in index.html
- plugin is installed as a mixin and distributed globally with `this.$track({eventObject})`
- Event object must have the `"event", "name", "action", "type", "region", "text"` events and values must me lowercase

#### Tag manager example

```js
# triggering link event,name and action is not mandatory but will be overridden if its passes with the object
# do not pass the event name link if you want to use the default link trigger

this.$track({
    type: 'type',
    region: 'region',
    section: 'section',
    text: 'text',
    component: 'component',
})
```

```json
{
  "event": "link",
  "name": "onclick",
  "action": "click",
  "type": "type",
  "region": "region",
  "section": "section",
  "text": "text",
  "component": "component"
}
```

### Adding the new page

- Create the .vue file in `/views` folder
- Create the routes as object on `/routes/routes.json` with `path`,`name`,`component`
- Provide the path as value for newly created component in `component` field

### Defining layouts

- Default layout will be loaded if there is not layout defined on `/routes/routes.json`.
- if you want a specific layout to be loaded for a page `"layout": "../layouts/{_LayoutName_}.vue"`
- Create a different layout on `"{_LayoutName_}.vue"` in `/layouts/` folder
  > Note: for UG app layout the header and footer needs to be persisted across all the pages and subpages in this scenario do not import UG app as a layout. import the slot based layout in the parent route and all the children will have the same layout as the parent this will help in rerendering the ug app layout

> robots and sitemaps are generated only on build mode
