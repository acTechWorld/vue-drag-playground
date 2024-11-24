/*!
 * Your Library Name v1.0.0
 * (c) [Year] [Your Name or Organization]
 * Released under the MIT License
 * https://opensource.org/licenses/MIT
 */
import type { App } from 'vue'
import VueDragPlayground from './components/VueDragPlayground.vue'
import './assets/main.css'

// Install function for the plugin system
export default {
  install(app: App) {
    app.component('VueOnboardingTour', VueDragPlayground)
  },
}
