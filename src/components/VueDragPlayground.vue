<template>
  <div class="vue-drag-playground select-none">
    <div
      v-for="(item, index) in refItems"
      :key="index"
      class="cursor-grab active:cursor-grabbing w-fit h-fit absolute"
      :style="{ left: item.x + 'px', top: item.y + 'px' }"
      @mousedown="startDrag($event, index)"
    >
      <div v-html="item.html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

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
const offsetX = ref(0) // Track X offset
const offsetY = ref(0) // Track Y offset

/**
 * LIFECYCLE
 */
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})

/**
 * METHODS
 */
const startDrag = (event: MouseEvent, index: number) => {
  currentDragIndex.value = index
  const item = refItems.value[index]
  offsetX.value = event.clientX - item.x
  offsetY.value = event.clientY - item.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  const playground = document.querySelector('.vue-drag-playground')
  if (currentDragIndex.value === null || playground === event.target) return

  const item = refItems.value[currentDragIndex.value]
  const playgroundBounds = playground!.getBoundingClientRect()
  const itemBounds = event.target as HTMLElement

  const newX = event.clientX - offsetX.value
  const newY = event.clientY - offsetY.value

  const itemWidth = itemBounds.getBoundingClientRect()?.width
  const itemHeight = itemBounds.getBoundingClientRect()?.height
  if (
    event.clientX > playgroundBounds.left &&
    event.clientX < playgroundBounds.right &&
    event.clientY > playgroundBounds.top &&
    event.clientY < playgroundBounds.bottom
  ) {
    item.x = Math.max(
      playgroundBounds.x,
      Math.min(newX, playgroundBounds.x + playgroundBounds.width - itemWidth),
    )
    item.y = Math.max(
      playgroundBounds.y,
      Math.min(newY, playgroundBounds.y + playgroundBounds.height - itemHeight),
    )
  }
}

const stopDrag = () => {
  currentDragIndex.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped></style>
