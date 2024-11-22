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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'

interface DraggableItem {
  html: string // HTML string to render
  x: number // X-coordinate for position
  y: number // Y-coordinate for position
  width: number
  height: number
}

type ResizingHandle = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    items?: DraggableItem[]
  }>(),
  {
    items: () => [],
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

const emit = defineEmits([
  'drag-start',
  'dragging',
  'drag-end',
  'resize-start',
  'resizing',
  'resize-end',
]) /**
 * METHODS
 */

//RESIZE
const updateResize = () => {
  refItems.value?.forEach((item, index) => {
    const itemEl = document.querySelector(`.item-${index}`)
    if (itemEl) {
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
  })
}
const startResize = (event: MouseEvent, index: number, handle: ResizingHandle) => {
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

const onResize = (event: MouseEvent) => {
  const playground = document.querySelector('.vue-drag-playground')
  if (!playground || resizingIndex.value === null || resizingHandle.value === null) return

  const dx = event.clientX - initialMouseX.value
  const dy = event.clientY - initialMouseY.value
  const item = refItems.value[resizingIndex.value]
  const playgroundBounds = playground.getBoundingClientRect()
  let newWidth = 0
  let newHeight = 0

  // Update dimensions based on the handle
  if (resizingHandle.value === 'bottom-right') {
    newWidth = initialWidth.value + dx
    newHeight = initialHeight.value + dy
    newWidth = Math.max(10, Math.min(newWidth, playgroundBounds.width - item.x))
    newHeight = Math.max(10, Math.min(newHeight, playgroundBounds.height - item.y))
  } else if (resizingHandle.value === 'bottom-left') {
    newHeight = initialHeight.value + dy
    if (initialX.value + dx > 0) {
      item.x = initialX.value + dx
      newWidth = initialWidth.value - dx
    } else {
      newWidth = item.width + item.x
      item.x = 0
    }
    newWidth = Math.max(10, newWidth)
    newHeight = Math.max(10, Math.min(newHeight, playgroundBounds.height - item.y))
  } else if (resizingHandle.value === 'top-right') {
    newWidth = initialWidth.value + dx
    if (initialY.value + dy > 0) {
      newHeight = initialHeight.value - dy
      item.y = initialY.value + dy
    } else {
      newHeight = item.height + item.y
      item.y = 0
    }
    newWidth = Math.max(10, Math.min(newWidth, playgroundBounds.width - item.x))
    newHeight = Math.max(10, newHeight)
  } else {
    if (initialX.value + dx > 0) {
      item.x = initialX.value + dx
      newWidth = initialWidth.value - dx
    } else {
      newWidth = item.width + item.x
      item.x = 0
    }
    if (initialY.value + dy > 0) {
      newHeight = initialHeight.value - dy
      item.y = initialY.value + dy
    } else {
      newHeight = item.height + item.y
      item.y = 0
    }
  }

  item.width = newWidth
  item.height = newHeight
  emit('resizing', resizingIndex.value)
}

const stopResize = () => {
  emit('resize-end', resizingIndex.value)
  resizingIndex.value = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
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
  const itemBounds = currentDragEl.value.getBoundingClientRect()

  const item = refItems.value[currentDragIndex.value]

  // Calculate new position
  const newX = event.clientX - offsetX.value
  const newY = event.clientY - offsetY.value

  // Clamp to playground boundaries using itemBounds
  item.x = Math.max(0, Math.min(newX, playgroundBounds.width - itemBounds.width))
  item.y = Math.max(0, Math.min(newY, playgroundBounds.height - itemBounds.height))
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

watch(refItems, () => updateResize(), { deep: true })
</script>

<style scoped></style>
