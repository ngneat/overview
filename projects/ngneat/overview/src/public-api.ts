/*
 * Public API Surface of overview
 */
export { DynamicContentModule } from './lib/dynamic-content/dynamic-content.component';
export { TemplateOrStringModule } from './lib/template-or-string/template-or-string.module';
export { TeleportModule } from './lib/teleport/teleport.module';

export { StringRef } from './lib/views/string-ref';
export { CompRef } from './lib/views/comp-ref';
export { TplRef } from './lib/views/template-ref';
export { ViewService, ViewOptions } from './lib/views/view';
export { isComponent, isTemplateRef, Content, isString, ViewRef } from './lib/views/types';
