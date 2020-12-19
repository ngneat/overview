import { Injectable, InjectionToken, Injector } from '@angular/core';
import tippy, { Instance, Props } from 'tippy.js';
import { Content, isComponent, isTemplateRef, ViewOptions, ViewRef, ViewService } from '@ngneat/overview';

interface CreateOptions extends Partial<Props>, ViewOptions {}

export const TIPPY_REF = new InjectionToken('TIPPY_REF');

@Injectable({ providedIn: 'root' })
export class TippyService {
  constructor(private view: ViewService, private injector: Injector) {}

  create(host: Element, content: Content, options: CreateOptions): Instance {
    let view: ViewRef;

    const config = {
      $viewOptions: undefined,
      onShow: (instance) => {
        if (!config.$viewOptions) {
          config.$viewOptions = {};

          if (isTemplateRef(content)) {
            config.$viewOptions.context = {
              $implicit: instance.hide.bind(instance),
            };
          } else if (isComponent(content)) {
            config.$viewOptions.injector = Injector.create({
              providers: [{ provide: TIPPY_REF, useValue: instance }],
              parent: options.injector || this.injector,
            });
          }
        }
        view = this.view.createView(content, { ...options, ...config.$viewOptions });
        instance.setContent(view.getElement());
        options?.onShow?.(instance);
      },
      onHidden: (instance) => {
        view.destroy();
        options?.onHidden?.(instance);
        view = null;
      },
      // ...globalconfig, ...variation, ...options
      ...options,
    };

    const instance = tippy(host, config);

    const original = instance.destroy;

    instance.destroy = () => {
      original.call(tippy);
      view?.destroy();
      view = null;
    };

    return instance;
  }
}
