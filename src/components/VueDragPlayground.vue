<template>
  <div class="vue-drag-playground select-none relative">
    <div
      v-for="(item, index) in refItems"
      :key="index"
      class="w-fit h-fit absolute group"
      :style="{
        left: item.x + 'px',
        top: item.y + 'px',
      }"
    >
      <!-- Copy and Delete buttons -->
      <div
        class="z-0 group-hover:opacity-100 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none opacity-0 absolute flex -top-7 pl-[calc(100%_+_30px)] pb-[100%] gap-2"
        :class="{ 'opacity-100': interactIndex === index }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="fill-black h-5 cursor-pointer"
          @click.stop="copyItem(index)"
        >
          <path
            d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="fill-black h-5 cursor-pointer"
          @click.stop="deleteItem(index)"
        >
          <path
            d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
          />
        </svg>
      </div>
      <div
        :class="interactIndex === index ? 'cursor-grabbing' : 'cursor-grab'"
        class="z-[1] relative"
        :style="{
          transform: `rotate(${item.rotation}deg) translate3d(0, 0, 0)`,
        }"
        @mousedown.stop="startDrag($event, index)"
        @touchstart.stop="startDrag($event, index)"
      >
        <div :class="`item-${index}`" v-html="DOMPurify.sanitize(item.html)"></div>
        <div
          class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nesw-resize -top-1 -right-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none"
          :class="{ 'opacity-100': interactIndex === index }"
          @mousedown.stop="startResize($event, index, 'top-right')"
          @touchstart.stop="startResize($event, index, 'top-right')"
        ></div>
        <div
          class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nwse-resize -top-1 -left-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none"
          :class="{ 'opacity-100': interactIndex === index }"
          @mousedown.stop="startResize($event, index, 'top-left')"
          @touchstart.stop="startResize($event, index, 'top-left')"
        ></div>
        <div
          class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nwse-resize -bottom-1 -right-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none"
          :class="{ 'opacity-100': interactIndex === index }"
          @mousedown.stop="startResize($event, index, 'bottom-right')"
          @touchstart.stop="startResize($event, index, 'bottom-right')"
        ></div>
        <div
          class="w-4 h-4 absolute bg-white/50 rounded-[50%] cursor-nesw-resize -bottom-1 -left-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none"
          :class="{ 'opacity-100': interactIndex === index }"
          @mousedown.stop="startResize($event, index, 'bottom-left')"
          @touchstart.stop="startResize($event, index, 'bottom-left')"
        ></div>
        <div
          class="absolute top-0 flex w-full h-10 -translate-y-full group-hover:pointer-events-auto pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="w-6 h-6 p-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none absolute bg-blue-500 rounded-[50%] cursor-pointer top-2 left-1/2 transform -translate-x-1/2 fill-white"
            :class="{ 'opacity-100': interactIndex === index }"
            @mousedown.stop="startRotate($event, index)"
            @touchstart.stop="startRotate($event, index)"
          >
            <path
              d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
            />
          </svg>
          <!-- <div
            class="w-4 h-4 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none absolute bg-blue-500 rounded-[50%] cursor-pointer top-4 left-1/2 transform -translate-x-1/2"
            :class="{ 'opacity-100': interactIndex === index }"
            @mousedown.stop="startRotate($event, index)"
            @touchstart.stop="startRotate($event, index)"
          ></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, nextTick } from 'vue'
import DOMPurify from 'dompurify'
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
    throttleDelay?: number
  }>(),
  {
    items: () => [],
    resizable: false,
    throttleDelay: 1,
  },
)

//COMMON
const refItems = ref(props.items)
const copiedItemIndex = ref<number | null>(null) // Temporary storage for the copied item
const interactIndex = ref<number | null>(null)

//DRAG
const offsetX = ref(0) // Track X offset
const offsetY = ref(0) // Track Y offset
const currentDragEl = ref<HTMLElement | null>(null)

//RESIZE
const initialMouseX = ref(0)
const initialMouseY = ref(0)
const initialWidth = ref(0)
const initialHeight = ref(0)
const resizingHandle = ref<ResizingHandle | null>(null)

//ROTATION
const initialAngle = ref(0)
const centerX = ref(0)
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

//UTILS
const throttle = (func: (event: MouseEvent | TouchEvent) => void, delay: number) => {
  let lastCall = 0
  return function (event: MouseEvent | TouchEvent) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      func(event)
      lastCall = now
    }
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const isCtrl = isMac ? event.metaKey : event.ctrlKey

  if (isCtrl && event.key === 'c' && interactIndex.value !== null) {
    // Copy logic
    event.preventDefault() // Prevent default browser behavior
    copiedItemIndex.value = interactIndex.value
  } else if (isCtrl && event.key === 'v' && copiedItemIndex.value !== null) {
    // Paste logic
    event.preventDefault() // Prevent default browser behavior
    copyItem(copiedItemIndex.value)
    copiedItemIndex.value = null
  }
}

//COPY
const copyItem = (index: number) => {
  const item = refItems.value[index]
  if (item) {
    // Create a shallow copy of the item properties, adjust position slightly to avoid overlap
    const newItem = {
      ...item,
      x: item.x + 20, // Adjust x position to prevent overlap
      y: item.y + 20, // Adjust y position to prevent overlap
      html: item.html, // Preserve HTML content
    }
    refItems.value.push(newItem) // Add the copied item to the list
    nextTick(() => {
      updateResize(refItems.value.length - 1)
    })
  }
}

//DELETE
const deleteItem = (index: number) => {
  refItems.value.splice(index, 1) // Remove the item from the list
  interactIndex.value = null
}

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
const startResize = (event: MouseEvent | TouchEvent, index: number, handle: ResizingHandle) => {
  if (props.resizable) {
    emit('resize-start', index, handle)
    const item = refItems.value[index]
    const itemEl = document.querySelector(`.item-${index}`)
    if (itemEl && item) {
      interactIndex.value = index
      resizingHandle.value = handle
      const isTouch = event instanceof TouchEvent
      initialMouseX.value = isTouch ? event.touches[0].clientX : event.clientX
      initialMouseY.value = isTouch ? event.touches[0].clientY : event.clientY
      initialWidth.value = item.width
      initialHeight.value = item.height
      document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onResize)
      document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopResize)
    }
  }
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max))
}

const onResize = throttle((event: MouseEvent | TouchEvent) => {
  event.stopPropagation()
  const playground = document.querySelector('.vue-drag-playground')
  if (!playground || interactIndex.value === null || resizingHandle.value === null) return

  const item = refItems.value[interactIndex.value]
  const playgroundBounds = playground.getBoundingClientRect()

  // Calculate rotation
  const rotation = ((item.rotation ?? 0) * Math.PI) / 180
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)

  const halfWidth = item.width / 2
  const halfHeight = item.height / 2
  const centerX = item.x + item.width / 2
  const centerY = item.y + item.height / 2

  // Calculate corners relative to the center
  const corners = [
    { x: -halfWidth, y: -halfHeight }, // Top-left
    { x: halfWidth, y: -halfHeight }, // Top-right
    { x: halfWidth, y: halfHeight }, // Bottom-right
    { x: -halfWidth, y: halfHeight }, // Bottom-left
  ].map((corner) => ({
    x: centerX + corner.x * cos - corner.y * sin,
    y: centerY + corner.x * sin + corner.y * cos,
  }))

  const isTouch = event instanceof TouchEvent
  const clientX = isTouch ? event.touches[0].clientX : event.clientX
  const clientY = isTouch ? event.touches[0].clientY : event.clientY

  // Calculate deltas in rotated space
  const dx = clientX - initialMouseX.value
  const dy = clientY - initialMouseY.value
  const rotatedDx = dx * cos + dy * sin
  const rotatedDy = dy * cos - dx * sin
  let newWidth = item.width
  let newHeight = item.height
  let newX = item.x
  let newY = item.y

  // Determine the fixed corner and calculate new center
  let fixedCorner // This will hold the position of the fixed corner
  let newCenterX, newCenterY

  switch (resizingHandle.value) {
    case 'bottom-right': {
      fixedCorner = corners[0] // Top-left
      newWidth = clamp(initialWidth.value + rotatedDx, 10, playgroundBounds.width)
      newHeight = clamp(initialHeight.value + rotatedDy, 10, playgroundBounds.height)

      // Calculate the new center based on the fixed corner
      newCenterX = fixedCorner.x + (newWidth * cos) / 2 - (newHeight * sin) / 2
      newCenterY = fixedCorner.y + (newWidth * sin) / 2 + (newHeight * cos) / 2
      break
    }
    case 'bottom-left': {
      fixedCorner = corners[1] // Top-right
      newWidth = clamp(initialWidth.value - rotatedDx, 10, playgroundBounds.width)
      newHeight = clamp(initialHeight.value + rotatedDy, 10, playgroundBounds.height)

      // Calculate the new center based on the fixed corner
      newCenterX = fixedCorner.x - (newWidth * cos) / 2 - (newHeight * sin) / 2
      newCenterY = fixedCorner.y - (newWidth * sin) / 2 + (newHeight * cos) / 2
      break
    }
    case 'top-right': {
      fixedCorner = corners[3] // Bottom-left
      newWidth = clamp(initialWidth.value + rotatedDx, 10, playgroundBounds.width)
      newHeight = clamp(initialHeight.value - rotatedDy, 10, playgroundBounds.height)

      // Calculate the new center based on the fixed corner
      newCenterX = fixedCorner.x + (newWidth * cos) / 2 + (newHeight * sin) / 2
      newCenterY = fixedCorner.y + (newWidth * sin) / 2 - (newHeight * cos) / 2
      break
    }
    case 'top-left': {
      fixedCorner = corners[2] // Bottom-right
      newWidth = clamp(initialWidth.value - rotatedDx, 10, playgroundBounds.width)
      newHeight = clamp(initialHeight.value - rotatedDy, 10, playgroundBounds.height)

      // Calculate the new center based on the fixed corner
      newCenterX = fixedCorner.x - (newWidth * cos) / 2 + (newHeight * sin) / 2
      newCenterY = fixedCorner.y - (newWidth * sin) / 2 - (newHeight * cos) / 2
      break
    }
  }

  // Calculate the new top-left position based on the new center
  newX = newCenterX - newWidth / 2
  newY = newCenterY - newHeight / 2

  // Ensure the item stays within bounds considering rotation
  const newCorners = [
    { x: -newWidth / 2, y: -newHeight / 2 }, // New Top-left
    { x: newWidth / 2, y: -newHeight / 2 }, // New Top-right
    { x: newWidth / 2, y: newHeight / 2 }, // New Bottom-right
    { x: -newWidth / 2, y: newHeight / 2 }, // New Bottom-left
  ].map((corner) => ({
    x: newCenterX + corner.x * cos - corner.y * sin,
    y: newCenterY + corner.x * sin + corner.y * cos,
  }))

  const minX = Math.min(...newCorners.map((corner) => corner.x))
  const maxX = Math.max(...newCorners.map((corner) => corner.x))
  const minY = Math.min(...newCorners.map((corner) => corner.y))
  const maxY = Math.max(...newCorners.map((corner) => corner.y))

  let counterCornerBorder = 0
  if (minX < 0) {
    newX -= minX
    counterCornerBorder += 1
  }
  if (minY < 0) {
    newY -= minY
    counterCornerBorder += 1
  }
  if (maxX > playgroundBounds.width) {
    newX -= maxX - playgroundBounds.width
    counterCornerBorder += 1
  }
  if (maxY > playgroundBounds.height) {
    newY -= maxY - playgroundBounds.height
    counterCornerBorder += 1
  }
  if (counterCornerBorder >= 2) return

  // Apply the calculated size and position
  item.width = newWidth
  item.height = newHeight
  item.x = newX
  item.y = newY

  emit('resizing', interactIndex.value)
  updateResize(interactIndex.value)
}, props.throttleDelay)

const stopResize = () => {
  emit('resize-end', interactIndex.value)
  interactIndex.value = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onResize)
  document.removeEventListener('touchend', stopResize)
}

//ROTATE
const startRotate = (event: MouseEvent | TouchEvent, index: number) => {
  const item = refItems.value[index]
  const itemEl = document.querySelector(`.item-${index}`)
  if (itemEl && item) {
    interactIndex.value = index

    // Calculate the center of the element
    const bounds = (itemEl as HTMLElement).getBoundingClientRect()
    centerX.value = bounds.left + bounds.width / 2
    centerY.value = bounds.top + bounds.height / 2

    const isTouch = event instanceof TouchEvent
    initialMouseX.value = isTouch ? event.touches[0].clientX : event.clientX
    initialMouseY.value = isTouch ? event.touches[0].clientY : event.clientY
    const dx = initialMouseX.value - centerX.value
    const dy = initialMouseY.value - centerY.value

    initialAngle.value = Math.atan2(dy, dx) * (180 / Math.PI) - (item.rotation ?? 0)

    // Add global listeners for rotation
    document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onRotate)
    document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopRotate)
    emit('rotation-start', index)
  }
}

const onRotate = throttle((event: MouseEvent | TouchEvent) => {
  event.stopPropagation()
  const playground = document.querySelector('.vue-drag-playground')
  if (!playground || interactIndex.value === null) return
  const item = refItems.value[interactIndex.value]
  const playgroundBounds = playground.getBoundingClientRect()

  const isTouch = event instanceof TouchEvent
  const clientX = isTouch ? event.touches[0].clientX : event.clientX
  const clientY = isTouch ? event.touches[0].clientY : event.clientY

  const dx = clientX - centerX.value
  const dy = clientY - centerY.value
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  const rotation = angle - initialAngle.value
  const newRotation = ((rotation ?? 0) * Math.PI) / 180
  const cos = Math.cos(newRotation)
  const sin = Math.sin(newRotation)

  const halfWidth = item.width / 2
  const halfHeight = item.height / 2

  // Ensure the item stays within bounds considering rotation
  const newCorners = [
    { x: -halfWidth, y: -halfHeight }, // New Top-left
    { x: halfWidth, y: -halfHeight }, // New Top-right
    { x: halfWidth, y: halfHeight }, // New Bottom-right
    { x: -halfWidth, y: halfHeight }, // New Bottom-left
  ].map((corner) => ({
    x: item.x + halfWidth + corner.x * cos - corner.y * sin,
    y: item.y + halfHeight + corner.x * sin + corner.y * cos,
  }))

  const minX = Math.min(...newCorners.map((corner) => corner.x))
  const maxX = Math.max(...newCorners.map((corner) => corner.x))
  const minY = Math.min(...newCorners.map((corner) => corner.y))
  const maxY = Math.max(...newCorners.map((corner) => corner.y))
  if (minX < 0 || minY < 0 || maxX > playgroundBounds.width || maxY > playgroundBounds.height) {
    return
  }
  // Update the item's rotation
  item.rotation = rotation
  emit('rotating', interactIndex.value)
}, props.throttleDelay)

const stopRotate = () => {
  if (interactIndex.value !== null) emit('rotation-end', interactIndex.value)
  interactIndex.value = null

  // Remove global listeners
  document.removeEventListener('mousemove', onRotate)
  document.removeEventListener('mouseup', stopRotate)
  document.removeEventListener('touchmove', onRotate)
  document.removeEventListener('touchend', stopRotate)
}

//DRAG
const startDrag = (event: MouseEvent | TouchEvent, index: number) => {
  emit('drag-start', index)
  interactIndex.value = index
  currentDragEl.value = event.currentTarget as HTMLElement

  const item = refItems.value[index]
  const isTouch = event instanceof TouchEvent
  offsetX.value = isTouch ? event.touches[0].clientX - item.x : event.clientX - item.x
  offsetY.value = isTouch ? event.touches[0].clientY - item.y : event.clientY - item.y
  // Add global listeners for dragging
  document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onDrag)
  document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopDrag)
}

const onDrag = throttle((event: MouseEvent | TouchEvent) => {
  event.stopPropagation()
  const playground = document.querySelector('.vue-drag-playground')
  if (!playground || interactIndex.value === null || currentDragEl.value === null) return

  emit('dragging', interactIndex.value)

  const playgroundBounds = playground.getBoundingClientRect()
  const item = refItems.value[interactIndex.value]
  const isTouch = event instanceof TouchEvent
  const clientX = isTouch ? event.touches[0].clientX : event.clientX
  const clientY = isTouch ? event.touches[0].clientY : event.clientY

  const newX = clientX - offsetX.value
  const newY = clientY - offsetY.value

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
}, props.throttleDelay)

const stopDrag = () => {
  interactIndex.value = null
  emit('drag-end', interactIndex.value)
  // Remove global listeners
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

onMounted(() => {
  props.items?.map((item, idx) => {
    const itemEl = document.querySelector(`.item-${idx}`)
    if (itemEl) {
      item.width = itemEl?.getBoundingClientRect().width
      item.height = itemEl?.getBoundingClientRect().height
    }
  })
  document.addEventListener('keydown', handleKeyDown)
})

// Ensure global event listeners are removed when component is unmounted
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onResize)
  document.removeEventListener('touchend', stopResize)
  document.removeEventListener('mousemove', onRotate)
  document.removeEventListener('mouseup', stopRotate)
  document.removeEventListener('touchmove', onRotate)
  document.removeEventListener('touchend', stopRotate)
})
</script>

<style scoped></style>
