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

> Overview - The Template for Success in Template Management

## Compatibility with Angular Versions

<table>
  <thead>
    <tr>
      <th>@ngneat/overview</th>
      <th>Angular</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        5.x
      </td>
      <td>
        >= 16
      </td>
    </tr>
    <tr>
      <td>
        4.x
      </td>
      <td>
        >= 14 < 16
      </td>
    </tr>
    <tr>
      <td>
        3.x
      </td>
      <td>
        >= 13 < 14
      </td>
    </tr>
    <tr>
      <td>
        2.x
      </td>
      <td>
        >= 11 < 13
      </td>
    </tr>
  </tbody>
</table>

## Installation

```bash
npm i @ngneat/overview
yarn add @ngneat/overview
```

## Table of Contents

- [DynamicView](#DynamicContent)
- [Teleporting](#Teleporting)
- [ViewService](#ViewService)
    - [createView](#createView)
    - [createComponent](#createComponent)
    - [createTemplate](#createTemplate)

## `DynamicView`

Use the `dynamicView` structural directive to render a component, a template, HTML, or default template dynamically.

Let’s say we build a generic error component. What we want is to give our consumers the flexibly to create it by using one of three options:

- They can choose to use the default template
- They can choose to use their own text which can be static or dynamic
- They can choose to pass their own template or component

```ts
import { DynamicViewModule, Content } from '@ngneat/overview';

@Component({
  template: `
    <div *dynamicView="view">
      Default view
    </div>
  `,
  standalone: true,
  imports: [DynamicViewModule]
})
export class ErrorComponent {
  @Input() view: Content | undefined;
}
```
You can also pass a `context` or an [`injector`](https://angular.io/api/core/Injector) as `inputs` to the directive:

```html
<h5>Component</h5>
<ng-container *dynamicView="component; 
    injector: myInjector; 
    context: { $implicit: 'my title' }"/>

<h5>Template</h5>
<ng-template #tpl let-title>
  <b>{{ title }}</b>
</ng-template>

<ng-container *dynamicView="tpl; context: { $implicit: 'my title' }"/>
```

If you pass `context` to a component and the value can be accessed via the `injectViewContext` function:

```ts
import { injectViewContext } from '@ngneat/overview';

interface Context {
  title: string;
}

@Component({
  template: `<div>{{ context().title }}</div>`,
  standalone: true
})
export class MyDynamicComponent {
    context: Signal<Context> = injectViewContext<Context>();
}
```

`injectViewContext` returns a readonly signal with the view's context object.

## `Teleporting`

Teleporting means rendering a view at a different location from its declaration. There are two cases it might be helpful: 

- Avoid prop drilling to a nested component.
- Rendering a view at another place in the DOM while keeping its context where it’s defined.

You can read more about this approach in this [article](https://netbasal.com/beam-me-up-scotty-on-teleporting-templates-in-angular-a924f1a7798).


Use the `teleportOutlet` directive to define a new `outlet`. An `outlet` is an anchor where the view will be projected as a sibling.

```typescript
import { TeleportModule } from '@ngneat/overview';

@Component({ 
  template: `
    <div class="flex">
      <ng-container teleportOutlet="someId"/>
    </div>
  `,
  standalone: true,
  imports: [TeleportModule]
})
export class FooComponent {}
```

Use the `teleportTo` directive to `teleport` the view to a specific `outlet`:

```typescript
import { TeleportModule } from '@ngneat/overview';

@Component({ 
  template: `
   <section *teleportTo="someId">
      {{ value }}
    </section>
  `,
  standalone: true,
  imports: [TeleportModule]
})
export class BarComponent {
  value = '...'
}
```

## ViewService
The `ViewService` provides `facade` methods to create modular views in Angular. It's been used in various projects like [hot-toast](https://github.com/ngneat/hot-toast), and [helipopper](https://github.com/ngneat/helipopper). 

### `createComponent`
The `createComponent` method takes a `Component`, and returns an instance of `CompRef`:

```ts
import { ViewService, CompRef } from '@ngneat/overview';

@Injectable()
class ToastService {
  private viewService = inject(ViewService);
  componentRef: CompRef;

  init() {
   this.componentRef = this.viewService
      .createComponent(HotToastContainerComponent)
      .setInput('defaultConfig', defaultConfig)
      .appendTo(document.body);
  }
}
```

There are cases where we want to use an Angular [component](https://netbasal.com/using-angular-components-with-third-party-libraries-522a1f33003) template in a third-party library that takes a native DOM element or a string. In this case, we can use the `getRawContent` or the `getElement` method, respectively.

```ts
import {ViewService} from '@ngneat/overview';

@Directive()
class ChartDirective {
    private viewService = inject(ViewService);

    createChart(color: string) {
        const ref = this.viewService
            .createComponent(FooTooltip)
            .setInput('color', color)
            .detectChanges(document.body);

        const content = ref.getRawContent();

        ref.destroy();

        Highcharts.chart('container', {
            tooltip: {
                formatter: function () {
                    return content;
                },
                useHTML: true
            },
        });
    }
}
```


#### `createComponent` Options

```ts
createComponent<Comp, Context>(component: Type<Comp>, {
  injector?: Injector,
  environmentInjector?: EnvironmentInjector,
  context?: Context,
  vcr?: ViewContainerRef,
})
```

### `createTemplate`
The `createTemplate` method takes a `TemplateRef`, and returns an instance of `ViewRef`.

```ts
createTemplate<Context>(tpl: TemplateRef<Context>, {
  context?: Context,
  vcr?: ViewContainerRef,
  injector?: Injector,
})
```

### `createView`
The `createView` method takes a `Component`, a `TemplateRef` or a `string`, and creates a `View`:

```ts
import { ViewService, Content } from '@ngneat/overview';

@Injectable()
class ToastService {
  private viewService = inject(ViewService);

  createToast(content: Content) {
    const ref = this.viewService.createView(content);
    document.body.appendChild(ref.getElement());
  }
}
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
