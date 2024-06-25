import {
  ApplicationRef,
  EnvironmentInjector,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  Signal,
  signal,
  TemplateRef,
  Type,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { Content, isComponent, isString, isTemplateRef, ViewRef } from './types';
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

export type ViewOptions<Context = any> = _ViewOptions & CompViewOptions<Context> & TemplateViewOptions;

export const VIEW_CONTEXT = new InjectionToken<Signal<unknown>>('Component context');

@Injectable({ providedIn: 'root' })
export class ViewService {
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);

  createComponent<Comp, Context>(component: Type<Comp>, options: CompViewOptions<Context> = {}) {
    let injector = options.injector ?? this.injector;
    let contextSignal: WritableSignal<Context> | undefined;

    if (options.context) {
      contextSignal = signal(options.context);
      injector = Injector.create({
        providers: [
          {
            provide: VIEW_CONTEXT,
            useValue: contextSignal.asReadonly(),
          },
        ],
        parent: injector,
      });
    }

    return new CompRef<Comp, Context>({
      component,
      vcr: options.vcr,
      injector,
      appRef: this.appRef,
      environmentInjector: options.environmentInjector || this.environmentInjector,
      contextSignal,
    });
  }

  createTemplate<Context>(tpl: TemplateRef<Context>, options: TemplateViewOptions = {}) {
    return new TplRef({
      vcr: options.vcr,
      appRef: this.appRef,
      tpl,
      context: options.context,
      injector: options.injector,
    });
  }

  createView<Comp, Context>(content: Type<Comp>, viewOptions: CompViewOptions<Context>): CompRef<Comp, Context>;
  createView<T>(content: TemplateRef<T>, viewOptions: TemplateViewOptions): TplRef<T>;
  createView(content: string): StringRef;
  createView(content: Content, viewOptions?: ViewOptions): ViewRef;
  createView<T extends Content, Context>(content: T, viewOptions: ViewOptions<Context> = {}): ViewRef {
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
  return inject(VIEW_CONTEXT) as Signal<T>;
}
