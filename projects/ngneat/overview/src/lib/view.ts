import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Content, isComponent, isString, isTemplateRef, ViewRef } from './types';
import { TplRef } from './template-ref';
import { StringRef } from './string-ref';
import { CompRef } from './comp-ref';

interface _ViewOptions {
  vcr?: ViewContainerRef | undefined;
}

interface CompViewOptions extends _ViewOptions {
  injector?: Injector | undefined;
}

interface TemplateViewOptions extends _ViewOptions {
  context?: Record<string, any> | undefined;
}

export type ViewOptions = _ViewOptions & CompViewOptions & TemplateViewOptions;

@Injectable({ providedIn: 'root' })
export class ViewService {
  constructor(private resolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef) {}

  createComponent<C>(component: Type<C>, options: CompViewOptions) {
    return new CompRef<C>({
      component,
      vcr: options.vcr,
      injector: options.injector || this.injector,
      appRef: this.appRef,
      resolver: this.resolver,
    });
  }

  createTemplate<C>(tpl: TemplateRef<C>, options: TemplateViewOptions) {
    return new TplRef({
      vcr: options.vcr,
      appRef: this.appRef,
      tpl,
      context: options.context,
    });
  }

  createView(content: Content, viewOptions: _ViewOptions & CompViewOptions & TemplateViewOptions): ViewRef {
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
