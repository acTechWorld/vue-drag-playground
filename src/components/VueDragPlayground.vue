<template>
  <div
    class="vue-drag-playground select-none relative w-full h-full"
    @mousedown="handleClickPlayground"
  >
    <div
      v-for="(item, index) in displayedItems"
      :key="index"
      class="w-fit h-fit absolute group"
      :class="`item_container_${index}`"
      :style="{
        left: item.x + 'px',
        top: item.y + 'px',
      }"
    >
      <!-- Copy and Delete buttons -->
      <div
        v-if="(isCopy || isDelete) && !isCtrl"
        class="copy_delete_btn_container z-0 group-hover:z-[2] group-hover:opacity-100 transition-opacity duration-500 group-hover:pointer-events-auto pointer-events-none opacity-0 absolute flex gap-2"
        :class="{ 'opacity-100 z-[2]': interactId === item.id }"
        :style="calculateMenuPos(item.id)"
      >
        <svg
          v-if="isCopy"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="copy_btn_icon fill-black h-5 cursor-pointer"
          @mousedown.stop="handleCopyItem(item.id)"
        >
          <path
            d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
          />
        </svg>
        <svg
          v-if="isDelete"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="delete_btn_icon fill-black h-5 cursor-pointer"
          @mousedown.stop="handleDeleteItem(item.id)"
        >
          <path
            d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
          />
        </svg>
      </div>
      <div
        :class="{
          'cursor-grabbing': interactId === item.id && isDrag && !isCtrl,
          'cursor-grab': interactId !== item.id && isDrag && !isCtrl,
          'cursor-pointer': isCtrl,
          'border-dashed border-2 border-black': ctrlSelectedItemsId.includes(item.id),
          'z-[3]': interactId === item.id || ctrlSelectedItemsId.includes(item.id),
        }"
        class="item_controler_panel z-[1] relative group-hover:z-[3]"
        :style="{
          transform: `rotate(${item.rotation}deg) translate3d(0, 0, 0)`,
        }"
        @click.stop="handleClickItem(item.id)"
        @mousedown.stop="startDrag($event, item.id)"
        @touchstart.stop="startDrag($event, item.id)"
      >
        <div :class="`item-${item.id}`" v-html="DOMPurify.sanitize(item.html)"></div>
        <div v-if="isResize && !isCtrl" class="resize_btn_container">
          <div
            style="transform: rotate(-45deg)"
            class="resize_btn_top_right w-4 h-4 absolute bg-white/50 rounded-[50%] -top-1 -right-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none group/cursor"
            :class="{ 'opacity-100': interactId === item.id }"
            @mousedown.stop="startResize($event, item.id, 'top-right')"
            @touchstart.stop="startResize($event, item.id, 'top-right')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
              class="hidden group-hover/cursor:block cursor-none"
            >
              <g :fill="interactId === item.id ? 'green' : 'black'">
                <path
                  d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22v56H160v-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22v-56h192v56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"
                />
              </g>
            </svg>
          </div>
          <div
            style="transform: rotate(45deg)"
            class="resize_btn_top_left w-4 h-4 absolute bg-white/50 rounded-[50%] -top-1 -left-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none group/cursor"
            :class="{ 'opacity-100': interactId === item.id }"
            @mousedown.stop="startResize($event, item.id, 'top-left')"
            @touchstart.stop="startResize($event, item.id, 'top-left')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
              class="hidden group-hover/cursor:block cursor-none"
            >
              <g :fill="interactId === item.id ? 'green' : 'black'">
                <path
                  d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22v56H160v-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22v-56h192v56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"
                />
              </g>
            </svg>
          </div>
          <div
            style="transform: rotate(45deg)"
            class="resize_btn_bottom_right w-4 h-4 absolute bg-white/50 rounded-[50%] -bottom-1 -right-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none group/cursor"
            :class="{ 'opacity-100': interactId === item.id }"
            @mousedown.stop="startResize($event, item.id, 'bottom-right')"
            @touchstart.stop="startResize($event, item.id, 'bottom-right')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
              class="hidden group-hover/cursor:block cursor-none"
            >
              <g :fill="interactId === item.id ? 'green' : 'black'">
                <path
                  d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22v56H160v-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22v-56h192v56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"
                />
              </g>
            </svg>
          </div>
          <div
            style="transform: rotate(-45deg)"
            class="resize_btn_bottom_left w-4 h-4 absolute bg-white/50 rounded-[50%] -bottom-1 -left-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none group/cursor"
            :class="{ 'opacity-100': interactId === item.id }"
            @mousedown.stop="startResize($event, item.id, 'bottom-left')"
            @touchstart.stop="startResize($event, item.id, 'bottom-left')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
              class="hidden group-hover/cursor:block cursor-none"
            >
              <g :fill="interactId === item.id ? 'green' : 'black'">
                <path
                  d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22v56H160v-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22v-56h192v56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"
                />
              </g>
            </svg>
          </div>
        </div>
        <div
          v-if="isRotate && !isCtrl"
          class="rotate_btn absolute top-0 flex w-full h-10 -translate-y-full group-hover:pointer-events-auto pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="rotate_btn_icon w-6 h-6 p-1 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:pointer-events-auto pointer-events-none absolute bg-black rounded-[50%] cursor-pointer top-2 left-1/2 transform -translate-x-1/2"
            :class="[
              { 'opacity-100': interactId === item.id },
              interactId === item.id && isRotating ? 'fill-green-500' : 'fill-white',
            ]"
            @mousedown.stop="startRotate($event, item.id)"
            @touchstart.stop="startRotate($event, item.id)"
          >
            <path
              d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onUnmounted,
  onMounted,
  nextTick,
  type Ref,
  reactive,
  type Reactive,
  computed,
  watch,
} from 'vue'
import DOMPurify from 'dompurify'
interface DraggableItem {
  id?: number
  name?: string
  html: string // HTML string to render
  x: number // X-coordinate for position
  y: number // Y-coordinate for position
  width?: number
  height?: number
  rotation?: number
}

export type DrapPlaygroundProps = {
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

type ResizingHandle = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'

const props = withDefaults(defineProps<DrapPlaygroundProps>(), {
  isDrag: true,
  isResize: false,
  isRotate: false,
  isMultiSelect: true,
  isCopy: false,
  isDelete: false,
  throttleDelay: 1,
  maxNumberOfItems: undefined,
  multiRotationMode: 'proportional',
})

//COMMON
const items: Ref<DraggableItem[]> = defineModel({ default: [] })

const initialValues: Reactive<{
  [key: number]: {
    initialAngle: number
    initialWidth: number
    initialHeight: number
  }
}> = reactive({})
const ctrlSelectedItemsId: Ref<number[]> = ref([])
const blockingLeftMulti = ref(false)
const blockingRightMulti = ref(false)
const blockingTopMulti = ref(false)
const blockingBottomMulti = ref(false)
const firstBlockingCtrlInteractionXDone: Ref<false | number> = ref(false)
const firstBlockingCtrlInteractionYDone: Ref<false | number> = ref(false)
const maxIdUsed = ref(1)
const interactId = ref<number | null>(null)
const isCtrl = ref(false)
const isCtrlC = ref(false)

//DRAG
const offsetX = ref(0) // Track X offset
const offsetY = ref(0) // Track Y offset
const currentDragEl = ref<HTMLElement | null>(null)

//RESIZE
const initialMouseX = ref(0)
const initialMouseY = ref(0)
const resizingHandle = ref<ResizingHandle | null>(null)

//ROTATION
const centerX = ref(0)
const centerY = ref(0)
const isRotating = ref(false)

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
 * COMPUTED
 */

const displayedItems = computed(() =>
  items.value
    .map((item, key) => ({
      ...item,
      id: item.id ?? key + 1,
      width: item.width ?? 0,
      height: item.height ?? 0,
      rotation: item.rotation ?? 0,
    }))
    ?.slice(0, props.maxNumberOfItems),
)
const noIdItems = computed(() => items.value.filter((item) => item.id === undefined))
const noSizeItems = computed(() =>
  items.value.filter((item) => item.width === undefined || item.height === undefined),
)
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

const calculateMenuPos = (id: number) => {
  const item = items.value.find((item) => item.id === id)
  const playground = document.querySelector('.vue-drag-playground')

  if (playground && item) {
    const playgroundBounds = playground.getBoundingClientRect()
    const widthItem = item.width ?? 0
    const heightItem = item.height ?? 0
    if (item.x + widthItem + 75 > playgroundBounds.width) {
      if (item.y > 70) {
        return {
          top: '-60px',
          paddingBottom: `${heightItem + 40}px`,
          paddingRight: `${widthItem - 40}px`,
        }
      } else {
        return {
          bottom: '-60px',
          paddingTop: `${heightItem + 40}px`,
          paddingRight: `${widthItem - 40}px`,
        }
      }
    } else {
      if (item.y > 70) {
        return {
          paddingLeft: `${widthItem + 30}px`,
          top: '-28px',
          paddingBottom: `${heightItem + 10}px`,
        }
      } else {
        return {
          paddingLeft: `${widthItem + 30}px`,
          bottom: '-28px',
          paddingTop: `${heightItem + 10}px`,
        }
      }
    }
  }
  return { paddingLeft: 'calc(100% + 30px)', top: '-28px', paddingBottom: '100%' }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.isMultiSelect) {
    if (isCtrl.value) {
      if (event.key === 'c') {
        // Copy logic
        isCtrlC.value = true
      } else if (isCtrlC.value && event.key === 'v') {
        // Paste logic
        ctrlSelectedItemsId.value.forEach((id) => copyItem(id))
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        ctrlSelectedItemsId.value.forEach((id) => deleteItem(id))
        ctrlSelectedItemsId.value = []
      }
    } else {
      isCtrl.value = event.key === 'Control' || event.key === 'Meta'
    }
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    isCtrl.value = false
  }
}

const handleClickPlayground = () => {
  if (!isCtrl.value && !isRotating.value) {
    ctrlSelectedItemsId.value = []
  }
}

//COPY
const copyItem = (id: number) => {
  if (props.isCopy && (!props.maxNumberOfItems || props.maxNumberOfItems > items.value.length)) {
    const playground = document.querySelector('.vue-drag-playground')
    const item = items.value.find((item) => item.id === id)
    if (item && playground) {
      const rotation = ((item.rotation ?? 0) * Math.PI) / 180
      const halfWidth = (item.width ?? 0) / 2
      const halfHeight = (item.height ?? 0) / 2
      // Calculate rotated corners relative to the center
      const corners = [
        { x: -halfWidth, y: -halfHeight }, // Top-left
        { x: halfWidth, y: -halfHeight }, // Top-right
        { x: halfWidth, y: halfHeight }, // Bottom-right
        { x: -halfWidth, y: halfHeight }, // Bottom-left
      ].map((corner) => ({
        x: item.x + halfWidth + corner.x * Math.cos(rotation) - corner.y * Math.sin(rotation),
        y: item.y + halfHeight + corner.x * Math.sin(rotation) + corner.y * Math.cos(rotation),
      }))

      // Get maximum offsets caused by rotation
      const maxX = Math.max(...corners.map((corner) => corner.x))
      const maxY = Math.max(...corners.map((corner) => corner.y))
      const playgroundBounds = playground.getBoundingClientRect()
      maxIdUsed.value += 1
      // Create a shallow copy of the item properties, adjust position slightly to avoid overlap
      const newItem = {
        ...item,
        x: maxX + 20 < playgroundBounds.width ? item.x + 20 : item.x - 20, // Adjust x position to prevent overlap
        y: maxY + 20 < playgroundBounds.height ? item.y + 20 : item.y - 20, // Adjust y position to prevent overlap
        html: item.html, // Preserve HTML content
        id: maxIdUsed.value,
      }
      items.value.push(newItem) // Add the copied item to the list
      initialValues[newItem.id] = {
        initialAngle: 0, //Help for managing rotation
        initialWidth: item.width ?? 0, //Help for managing resize
        initialHeight: item.height ?? 0, //Help for managing resize
      }
    }
  }
}

const handleCopyItem = (id: number) => {
  if (ctrlSelectedItemsId.value?.length > 0 && ctrlSelectedItemsId.value.includes(id)) {
    ctrlSelectedItemsId.value.forEach((localId) => {
      const ctrlItem = items.value.find((refItem) => refItem.id === localId)
      if (ctrlItem && ctrlItem.id) {
        copyItem(ctrlItem.id)
      }
    })
  } else {
    copyItem(id)
  }
}

//DELETE
const deleteItem = (id: number) => {
  if (props.isDelete) {
    items.value.splice(
      items.value.findIndex((item) => item.id === id),
      1,
    )
    interactId.value = null
  }
}

const handleDeleteItem = (id: number) => {
  if (ctrlSelectedItemsId.value?.length > 0 && ctrlSelectedItemsId.value.includes(id)) {
    ctrlSelectedItemsId.value.forEach((localId) => {
      const ctrlItem = items.value.find((refItem) => refItem.id === localId)
      if (ctrlItem && ctrlItem.id) {
        deleteItem(ctrlItem.id)
      }
    })
  } else {
    deleteItem(id)
  }
}

//CTRL CLICK
const handleClickItem = (id: number) => {
  if (isCtrl.value) {
    if (ctrlSelectedItemsId.value.includes(id)) {
      ctrlSelectedItemsId.value = ctrlSelectedItemsId.value.filter((itemId) => itemId !== id)
    } else {
      ctrlSelectedItemsId.value.push(id)
    }
  }
}

//RESIZE
const applyStyleSizeItems = () => {
  items.value.forEach((item) => {
    if (item.id !== undefined) {
      const itemEl = document.querySelector(`.item-${item.id}`)
      if (itemEl) {
        const child = itemEl.children?.[0] as HTMLElement
        if (child) {
          if (item.width) child.style.width = `${item.width}px`
          if (item.height) child.style.height = `${item.height}px`
        }
      }
    }
  })
}
const startResize = (event: MouseEvent | TouchEvent, id: number, handle: ResizingHandle) => {
  if (props.isResize && !isCtrl.value) {
    const item = items.value.find((item) => item.id === id)
    const itemEl = document.querySelector(`.item-${id}`)
    if (itemEl && item && item.id !== undefined) {
      emit('resize-start', item, handle)
      interactId.value = id
      resizingHandle.value = handle
      const isTouch = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
      initialMouseX.value = isTouch ? event.touches[0].clientX : (event as MouseEvent).clientX
      initialMouseY.value = isTouch ? event.touches[0].clientY : (event as MouseEvent).clientY
      if (ctrlSelectedItemsId.value?.length > 0 && ctrlSelectedItemsId.value.includes(id)) {
        ctrlSelectedItemsId.value.forEach((localId) => {
          const ctrlItem = items.value.find((refItem) => refItem.id === localId)
          if (ctrlItem) {
            initialValues[localId].initialWidth = ctrlItem.width ?? 0
            initialValues[localId].initialHeight = ctrlItem.height ?? 0
          }
        })
      } else {
        initialValues[id].initialWidth = item.width ?? 0
        initialValues[id].initialHeight = item.height ?? 0
      }
      document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onResize)
      document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopResize)
    }
  }
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max))
}

const onResize = throttle((event: MouseEvent | TouchEvent) => {
  //TODO fix multi resize with items rotate in oposite angles
  event.stopPropagation()
  const playground = document.querySelector('.vue-drag-playground')
  const item = items.value.find((item) => item.id === interactId.value)
  if (!playground || !item || interactId.value === null || resizingHandle.value === null) return

  const playgroundBounds = playground.getBoundingClientRect()

  const isTouch = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
  const clientX = isTouch ? event.touches[0].clientX : (event as MouseEvent).clientX
  const clientY = isTouch ? event.touches[0].clientY : (event as MouseEvent).clientY

  const dx = clientX - initialMouseX.value
  const dy = clientY - initialMouseY.value
  if (
    ctrlSelectedItemsId.value?.length > 0 &&
    item.id !== undefined &&
    ctrlSelectedItemsId.value.includes(item.id)
  ) {
    ctrlSelectedItemsId.value.forEach((localId) => {
      const ctrlItem = items.value.find((refItem) => refItem.id === localId)
      if (ctrlItem) {
        updateResizeItem(ctrlItem, dx, dy, playgroundBounds)
      }
    })
  } else {
    updateResizeItem(item, dx, dy, playgroundBounds)
  }
}, props.throttleDelay)

const updateResizeItem = (
  item: DraggableItem,
  dx: number,
  dy: number,
  playgroundBounds: DOMRect,
) => {
  // Calculate rotation
  const rotation = ((item.rotation ?? 0) * Math.PI) / 180
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)

  const itemWidth = item.width ?? 0
  const itemHeight = item.height ?? 0
  const halfWidth = itemWidth / 2
  const halfHeight = itemHeight / 2
  const centerX = item.x + itemWidth / 2
  const centerY = item.y + itemHeight / 2

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
  // Calculate deltas in rotated space

  const rotatedDx = dx * cos + dy * sin
  const rotatedDy = dy * cos - dx * sin
  let newWidth = item.width ?? 0
  let newHeight = item.height ?? 0
  let newX = item.x
  let newY = item.y

  // Determine the fixed corner and calculate new center
  let fixedCorner // This will hold the position of the fixed corner
  let newCenterX: number = 0,
    newCenterY: number = 0
  if (item.id !== undefined) {
    const initialValuesItem = initialValues[item.id]
    switch (resizingHandle.value) {
      case 'bottom-right': {
        fixedCorner = corners[0] // Top-left
        newWidth = clamp(initialValuesItem.initialWidth + rotatedDx, 10, playgroundBounds.width)
        newHeight = clamp(initialValuesItem.initialHeight + rotatedDy, 10, playgroundBounds.height)

        // Calculate the new center based on the fixed corner
        newCenterX = fixedCorner.x + (newWidth * cos) / 2 - (newHeight * sin) / 2
        newCenterY = fixedCorner.y + (newWidth * sin) / 2 + (newHeight * cos) / 2
        break
      }
      case 'bottom-left': {
        fixedCorner = corners[1] // Top-right
        newWidth = clamp(initialValuesItem.initialWidth - rotatedDx, 10, playgroundBounds.width)
        newHeight = clamp(initialValuesItem.initialHeight + rotatedDy, 10, playgroundBounds.height)

        // Calculate the new center based on the fixed corner
        newCenterX = fixedCorner.x - (newWidth * cos) / 2 - (newHeight * sin) / 2
        newCenterY = fixedCorner.y - (newWidth * sin) / 2 + (newHeight * cos) / 2
        break
      }
      case 'top-right': {
        fixedCorner = corners[3] // Bottom-left
        newWidth = clamp(initialValuesItem.initialWidth + rotatedDx, 10, playgroundBounds.width)
        newHeight = clamp(initialValuesItem.initialHeight - rotatedDy, 10, playgroundBounds.height)

        // Calculate the new center based on the fixed corner
        newCenterX = fixedCorner.x + (newWidth * cos) / 2 + (newHeight * sin) / 2
        newCenterY = fixedCorner.y + (newWidth * sin) / 2 - (newHeight * cos) / 2
        break
      }
      case 'top-left': {
        fixedCorner = corners[2] // Bottom-right
        newWidth = clamp(initialValuesItem.initialWidth - rotatedDx, 10, playgroundBounds.width)
        newHeight = clamp(initialValuesItem.initialHeight - rotatedDy, 10, playgroundBounds.height)

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

    emit('resizing', item)
  }
}

const stopResize = () => {
  const item = items.value.find((item) => item.id === interactId.value)
  emit('resize-end', item)
  interactId.value = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onResize)
  document.removeEventListener('touchend', stopResize)
}

//ROTATE
const startRotate = (event: MouseEvent | TouchEvent, id: number) => {
  if (props.isRotate && !isCtrl.value) {
    const item = items.value.find((item) => item.id === id)
    const itemEl = document.querySelector(`.item-${id}`)
    if (itemEl && item && item.id !== undefined) {
      interactId.value = id
      isRotating.value = true
      // Calculate the center of the element
      const bounds = (itemEl as HTMLElement).getBoundingClientRect()
      centerX.value = bounds.left + bounds.width / 2
      centerY.value = bounds.top + bounds.height / 2

      const isTouch = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
      initialMouseX.value = isTouch ? event.touches[0].clientX : (event as MouseEvent).clientX
      initialMouseY.value = isTouch ? event.touches[0].clientY : (event as MouseEvent).clientY
      const dx = initialMouseX.value - centerX.value
      const dy = initialMouseY.value - centerY.value

      if (ctrlSelectedItemsId.value?.length > 0 && ctrlSelectedItemsId.value.includes(id)) {
        ctrlSelectedItemsId.value.forEach((localId) => {
          const ctrlItem = items.value.find((refItem) => refItem.id === localId)
          if (ctrlItem && ctrlItem.id !== undefined) {
            const initialValuesItem = initialValues[ctrlItem.id]
            initialValuesItem.initialAngle =
              Math.atan2(dy, dx) * (180 / Math.PI) - (ctrlItem.rotation ?? 0)
          }
        })
      } else {
        const initialValuesItem = initialValues[item.id]
        initialValuesItem.initialAngle = Math.atan2(dy, dx) * (180 / Math.PI) - (item.rotation ?? 0)
      }

      // Add global listeners for rotation
      document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onRotate)
      document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopRotate)
      emit('rotation-start', item)
    }
  }
}

const onRotate = throttle((event: MouseEvent | TouchEvent) => {
  event.stopPropagation()

  const playground = document.querySelector('.vue-drag-playground')
  const item = items.value.find((item) => item.id === interactId.value)

  if (!playground || !item || item.id === undefined || interactId.value === null) return
  const playgroundBounds = playground.getBoundingClientRect()

  const isTouch = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
  const clientX = isTouch ? event.touches[0].clientX : (event as MouseEvent).clientX
  const clientY = isTouch ? event.touches[0].clientY : (event as MouseEvent).clientY

  const dx = clientX - centerX.value
  const dy = clientY - centerY.value
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  const initialValuesItem = initialValues[item.id]
  const rotation = angle - initialValuesItem.initialAngle
  if (
    ctrlSelectedItemsId.value?.length > 0 &&
    item.id !== undefined &&
    ctrlSelectedItemsId.value.includes(item.id)
  ) {
    ctrlSelectedItemsId.value.forEach((localId) => {
      const ctrlItem = items.value.find((refItem) => refItem.id === localId)
      if (ctrlItem && ctrlItem.id !== undefined) {
        const initialValuesItem = initialValues[ctrlItem.id]
        const ctrlItemRotation =
          props.multiRotationMode === 'uniform' ? rotation : angle - initialValuesItem.initialAngle
        updateRotationItem(ctrlItem, ctrlItemRotation, playgroundBounds)
      }
    })
  } else {
    updateRotationItem(item, rotation, playgroundBounds)
  }
}, props.throttleDelay)

const updateRotationItem = (item: DraggableItem, rotation: number, playgroundBounds: DOMRect) => {
  const newRotation = ((rotation ?? 0) * Math.PI) / 180
  const cos = Math.cos(newRotation)
  const sin = Math.sin(newRotation)

  const halfWidth = (item.width ?? 0) / 2
  const halfHeight = (item.height ?? 0) / 2

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
  emit('rotating', item)
}

const stopRotate = () => {
  const item = items.value.find((item) => item.id === interactId.value)
  emit('rotation-end', item)
  interactId.value = null
  isRotating.value = false

  // Remove global listeners
  document.removeEventListener('mousemove', onRotate)
  document.removeEventListener('mouseup', stopRotate)
  document.removeEventListener('touchmove', onRotate)
  document.removeEventListener('touchend', stopRotate)
}

//DRAG
const startDrag = (event: MouseEvent | TouchEvent, id: number) => {
  if (props.isDrag && !isCtrl.value) {
    const item = items.value.find((item) => item.id === id)
    if (item) {
      emit('drag-start', item)
      interactId.value = id
      currentDragEl.value = event.currentTarget as HTMLElement

      const isTouch = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
      offsetX.value = isTouch
        ? event.touches[0].clientX - item.x
        : (event as MouseEvent).clientX - item.x
      offsetY.value = isTouch
        ? event.touches[0].clientY - item.y
        : (event as MouseEvent).clientY - item.y
      // Add global listeners for dragging
      document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onDrag)
      document.addEventListener(isTouch ? 'touchend' : 'mouseup', stopDrag)
    }
  }
}

const onDrag = throttle((event: MouseEvent | TouchEvent) => {
  event.stopPropagation()
  const playground = document.querySelector('.vue-drag-playground')
  const item = items.value.find((item) => item.id === interactId.value)

  if (!playground || !item || interactId.value === null || currentDragEl.value === null) return

  emit('dragging', item)

  const playgroundBounds = playground.getBoundingClientRect()
  const isTouch = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
  const clientX = isTouch ? event.touches[0].clientX : (event as MouseEvent).clientX
  const clientY = isTouch ? event.touches[0].clientY : (event as MouseEvent).clientY

  const newX = clientX - offsetX.value
  const newY = clientY - offsetY.value
  if (
    ctrlSelectedItemsId.value?.length > 0 &&
    item.id !== undefined &&
    ctrlSelectedItemsId.value.includes(item.id)
  ) {
    const newPosCtrlItems: {
      [key: number]: {
        calcX: number
        calcY: number
        minX: number
        minY: number
        maxX: number
        maxY: number
      }
    } = {}
    ctrlSelectedItemsId.value.forEach((localId) => {
      const ctrlItem = items.value.find((refItem) => refItem.id === localId)
      if (ctrlItem && ctrlItem.id !== undefined) {
        const {
          x: calcX,
          y: calcY,
          minX,
          minY,
          maxX,
          maxY,
        } = calculateDragItemNewPos(
          ctrlItem,
          ctrlItem.x + newX - item.x,
          ctrlItem.y + newY - item.y,
          playgroundBounds,
          true,
        )
        newPosCtrlItems[ctrlItem.id] = { calcX, calcY, minX, minY, maxX, maxY }
      }
    })
    if (
      blockingLeftMulti.value ||
      blockingRightMulti.value ||
      blockingBottomMulti.value ||
      blockingTopMulti.value
    ) {
      let blockingXIndex: number | false = false
      let blockingYIndex: number | false = false
      if (firstBlockingCtrlInteractionXDone.value) {
        if (blockingLeftMulti.value || blockingRightMulti.value) {
          blockingXIndex = firstBlockingCtrlInteractionXDone.value
        } else {
          firstBlockingCtrlInteractionXDone.value = false
        }
      } else {
        if (blockingLeftMulti.value) {
          const indexString = Object.entries(newPosCtrlItems).reduce<
            [string | null, { minX: number }]
          >(
            (min, [key, value]) => {
              return value.minX < min[1].minX ? [key, value] : min
            },
            [null, { minX: Infinity }], // Initial value
          )[0]
          blockingXIndex = indexString ? parseInt(indexString) : false
          firstBlockingCtrlInteractionXDone.value = blockingXIndex
        } else if (blockingRightMulti.value) {
          const indexString = Object.entries(newPosCtrlItems).reduce<
            [string | null, { maxX: number }]
          >(
            (max, [key, value]) => {
              return value.maxX > max[1].maxX ? [key, value] : max
            },
            [null, { maxX: -Infinity }], // Initial value
          )[0]
          blockingXIndex = indexString ? parseInt(indexString) : false
          firstBlockingCtrlInteractionXDone.value = blockingXIndex
        } else {
          firstBlockingCtrlInteractionXDone.value = false
        }
      }

      if (firstBlockingCtrlInteractionYDone.value) {
        if (blockingTopMulti.value || blockingBottomMulti.value) {
          blockingYIndex = firstBlockingCtrlInteractionYDone.value
        } else {
          firstBlockingCtrlInteractionYDone.value = false
        }
      } else {
        if (blockingTopMulti.value) {
          const indexString = Object.entries(newPosCtrlItems).reduce<
            [string | null, { minY: number }]
          >(
            (min, [key, value]) => {
              return value.minY < min[1].minY ? [key, value] : min
            },
            [null, { minY: Infinity }], // Initial value
          )[0]
          blockingYIndex = indexString ? parseInt(indexString) : false
          firstBlockingCtrlInteractionYDone.value = blockingYIndex
        } else if (blockingBottomMulti.value) {
          const indexString = Object.entries(newPosCtrlItems).reduce<
            [string | null, { maxY: number }]
          >(
            (max, [key, value]) => {
              return value.maxY > max[1].maxY ? [key, value] : max
            },
            [null, { maxY: -Infinity }], // Initial value
          )[0]
          blockingYIndex = indexString ? parseInt(indexString) : false
          firstBlockingCtrlInteractionYDone.value = blockingYIndex
        } else {
          firstBlockingCtrlInteractionYDone.value = false
        }
      }
      const dXBlocking = blockingXIndex
        ? newPosCtrlItems[blockingXIndex].calcX -
          (items.value.find((refItem) => refItem.id === blockingXIndex)?.x ?? 0)
        : 0
      const dYBlocking = blockingYIndex
        ? newPosCtrlItems[blockingYIndex].calcY -
          (items.value.find((refItem) => refItem.id === blockingYIndex)?.y ?? 0)
        : 0
      ctrlSelectedItemsId.value.forEach((localId) => {
        const ctrlItem = items.value.find((refItem) => refItem.id === localId)
        if (ctrlItem && ctrlItem.id !== undefined) {
          ctrlItem.x =
            blockingXIndex && blockingXIndex !== ctrlItem.id
              ? ctrlItem.x + dXBlocking
              : newPosCtrlItems[ctrlItem.id].calcX
          ctrlItem.y =
            blockingYIndex && blockingYIndex !== ctrlItem.id
              ? ctrlItem.y + dYBlocking
              : newPosCtrlItems[ctrlItem.id].calcY
        }
      })
    } else {
      ctrlSelectedItemsId.value.forEach((localId) => {
        const ctrlItem = items.value.find((refItem) => refItem.id === localId)
        if (ctrlItem && ctrlItem.id !== undefined) {
          ctrlItem.x = newPosCtrlItems[ctrlItem.id].calcX
          ctrlItem.y = newPosCtrlItems[ctrlItem.id].calcY
        }
      })
      firstBlockingCtrlInteractionXDone.value = false
      firstBlockingCtrlInteractionYDone.value = false
    }
    blockingLeftMulti.value = false
    blockingRightMulti.value = false
    blockingBottomMulti.value = false
    blockingTopMulti.value = false
  } else {
    const { x: calcX, y: calcY } = calculateDragItemNewPos(
      item,
      newX,
      newY,
      playgroundBounds,
      false,
    )
    item.x = calcX
    item.y = calcY
  }
}, props.throttleDelay)

const calculateDragItemNewPos = (
  item: DraggableItem,
  newX: number,
  newY: number,
  playgroundBounds: DOMRect,
  isMultipleDrag: boolean,
) => {
  const rotation = ((item.rotation ?? 0) * Math.PI) / 180
  const halfWidth = (item.width ?? 0) / 2
  const halfHeight = (item.height ?? 0) / 2

  // Calculate rotated corners relative to the center
  const corners = [
    { x: -halfWidth, y: -halfHeight }, // Top-left
    { x: halfWidth, y: -halfHeight }, // Top-right
    { x: halfWidth, y: halfHeight }, // Bottom-right
    { x: -halfWidth, y: halfHeight }, // Bottom-left
  ].map((corner) => ({
    x: corner.x * Math.cos(rotation) - corner.y * Math.sin(rotation) + item.x + halfWidth,
    y: corner.x * Math.sin(rotation) + corner.y * Math.cos(rotation) + item.y + halfHeight,
  }))

  // Get maximum offsets caused by rotation
  const minX = Math.min(...corners.map((corner) => corner.x))
  const maxX = Math.max(...corners.map((corner) => corner.x))
  const minY = Math.min(...corners.map((corner) => corner.y))
  const maxY = Math.max(...corners.map((corner) => corner.y))

  // Calculate new position clamped to the boundaries
  let clampedX = newX
  let clampedY = newY

  // Clamp the x-coordinate
  if (minX + (newX - item.x) < 0) {
    clampedX = item.x + (0 - minX) // Align to left boundary
    blockingLeftMulti.value = isMultipleDrag
  } else if (maxX + (newX - item.x) > playgroundBounds.width) {
    clampedX = item.x + (playgroundBounds.width - maxX) // Align to right boundary
    blockingRightMulti.value = isMultipleDrag
  }

  // Clamp the y-coordinate
  if (minY + (newY - item.y) < 0) {
    clampedY = item.y + (0 - minY) // Align to top boundary
    blockingTopMulti.value = isMultipleDrag
  } else if (maxY + (newY - item.y) > playgroundBounds.height) {
    clampedY = item.y + (playgroundBounds.height - maxY) // Align to bottom boundary
    blockingBottomMulti.value = isMultipleDrag
  }

  // Update the item's position with precise boundary alignment
  return {
    x: clampedX,
    y: clampedY,
    minX,
    maxX,
    minY,
    maxY,
  }
}
const stopDrag = () => {
  const item = items.value.find((item) => item.id === interactId.value)
  emit('drag-end', item)
  interactId.value = null
  // Remove global listeners
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

const initItems = () => {
  const playground = document.querySelector('.vue-drag-playground')
  if (playground) {
    const playgroundBounds = playground.getBoundingClientRect()
    items.value?.map((item) => {
      const itemEl = document.querySelector(`.item-${item.id}`)
      const bounds = itemEl?.getBoundingClientRect()
      if (itemEl && bounds) {
        item.width = item.width ? item.width : bounds.width
        item.height = item.height ? item.height : bounds.height
        const { x: calcX, y: calcY } = calculateDragItemNewPos(
          item,
          item.x,
          item.y,
          playgroundBounds,
          false,
        )
        item.x = calcX
        item.y = calcY
      }
    })
  }
}

//LIFECYCLE
onMounted(() => {
  items.value = items.value.map((item, key) => {
    initialValues[key + 1] = {
      initialAngle: 0, //Help for managing rotation
      initialWidth: item.width ?? 0, //Help for managing resize
      initialHeight: item.height ?? 0, //Help for managing resize
    }
    return {
      id: key + 1,
      ...item,
    }
  })
  maxIdUsed.value = items.value?.length
  applyStyleSizeItems()
  nextTick(() => initItems())
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', initItems)
})
// Ensure global event listeners are removed when component is unmounted
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
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

defineExpose({ initItems })
/** WATCH */
watch(
  () => props.maxNumberOfItems,
  () => nextTick(() => applyStyleSizeItems()),
)
watch(
  items,
  () => {
    if (noIdItems.value?.length > 0) {
      items.value = items.value?.map((item) => {
        if (!item.id) {
          maxIdUsed.value += 1
          initialValues[maxIdUsed.value] = {
            initialAngle: 0, //Help for managing rotation
            initialWidth: item.width ?? 0, //Help for managing resize
            initialHeight: item.height ?? 0, //Help for managing resize
          }
          return {
            id: maxIdUsed.value,
            ...item,
          }
        } else {
          return item
        }
      })
    }
    nextTick(() => {
      if (noSizeItems.value?.length > 0) initItems()
      applyStyleSizeItems()
    })
  },
  { deep: true },
)
</script>
