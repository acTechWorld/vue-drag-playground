<template>
  <div class="vue-drag-playground select-none relative">
    <div
      v-for="(item, index) in refItems"
      :key="index"
      class="w-fit h-fit absolute"
      :class="currentDragIndex === index ? 'cursor-grabbing' : 'cursor-grab'"
      :style="{ left: item.x + 'px', top: item.y + 'px' }"
      @mousedown="startDrag($event, index)"
    >
      <div v-html="item.html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface DraggableItem {
  html: string // HTML string to render
  x: number // X-coordinate for position
  y: number // Y-coordinate for position
}

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

/**
 * METHODS
 */
const startDrag = (event: MouseEvent, index: number) => {
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
