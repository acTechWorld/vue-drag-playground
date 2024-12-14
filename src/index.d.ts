import { App, DefineComponent } from 'vue'

// Define prop types
export declare type DraggableItem = {
  id?: number
  name?: string
  html: string // HTML string to render
  x: number // X-coordinate for position
  y: number // Y-coordinate for position
  width?: number
  height?: number
  rotation?: number
}

export declare type DrapPlaygroundProps = {
  isDrag?: boolean
  isResize?: boolean
  isRotate?: boolean
  isCopy?: boolean
  isMultiSelect?: boolean
  isDelete?: boolean
  throttleDelay?: number
  maxNumberOfItems?: number | undefined
  multiRotationMode?: 'proportional' | 'uniform' // "proportional" multirotation keep the based angle of item / "proportional" multirotation align items at the same angle"
}

// Declare the Vue component itself
declare const VueDragPlayground: DefineComponent<DrapPlaygroundProps>

// Declare the install function for the plugin system
declare const _default: {
  install(app: App): void
}

// Export the default plugin object
export default _default

// Export the Vue component for direct use
export { VueDragPlayground }
