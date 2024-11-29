# VueDragPlayground

**VueDragPlayground** is a powerful and flexible Vue component library that enables drag, resize, and rotate functionality for elements on the page. It allows you to easily create interactive, draggable, resizable, and rotatable items within a Vue application. With customizable properties and event handling, VueDragPlayground makes it simple to build dynamic user interfaces where users can manipulate items through intuitive gestures.

VueDragPlayground is highly configurable and can be integrated seamlessly into any Vue project.

## Features

- **Drag**: Items can be moved around the screen.
- **Resize**: Items can be resized via drag handles.
- **Rotate**: Items can be rotated freely.
- **Copy and Delete**: Items can be duplicated or removed dynamically.
- **Event Handling**: Emit events for drag, resize, and rotate actions.

## Table of Contents

- [Props](#props)
  - [items](#items)
  - [isDrag](#isdrag)
  - [isResize](#isresize)
  - [isRotate](#isrotate)
  - [isCopy](#iscopy)
  - [isDelete](#isdelete)
  - [throttleDelay](#throttledelay)
  - [maxNumberOfItems](#maxnumberofitems)
  - [multiRotationMode](#multirotationmode)
- [Emits](#emits)
  - [drag-start](#drag-start)
  - [dragging](#dragging)
  - [drag-end](#drag-end)
  - [resize-start](#resize-start)
  - [resizing](#resizing)
  - [resize-end](#resize-end)
  - [rotation-start](#rotation-start)
  - [rotating](#rotating)
  - [rotation-end](#rotation-end)
- [Example Usage](#example-usage)
- [License](#license)

## Props

The following props can be passed to the component to configure its behavior:

### `items`

- **Type**: `Array<PropsDraggableItem>`
- **Default**: `[]`
- A list of draggable items. Each item contains properties that define the appearance, position, and dimensions of the item.

#### Fields of `PropsDraggableItem`:

- `html` (String)

  - **Description**: The HTML content to be rendered for the draggable item. This allows custom content to be displayed inside the item.
  - **Example**: `'<div class="item-content">Item 1</div>'`

- `x` (Number)

  - **Description**: The X-coordinate for the position of the item on the screen. This value determines the horizontal position of the item.
  - **Example**: `100`

- `y` (Number)

  - **Description**: The Y-coordinate for the position of the item on the screen. This value determines the vertical position of the item.
  - **Example**: `150`

- `width` (Number, optional)

  - **Description**: The width of the item in pixels. If not specified, the item will use a default width or adjust automatically based on content.
  - **Example**: `200`

- `height` (Number, optional)

  - **Description**: The height of the item in pixels. If not specified, the item will use a default height or adjust automatically based on content.
  - **Example**: `150`

- `rotation` (Number, optional)
  - **Description**: The rotation angle of the item in degrees. Positive values rotate the item clockwise, while negative values rotate it counterclockwise.
  - **Example**: `45` (rotates the item 45 degrees clockwise)

### `isDrag`

- **Type**: `Boolean`
- **Default**: `true`
- Enables or disables the drag functionality. When `true`, items are draggable.

### `isResize`

- **Type**: `Boolean`
- **Default**: `false`
- Enables or disables the resize functionality. When `true`, items can be resized.

### `isRotate`

- **Type**: `Boolean`
- **Default**: `false`
- Enables or disables the rotate functionality. When `true`, items can be rotated.

### `isCopy`

- **Type**: `Boolean`
- **Default**: `false`
- Enables or disables the ability to copy items. When `true`, items can be duplicated.

### `isDelete`

- **Type**: `Boolean`
- **Default**: `false`
- Enables or disables the ability to delete items. When `true`, items can be deleted.

### `throttleDelay`

- **Type**: `Number`
- **Default**: `1`
- Sets the delay (in milliseconds) for throttling the drag, resize, and rotate events. This controls how often these events are triggered to optimize performance.

### `maxNumberOfItems`

- **Type**: `Number | undefined`
- **Default**: `undefined`
- Defines the maximum number of items that can be handled by the component. If set to `undefined`, there is no limit.

### `multiRotationMode`

- **Type**: `'proportional' | 'uniform'`
- **Default**: `'proportional'`
- Defines how multiple items should rotate in a group:
  - `'proportional'`: Items maintain their relative rotation (based on the initial angle).
  - `'uniform'`: All items align at the same angle during rotation.

## Emits

The component emits the following events that can be listened to by the parent component:

### `drag-start`

- **Description**: Emitted when dragging an item starts.
- **Payload**: `{ itemId: number }` - The ID of the item being dragged.

### `dragging`

- **Description**: Emitted while an item is being dragged.
- **Payload**: `{ itemId: number, x: number, y: number }` - The ID of the item and its current position (`x`, `y`).

### `drag-end`

- **Description**: Emitted when dragging an item ends.
- **Payload**: `{ itemId: number, x: number, y: number }` - The ID of the item and its final position (`x`, `y`).

### `resize-start`

- **Description**: Emitted when resizing an item starts.
- **Payload**: `{ itemId: number, handle: ResizingHandle }` - The ID of the item and the handle used for resizing (e.g., `top-right`, `bottom-left`).

### `resizing`

- **Description**: Emitted while an item is being resized.
- **Payload**: `{ itemId: number, handle: ResizingHandle, width: number, height: number }` - The ID of the item, the resizing handle, and the current width and height.

### `resize-end`

- **Description**: Emitted when resizing an item ends.
- **Payload**: `{ itemId: number, width: number, height: number }` - The ID of the item and its final width and height.

### `rotation-start`

- **Description**: Emitted when rotation of an item starts.
- **Payload**: `{ itemId: number, angle: number }` - The ID of the item and the rotation angle at the start.

### `rotating`

- **Description**: Emitted while an item is being rotated.
- **Payload**: `{ itemId: number, angle: number }` - The ID of the item and its current rotation angle.

### `rotation-end`

- **Description**: Emitted when rotation of an item ends.
- **Payload**: `{ itemId: number, angle: number }` - The ID of the item and its final rotation angle.

## Example Usage

```vue
<template>
  <DraggableComponent
    :items="items"
    :isDrag="true"
    :isResize="true"
    :isRotate="true"
    @drag-start="handleDragStart"
    @dragging="handleDragging"
    @drag-end="handleDragEnd"
    @resize-start="handleResizeStart"
    @resizing="handleResizing"
    @resize-end="handleResizeEnd"
    @rotation-start="handleRotationStart"
    @rotating="handleRotating"
    @rotation-end="handleRotationEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import DraggableComponent from './components/DraggableComponent.vue'

const items = ref([
  {
    html: '<div>Item 1</div>',
    x: 100,
    y: 150,
    width: 200,
    height: 150,
    rotation: 0,
  },
  {
    html: '<div>Item 2</div>',
    x: 300,
    y: 200,
    width: 200,
    height: 150,
    rotation: 45,
  },
])

const handleDragStart = (event) => {
  console.log('Drag started', event)
}

const handleDragging = (event) => {
  console.log('Dragging', event)
}

const handleDragEnd = (event) => {
  console.log('Drag ended', event)
}

const handleResizeStart = (event) => {
  console.log('Resize started', event)
}

const handleResizing = (event) => {
  console.log('Resizing', event)
}

const handleResizeEnd = (event) => {
  console.log('Resize ended', event)
}

const handleRotationStart = (event) => {
  console.log('Rotation started', event)
}

const handleRotating = (event) => {
  console.log('Rotating', event)
}

const handleRotationEnd = (event) => {
  console.log('Rotation ended', event)
}
</script>
```

## License

This version removes the redundant section and adds the MIT license at the end of the
README. You can now distribute this in your project or use it as needed!
