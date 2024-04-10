import type {ParamValue, RouteRecordInfo} from 'unplugin-vue-router/types'
import type { RouteNamedMap as TypedRouteMap } from './typed-router'

declare module 'vue-router/auto/routes' {
  export interface RouteNamedMap extends TypedRouteMap {
    'NotFound': RouteRecordInfo<'NotFound', 'NotFound', Record<never, never>, Record<never, never>>,
    'Error': RouteRecordInfo<'Error', '/error/:type', { type: ParamValue<true> }, { type: ParamValue<false> }>

    'Login': RouteRecordInfo<'Login', 'Login', Record<never, never>, Record<never, never>>,

    'Home': RouteRecordInfo<'Home', 'Home', Record<never, never>, Record<never, never>>,

    'User': RouteRecordInfo<'User', 'User', Record<never, never>, Record<never, never>>,
    'UserNew': RouteRecordInfo<'UserNew', 'UserNew', Record<never, never>, Record<never, never>>,
    'UserForm': RouteRecordInfo<'UserForm', 'UserForm', Record<never, never>, Record<never, never>>,

    'Workspace': RouteRecordInfo<'Workspace', 'Workspace', Record<never, never>, Record<never, never>>,
    'WorkspaceNew': RouteRecordInfo<'WorkspaceNew', 'WorkspaceNew', Record<never, never>, Record<never, never>>,
    'WorkspaceForm': RouteRecordInfo<'WorkspaceForm', 'WorkspaceForm', { wid: ParamValue<true> }, { wid: ParamValue<false> }>,

    'Table': RouteRecordInfo<'Table', 'Table', Record<never, never>, Record<never, never>>,
    'TableNew': RouteRecordInfo<'TableNew', 'TableNew', { wid: ParamValue<true> }, { wid: ParamValue<false> }>,
    'TableForm': RouteRecordInfo<'TableForm', 'TableForm', { wid: ParamValue<true> }, { wid: ParamValue<false> }>,
  }
}
