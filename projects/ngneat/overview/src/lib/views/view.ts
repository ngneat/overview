import {
  ApplicationRef, EnvironmentInjector,
  inject,
  Injectable, InjectionToken,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import {Content, isComponent, isString, isTemplateRef, ViewRef} from './types';
import { TplRef } from './template-ref';
import { StringRef } from './string-ref';
import { CompRef } from './comp-ref';

interface _ViewOptions {
  vcr?: ViewContainerRef | undefined;
  injector?: Injector | undefined;
}

interface TemplateViewOptions extends _ViewOptions {
  context?: Record<string, any> | undefined;
}

interface CompViewOptions<Context = any> extends _ViewOptions {
  environmentInjector?: EnvironmentInjector | undefined;
  context?: Context | undefined;
}

export type ViewOptions = _ViewOptions & CompViewOptions & TemplateViewOptions;

export const VIEW_CONTEXT = new InjectionToken<Record<string, any>>('Component context');

@Injectable({ providedIn: 'root' })
export class ViewService {
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);

  createComponent<Comp, Context>(component: Type<Comp>, options: CompViewOptions<Context> = {}) {
    let injector = options.injector || this.injector;

    if (options.context) {
      injector = Injector.create({
        providers: [{
          provide: VIEW_CONTEXT,
          useValue: options.context
        }],
        parent: injector
      });
    }

    return new CompRef<Comp>({
      component,
      vcr: options.vcr,
      injector,
      appRef: this.appRef,
      environmentInjector: options.environmentInjector || this.environmentInjector
    });
  }

  createTemplate<Context>(tpl: TemplateRef<Context>, options: TemplateViewOptions = {}) {
    return new TplRef({
      vcr: options.vcr,
      appRef: this.appRef,
      tpl,
      context: options.context,
      injector: options.injector
    });
  }

  createView<T>(content: Type<T>, viewOptions: CompViewOptions): CompRef<T>;
  createView<T>(content: TemplateRef<T>, viewOptions: TemplateViewOptions): TplRef<T>;
  createView(content: string): StringRef;
  createView(content: Content, viewOptions?: ViewOptions): ViewRef;
  createView<T extends Content>(content: T, viewOptions: ViewOptions = {}): ViewRef {
    if (isTemplateRef(content)) {
      return this.createTemplate(content, viewOptions);
    } else if (isComponent(content)) {
      return this.createComponent(content, viewOptions);
    } else if (isString(content)) {
      return new StringRef(content);
    } else {
      throw 'Type of content is not supported';
    }
  }
}

export function injectViewContext<T>() {
  return inject(VIEW_CONTEXT) as T;
}
