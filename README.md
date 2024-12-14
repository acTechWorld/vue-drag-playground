# VueDragPlayground

VueDragPlayground is a versatile Vue 3 library designed to create dynamic and interactive user interfaces with drag, resize, and rotate functionalities. It allows developers to easily implement draggable, resizable, and rotatable elements in their applications, offering a smooth user experience powered by modern tooling like Vue 3 and Vite.

## Features

- **Drag**: Seamlessly move elements across the screen with intuitive drag gestures.
- **Resize**: Change element dimensions via resize handles.
- **Rotate**: Rotate elements freely to achieve precise orientations.
- **Copy and Delete**: Duplicate or remove elements dynamically.
- **Event Handling**: Capture and respond to drag, resize, and rotate actions.
- **Multi Interaction (CTRL Click)**: Hold `CTRL` and click on multiple elements to interact with them simultaneously for drag, resize, or rotate actions.

## Getting Started

### Installation

To install VueDragPlayground, run:

```bash
npm install vue-drag-playground
```

### Usage

#### Global Registration

In `main.ts`, register the plugin globally:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import VueDragPlayground from 'vue-drag-playground'

const app = createApp(App)
app.use(VueDragPlayground)
app.mount('#app')
```

#### Local Registration

Alternatively, register the component locally in a Vue file:

```vue
<template>
  <VueDragPlayground v-model="items" />
</template>

<script setup>
import { ref } from 'vue'
import VueDragPlayground from 'vue-drag-playground'

const items = ref([
  { id: 1, html: '<div>Item 1</div>', x: 100, y: 150, width: 200, height: 150, rotation: 0 },
  { id: 2, html: '<div>Item 2</div>', x: 300, y: 200, width: 200, height: 150, rotation: 45 },
])
</script>
```

## Props

The component supports the following props to customize its behavior:

- `v-model` (Array): A list of draggable items with properties such as position, size, rotation, and content.
  Each item has the following structure:

  ```typescript
  {
    id?: number,       // Optional unique identifier for the item
    name?: string,     // Optional name for the item
    html: string,      // HTML string to render inside the item
    x: number,         // X-coordinate for position
    y: number,         // Y-coordinate for position
    width?: number,    // Optional width of the item
    height?: number,   // Optional height of the item
    rotation?: number  // Optional rotation angle in degrees
  }
  ```

- `isDrag` (Boolean): Enables/disables dragging functionality. Default: `true`.
- `isResize` (Boolean): Enables/disables resizing functionality. Default: `false`.
- `isRotate` (Boolean): Enables/disables rotation functionality. Default: `false`.
- `isCopy` (Boolean): Enables/disables item duplication. Default: `false`.
- `isDelete` (Boolean): Enables/disables item removal. Default: `false`.
- `throttleDelay` (Number): Delay (in ms) to throttle events like dragging, resizing, and rotating. Default: `1`.
- `maxNumberOfItems` (Number): Maximum number of items allowed. Default: `undefined`.
- `multiRotationMode` (String): Specifies rotation behavior for grouped items ('proportional' or 'uniform'). Default: `'proportional'`.
- `isMultiSelect` (Boolean): Enables/disables multi-selection functionality with `CTRL` click. Default: `true`.

## Emits

The following events can be emitted by the component to inform the parent about user interactions:

- `drag-start`: Fired when dragging starts.
- `dragging`: Fired while an item is being dragged.
- `drag-end`: Fired when dragging stops.
- `resize-start`: Fired when resizing starts.
- `resizing`: Fired while an item is being resized.
- `resize-end`: Fired when resizing stops.
- `rotation-start`: Fired when rotation starts.
- `rotating`: Fired while an item is being rotated.
- `rotation-end`: Fired when rotation stops.

Each event provides a payload with details such as the item ID and relevant action parameters (e.g., position, size, or angle).

## Multi Interaction (CTRL Click)

VueDragPlayground supports **multi-selection interaction** using the `CTRL` key. By holding the `CTRL` key while clicking on multiple items, users can select and interact with those items simultaneously, such as:

- Dragging multiple elements together
- Resizing multiple elements together
- Rotating multiple elements together

This functionality is controlled by the `isMultiSelect` prop, which is enabled by default (`true`). To disable multi-selection, set `isMultiSelect` to `false`.

## Example Usage

Here’s how you can use VueDragPlayground to create an interactive UI:

```vue
<template>
  <VueDragPlayground
    v-model="items"
    :isDrag="true"
    :isResize="true"
    :isRotate="true"
    :isMultiSelect="true"
    @drag-start="onDragStart"
    @dragging="onDragging"
    @drag-end="onDragEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import VueDragPlayground from 'vue-drag-playground'

const items = ref([
  { id: 1, html: '<div>Item 1</div>', x: 100, y: 150, width: 200, height: 150, rotation: 0 },
  { id: 2, html: '<div>Item 2</div>', x: 300, y: 200, width: 200, height: 150, rotation: 45 },
])

const onDragStart = (event) => console.log('Drag started:', event)
const onDragging = (event) => console.log('Dragging:', event)
const onDragEnd = (event) => console.log('Drag ended:', event)
</script>
```

## License

This project is licensed under the MIT License.
