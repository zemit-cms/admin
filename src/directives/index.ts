import type { App } from 'vue'
import testId from "@/directives/test-id";

export function registerDirectives (app: App) {
  app
    .directive('test-id', testId)
}
