import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Content, ViewRef } from './types';
import { TplRef } from './template-ref';
import { StringRef } from './string-ref';
import { CompRef } from './comp-ref';

interface ViewOptions {
  vcr: ViewContainerRef | undefined;
}

interface CompViewOptions extends ViewOptions {
  injector: Injector | undefined;
}

interface TemplateViewOptions extends ViewOptions {
  context: Record<string, any> | undefined;
}

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

  createView(content: Content, viewOptions: ViewOptions & CompViewOptions & TemplateViewOptions): ViewRef {
    if (content instanceof TemplateRef) {
      return this.createTemplate(content, viewOptions);
    } else if (typeof content === 'function') {
      return this.createComponent(content, viewOptions);
    } else if (typeof content === 'string') {
      return new StringRef(content);
    } else {
      throw 'Type of content is not supported';
    }
  }
}
