import {createApp, Component, App, ComponentPublicInstance} from 'vue'
import Zemit from '@/App.vue'
import {registerPlugins} from '@/plugins'
import {registerDirectives} from '@/directives'
import './prototype';

export default class Main {

  static element: string = '#app'

  static app: App<Element>
  static component: ComponentPublicInstance

  static init(rootComponent: Component) {
    if (this.component) this.app.unmount()

    this.app = createApp(rootComponent)
    registerPlugins(this.app)
    registerDirectives(this.app)

    this.component = this.app.mount(this.element)
  }

}

Main.init(Zemit)
