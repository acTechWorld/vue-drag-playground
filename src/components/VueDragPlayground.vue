<template>
  <div class="vue-drag-playground select-none relative">
    <div
      v-for="(item, index) in refItems"
      :key="index"
      class="w-fit h-fit absolute group"
      :class="currentDragIndex === index ? 'cursor-grabbing' : 'cursor-grab'"
      :style="{
        left: item.x + 'px',
        top: item.y + 'px',
        transform: `rotate(${item.rotation}deg)`,
      }"
      @mousedown="startDrag($event, index)"
    >
      <div :class="`item-${index}`" v-html="item.html"></div>
      <div
        class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nesw-resize -top-1 -right-1 hidden group-hover:block"
        @mousedown.stop="startResize($event, index, 'top-right')"
      ></div>
      <div
        class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nwse-resize -top-1 -left-1 hidden group-hover:block"
        @mousedown.stop="startResize($event, index, 'top-left')"
      ></div>
      <div
        class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nwse-resize -bottom-1 -right-1 hidden group-hover:block"
        @mousedown.stop="startResize($event, index, 'bottom-right')"
      ></div>
      <div
        class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nesw-resize -bottom-1 -left-1 hidden group-hover:block"
        @mousedown.stop="startResize($event, index, 'bottom-left')"
      ></div>
      <div
        class="w-4 h-4 absolute bg-blue-500 rounded-[50%] cursor-pointer -top-6 left-1/2 transform -translate-x-1/2"
        @mousedown.stop="startRotate($event, index)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface DraggableItem {
  html: string // HTML string to render
  x: number // X-coordinate for position
  y: number // Y-coordinate for position
  width: number
  height: number
  rotation: number
}

type ResizingHandle = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    items?: DraggableItem[]
    resizable?: boolean
  }>(),
  {
    items: () => [],
    resizable: false,
  },
)

const refItems = ref(props.items)
const currentDragIndex = ref<number | null>(null) // Track the dragged item
const currentDragEl = ref<HTMLElement | null>(null)
const offsetX = ref(0) // Track X offset
const offsetY = ref(0) // Track Y offset
const resizingIndex = ref<number | null>(null)
const resizingHandle = ref<ResizingHandle | null>(null)
const initialMouseX = ref(0)
const initialMouseY = ref(0)
const initialWidth = ref(0)
const initialHeight = ref(0)
const initialX = ref(0)
const initialY = ref(0)

//ROTATION
const initialAngle = ref(0)
const centerX = ref(0)
const rotatingIndex = ref<number | null>(null)
const centerY = ref(0)

const emit = defineEmits([
  'drag-start',
  'dragging',
  'drag-end',
  'resize-start',
  'resizing',
  'resize-end',
  'rotation-end',
  'rotation-start',
  'rotating',
])

/**
 * METHODS
 */

//RESIZE
const updateResize = (index: number) => {
  const itemEl = document.querySelector(`.item-${index}`)
  const item = refItems.value[index]
  if (itemEl && item) {
    const child = itemEl.children?.[0]
    if (child) {
      const currentStyles = child.getAttribute('style') || ''
      // Parse current styles into a map
      const stylesMap = new Map(
        currentStyles
          .split(';')
          .map((style) => {
            const [key, value] = style.split(':').map((s) => s.trim())
            return key && value ? [key, value] : null
          })
          .filter(Boolean) as [string, string][],
      )

      // Add computed styles for fallback (if needed)
      if (item.width) stylesMap.set('width', `${item.width}px`)
      if (item.height) stylesMap.set('height', `${item.height}px`)
      // Reconstruct the style string
      const updatedStyleString = Array.from(stylesMap)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ')
      child.setAttribute('style', updatedStyleString)
    }
  }
}
const startResize = (event: MouseEvent, index: number, handle: ResizingHandle) => {
  if (props.resizable) {
    emit('resize-start', index, handle)
    const item = refItems.value[index]
    const itemEl = document.querySelector(`.item-${index}`)
    if (itemEl && item) {
      resizingIndex.value = index
      resizingHandle.value = handle
      initialMouseX.value = event.clientX
      initialMouseY.value = event.clientY
      const elementBounds = (itemEl as HTMLElement).getBoundingClientRect()
      initialWidth.value = elementBounds.width
      initialHeight.value = elementBounds.height
      initialX.value = item.x
      initialY.value = item.y
      document.addEventListener('mousemove', onResize)
      document.addEventListener('mouseup', stopResize)
    }
  }
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max))
}

const onResize = (event: MouseEvent) => {
  const playground = document.querySelector('.vue-drag-playground')
  if (!playground || resizingIndex.value === null || resizingHandle.value === null) return

  const dx = event.clientX - initialMouseX.value
  const dy = event.clientY - initialMouseY.value
  const item = refItems.value[resizingIndex.value]
  const playgroundBounds = playground.getBoundingClientRect()

  let newWidth = item.width
  let newHeight = item.height
  let newX = item.x
  let newY = item.y

  // Handle-specific updates
  switch (resizingHandle.value) {
    case 'bottom-right':
      newWidth = clamp(initialWidth.value + dx, 10, playgroundBounds.width - item.x)
      newHeight = clamp(initialHeight.value + dy, 10, playgroundBounds.height - item.y)
      break

    case 'bottom-left':
      newHeight = clamp(initialHeight.value + dy, 10, playgroundBounds.height - item.y)
      if (initialX.value + dx > 0) {
        newX = initialX.value + dx
        newWidth = clamp(initialWidth.value - dx, 10, playgroundBounds.width - newX)
      } else {
        newWidth = item.width + item.x
        newX = 0
      }
      break

    case 'top-right':
      newWidth = clamp(initialWidth.value + dx, 10, playgroundBounds.width - item.x)
      if (initialY.value + dy > 0) {
        newY = initialY.value + dy
        newHeight = clamp(initialHeight.value - dy, 10, playgroundBounds.height - newY)
      } else {
        newHeight = item.height + item.y
        newY = 0
      }
      break

    case 'top-left':
      if (initialX.value + dx > 0) {
        newX = initialX.value + dx
        newWidth = clamp(initialWidth.value - dx, 10, playgroundBounds.width - newX)
      } else {
        newWidth = item.width + item.x
        newX = 0
      }
      if (initialY.value + dy > 0) {
        newY = initialY.value + dy
        newHeight = clamp(initialHeight.value - dy, 10, playgroundBounds.height - newY)
      } else {
        newHeight = item.height + item.y
        newY = 0
      }
      break
  }

  // Update item properties
  item.width = newWidth
  item.height = newHeight
  item.x = newX
  item.y = newY

  emit('resizing', resizingIndex.value)
  updateResize(resizingIndex.value)
}

const stopResize = () => {
  emit('resize-end', resizingIndex.value)
  resizingIndex.value = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

//ROTATE
const startRotate = (event: MouseEvent, index: number) => {
  const item = refItems.value[index]
  const itemEl = document.querySelector(`.item-${index}`)
  if (itemEl && item) {
    rotatingIndex.value = index

    // Calculate the center of the element
    const bounds = (itemEl as HTMLElement).getBoundingClientRect()
    centerX.value = bounds.left + bounds.width / 2
    centerY.value = bounds.top + bounds.height / 2

    // Store the initial angle
    initialMouseX.value = event.clientX
    initialMouseY.value = event.clientY
    const dx = initialMouseX.value - centerX.value
    const dy = initialMouseY.value - centerY.value
    console.log()
    initialAngle.value = Math.atan2(dy, dx) * (180 / Math.PI) - (item.rotation ?? 0)

    // Add global listeners for rotation
    document.addEventListener('mousemove', onRotate)
    document.addEventListener('mouseup', stopRotate)
    emit('rotation-start', index)
  }
}

const onRotate = (event: MouseEvent) => {
  if (rotatingIndex.value === null) return
  const item = refItems.value[rotatingIndex.value]

  // Calculate the new angle
  const dx = event.clientX - centerX.value
  const dy = event.clientY - centerY.value
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  // Update the item's rotation
  item.rotation = angle - initialAngle.value
  emit('rotating', rotatingIndex.value)
}

const stopRotate = () => {
  if (rotatingIndex.value !== null) emit('rotation-end', rotatingIndex.value)
  rotatingIndex.value = null

  // Remove global listeners
  document.removeEventListener('mousemove', onRotate)
  document.removeEventListener('mouseup', stopRotate)
}

//DRAG
const startDrag = (event: MouseEvent, index: number) => {
  emit('drag-start', index)
  currentDragIndex.value = index
  currentDragEl.value = event.currentTarget as HTMLElement

  const item = refItems.value[index]
  offsetX.value = event.clientX - item.x
  offsetY.value = event.clientY - item.y
  // Add global listeners for dragging
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  const playground = document.querySelector('.vue-drag-playground')
  if (!playground || currentDragIndex.value === null || currentDragEl.value === null) return

  emit('dragging', currentDragIndex.value)

  const playgroundBounds = playground.getBoundingClientRect()
  const item = refItems.value[currentDragIndex.value]

  // Calculate new position
  const newX = event.clientX - offsetX.value
  const newY = event.clientY - offsetY.value
  const rotation = ((item.rotation ?? 0) * Math.PI) / 180
  const halfWidth = item.width / 2
  const halfHeight = item.height / 2

  // Calculate rotated corners relative to the center
  const corners = [
    { x: -halfWidth, y: -halfHeight }, // Top-left
    { x: halfWidth, y: -halfHeight }, // Top-right
    { x: halfWidth, y: halfHeight }, // Bottom-right
    { x: -halfWidth, y: halfHeight }, // Bottom-left
  ].map((corner) => ({
    x: corner.x * Math.cos(rotation) - corner.y * Math.sin(rotation),
    y: corner.x * Math.sin(rotation) + corner.y * Math.cos(rotation),
  }))

  // Get maximum offsets caused by rotation
  const maxX = Math.max(...corners.map((corner) => corner.x))
  const maxY = Math.max(...corners.map((corner) => corner.y))

  // Update the item's position with clamping
  item.x = Math.max(
    0 - halfWidth + maxX,
    Math.min(newX, playgroundBounds.width - (halfWidth + maxX)),
  )
  item.y = Math.max(
    0 - halfHeight + maxY,
    Math.min(newY, playgroundBounds.height - (halfHeight + maxY)),
  )
}

const stopDrag = () => {
  currentDragIndex.value = null
  emit('drag-end', currentDragIndex.value)
  // Remove global listeners
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Ensure global event listeners are removed when component is unmounted
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped></style>
