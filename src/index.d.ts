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
  static?: boolean
}

export declare type DrapPlaygroundProps = {
  modelValue: DraggableItem[] // v-model binds to 'modelValue'
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

// Define emits for custom events and v-model
export declare type DrapPlaygroundEmits = {
  // v-model event: update the 'items' array
  'update:modelValue': (value: DraggableItem[]) => void // v-model emit
  'drag-start': (item: DraggableItem) => void
  dragging: (item: DraggableItem) => void
  'drag-end': (item: DraggableItem) => void
  'resize-start': (item: DraggableItem) => void
  resizing: (item: DraggableItem) => void
  'resize-end': (item: DraggableItem) => void
  'rotate-start': (item: DraggableItem) => void
  rotating: (item: DraggableItem) => void
  'rotate-end': (item: DraggableItem) => void
  'copy-items': (payload: { copiedItems: DraggableItem[]; createdItems: DraggableItem[] }) => void
  'delete-items': (deletedItems: DraggableItem[]) => void
}

// Declare the Vue component itself
declare const VueDragPlayground: DefineComponent<
  DrapPlaygroundProps,
  object,
  object,
  Record<string, never>,
  Record<string, never>,
  object,
  object,
  DrapPlaygroundEmits
>
// Declare the install function for the plugin system
declare const _default: {
  install(app: App): void
}

// Export the default plugin object
export default _default

// Export the Vue component for direct use
export { VueDragPlayground }
