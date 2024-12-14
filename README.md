Here is your `README.md` file formatted properly:

````markdown
# VueDragPlayground

VueDragPlayground is a versatile Vue 3 library designed to create dynamic and interactive user interfaces with drag, resize, and rotate functionalities. It allows developers to easily implement draggable, resizable, and rotatable elements in their applications, offering a smooth user experience powered by modern tooling like Vue 3 and Vite.

## Features

- **Drag**: Seamlessly move elements across the screen with intuitive drag gestures.
- **Resize**: Change element dimensions via resize handles.
- **Rotate**: Rotate elements freely to achieve precise orientations.
- **Copy and Delete**: Duplicate or remove elements dynamically.
- **Event Handling**: Capture and respond to drag, resize, and rotate actions.

## Getting Started

### Installation

To install VueDragPlayground, run:

```bash
npm install vue-drag-playground
```
````

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
  <VueDragPlayground />
</template>

<script setup>
import VueDragPlayground from 'vue-drag-playground'
</script>
```

## Props

The component supports the following props to customize its behavior:

- `items` (Array): A list of draggable items with properties such as position, size, rotation, and content.
- `isDrag` (Boolean): Enables/disables dragging functionality. Default: `true`.
- `isResize` (Boolean): Enables/disables resizing functionality. Default: `false`.
- `isRotate` (Boolean): Enables/disables rotation functionality. Default: `false`.
- `isCopy` (Boolean): Enables/disables item duplication. Default: `false`.
- `isDelete` (Boolean): Enables/disables item removal. Default: `false`.
- `throttleDelay` (Number): Delay (in ms) to throttle events like dragging, resizing, and rotating. Default: `1`.
- `maxNumberOfItems` (Number): Maximum number of items allowed. Default: `undefined`.
- `multiRotationMode` (String): Specifies rotation behavior for grouped items ('proportional' or 'uniform'). Default: `'proportional'`.

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

## Example Usage

Here’s how you can use VueDragPlayground to create an interactive UI:

```vue
<template>
  <VueDragPlayground
    :items="items"
    :isDrag="true"
    :isResize="true"
    :isRotate="true"
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

```

You can copy and paste this into a `README.md` file for your project. It includes all the necessary details about the component and is formatted for easy reading on platforms like GitHub. Let me know if you need any more changes!
```
