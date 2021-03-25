<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

[![npm](https://img.shields.io/npm/v/@ngneat/overview?style=flat-square)](https://www.npmjs.com/package/@ngneat/overview)
[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](https://github.com/ngneat/overview/blob/main/LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ngneat/overview/pulls)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)](https://github.com/ngneat/spectator)

> The Library Slogan

## Installation

You can install it through **npm**:

```bash
npm i @ngneat/overview
```

or with **yarn**:

```bash
yarn add @ngneat/overview
```

## Usage

### `DynamicContent`

This can be used to load component, template or HTML dynamically.

Import `DynamicContentModule` from `@ngneat/overview` in your `module`:

```typescript
import { DynamicContentModule } from '@ngneat/overview';

@NgModule({
  imports: [DynamicContentModule]
})
```

Then use in your template:

```html
<dynamic-content [content]="content"></dynamic-content>
```

`content` can be [`TemplateRef`](https://angular.io/api/core/TemplateRef), [`Component`](https://angular.io/api/core/Component), `string` or `HTML`:

```typescript
import { Content } from '@ngneat/overview';

@Component({ /*..*/ })
export class AppComponent {
  content: Content
}
```

### `Teleport`

This can be used to move an element to a different component.

Import `TeleportModule` from `@ngneat/overview` in your `module`:

```typescript
import { TeleportModule } from '@ngneat/overview';

@NgModule({
  imports: [TeleportModule]
})
```

Then use in your template:

```html
<!--
  <app-navbar></app-navbar> may have following template:
  <nav class="navbar">
  ...
  </nav>
-->

<app-navbar></app-navbar>

<button (click)="logout" *teleportTo="'.navbar'">Logout</button>
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com/"><img src="https://avatars.githubusercontent.com/u/6745730?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/@ngneat/overview/commits?author=NetanelBasal" title="Code">💻</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/shhdharmen"><img src="https://avatars.githubusercontent.com/u/6831283?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dharmen Shah</b></sub></a><br /><a href="#content-shhdharmen" title="Content">🖋</a> <a href="https://github.com/@ngneat/overview/commits?author=shhdharmen" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<div>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
