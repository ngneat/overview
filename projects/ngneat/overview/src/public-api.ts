/*
 * Public API Surface of overview
 */
export { TeleportModule } from './lib/teleport/teleport.module';
export { DynamicViewModule } from './lib/dynamic-view/dynamic-view.directive';
export { StringRef } from './lib/views/string-ref';
export { CompRef } from './lib/views/comp-ref';
export { TplRef } from './lib/views/template-ref';
export { ViewService, ViewOptions } from './lib/views/view';
export { isComponent, isTemplateRef, Content, isString, ViewRef } from './lib/views/types';
