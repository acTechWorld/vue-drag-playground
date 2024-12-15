# VueDragPlayground

VueDragPlayground is a versatile Vue 3 library designed to create dynamic and interactive user interfaces with drag, resize, and rotate functionalities. It allows developers to easily implement draggable, resizable, and rotatable elements in their applications, offering a smooth user experience powered by modern tooling like Vue 3 and Vite.

## Quick Links

- 🌐 [Live Demo](https://vuedragplayground.actechworld.com/)  
  Explore a live example of the component in action.
- 📚 [Storybook Documentation](https://vuedragplayground.storybook.actechworld.com/?path=/story/lib-components-vuedragplayground--default)
- 📦 [Npm package](https://www.npmjs.com/package/vue-drag-playground)  
  Here is the npm package
  Dive into detailed component stories and configurations.
- 💼 [LinkedIn](https://www.linkedin.com/in/antoine-canard/)  
  Here is my linkedin if you want to contact, me I'm always open for new challenges !

## Features

- **Drag**: Seamlessly move elements across the screen with intuitive drag gestures.
- **Resize**: Change element dimensions via resize handles.
- **Rotate**: Rotate elements freely to achieve precise orientations.
- **Copy and Delete**: Duplicate or remove elements dynamically.
- **Event Handling**: Capture and respond to drag, resize, and rotate actions.
- **Multi Interaction (CTRL Click)**: Hold `CTRL` and click on multiple elements to interact with them simultaneously for drag, resize, rotate, copy, or delete actions.

## Getting Started

### Installation

#### Package

To install VueDragPlayground, run:

```bash
npm install vue-drag-playground
```

#### Global Registration

In `main.ts` (Vue 3) or `main.js` (Vue 2), register the plugin globally:

##### For Vue 3:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import VueDragPlayground from 'vue-drag-playground'

const app = createApp(App)
app.use(VueDragPlayground)
app.mount('#app')
```

##### For Vue 2:

```javascript
import Vue from 'vue'
import App from './App.vue'
import VueDragPlayground from 'vue-drag-playground'

Vue.use(VueDragPlayground)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
```

#### Local Registration

Alternatively, register the component locally in a Vue file:

```vue
<template>
  <VueDragPlayground v-model="items" />
</template>

<script setup>
import { ref } from 'vue';  <!-- Use 'import { ref } from 'vue';' for Vue 3 -->
import VueDragPlayground from 'vue-drag-playground';

const items = ref([
  { id: 1, html: '<div>Item 1</div>', x: 100, y: 150, width: 200, height: 150, rotation: 0 },
  { id: 2, html: '<img src="image.jpg" alt="Image" />', x: 300, y: 200, width: 200, height: 150, rotation: 45 },
]);
</script>
```

For Vue 2, you will need to adjust the script as follows:

```vue
<template>
  <VueDragPlayground v-model="items" />
</template>

<script>
import VueDragPlayground from 'vue-drag-playground'

export default {
  components: {
    VueDragPlayground,
  },
  data() {
    return {
      items: [
        { id: 1, html: '<div>Item 1</div>', x: 100, y: 150, width: 200, height: 150, rotation: 0 },
        {
          id: 2,
          html: '<img src="image.jpg" alt="Image" />',
          x: 300,
          y: 200,
          width: 200,
          height: 150,
          rotation: 45,
        },
      ],
    }
  },
}
</script>
```

## Documentation

### Props

The component supports the following props to customize its behavior:

- **v-model** (`Array`): A list of draggable items. Each item contains properties like `id`, `html`, `x`, `y`, `width`, `height`, and `rotation`.

  - Each item should have this structure:
    ```typescript
    {
      id?: number,       // Optional unique identifier for the item
      name?: string,     // Optional name for the item
      html: string,      // HTML string to render inside the item
      x: number,         // X-coordinate for position
      y: number,         // Y-coordinate for position
      width?: number,    // Optional width of the item (recommended to set, especially for images)
      height?: number,   // Optional height of the item (recommended to set, especially for images)
      rotation?: number  // Optional rotation angle in degrees
    }
    ```

  **Note**:  
  While `width` and `height` are optional, it is highly recommended to set them initially, especially for images or elements that may have specific dimensions for proper rendering. If not set, the component may not render or position the item as expected, particularly for elements like images that rely on these properties.

- **isDrag** (`Boolean`): Enables/disables dragging functionality. Default: `true`.
- **isResize** (`Boolean`): Enables/disables resizing functionality. Default: `false`.
- **isRotate** (`Boolean`): Enables/disables rotation functionality. Default: `false`.
- **isCopy** (`Boolean`): Enables/disables item duplication. Default: `false`.
- **isDelete** (`Boolean`): Enables/disables item removal. Default: `false`.
- **isMultiSelect** (`Boolean`): Enables/disables multi-selection functionality with `CTRL` click. Default: `true`.
- **throttleDelay** (`Number`): Delay (in ms) to throttle events like dragging, resizing, and rotating. Default: `1`.
- **maxNumberOfItems** (`Number | undefined`): Maximum number of items allowed. If undefined, there is no limit (i.e., infinite items are allowed). Default: undefined.
- **multiRotationMode** (`String`): Specifies rotation behavior for grouped items when multiple items are selected for rotation. This prop can have the following values:
  - **'proportional'**: When this mode is selected, the items will maintain their individual rotation angles relative to each other. Essentially, the rotation of each item remains in proportion to its original angle.
  - **'uniform'**: In this mode, all selected items will be rotated to the same angle. The rotation is aligned, so all items will be rotated together as if they share the same angle.

### Emits

The following events can be emitted by the component to inform the parent about user interactions:

- `drag-start`: Fired when dragging starts. **Emits the updated item.**
- `dragging`: Fired while an item is being dragged. **Emits the updated item.**
- `drag-end`: Fired when dragging stops. **Emits the updated item.**
- `resize-start`: Fired when resizing starts. **Emits the updated item.**
- `resizing`: Fired while an item is being resized. **Emits the updated item.**
- `resize-end`: Fired when resizing stops. **Emits the updated item.**
- `rotation-start`: Fired when rotation starts. **Emits the updated item.**
- `rotating`: Fired while an item is being rotated. **Emits the updated item.**
- `rotation-end`: Fired when rotation stops. **Emits the updated item.**

Each event provides the entire updated item, including all properties such as its position (`x`, `y`), size (`width`, `height`), and rotation (`rotation`).

### Multi Interaction (CTRL Click)

VueDragPlayground supports **multi-selection interaction** using the `CTRL` key. By holding the `CTRL` key while clicking on multiple items, users can select and interact with those items simultaneously. This works for the following actions:

- **Drag**: Move multiple elements together.
- **Resize**: Resize multiple elements together.
- **Rotate**: Rotate multiple elements together.
- **Copy**: Duplicate multiple selected elements.
- **Delete**: Remove multiple selected elements.

This functionality is controlled by the `isMultiSelect` prop, which is enabled by default (`true`). To disable multi-selection, set `isMultiSelect` to `false`.

## Example Usage

Here’s how you can use VueDragPlayground to create an interactive UI, showcasing all the props:

```vue
<template>
  <VueDragPlayground
    v-model="items"
    :isDrag="true"
    :isResize="true"
    :isRotate="true"
    :isCopy="true"
    :isDelete="true"
    :isMultiSelect="true"
    :throttleDelay="5"
    :maxNumberOfItems="10"
    :multiRotationMode="'uniform'"
    @drag-start="onDragStart"
    @dragging="onDragging"
    @drag-end="onDragEnd"
    @resize-start="onResizeStart"
    @resizing="onResizing"
    @resize-end="onResizeEnd"
    @rotation-start="onRotationStart"
    @rotating="onRotating"
    @rotation-end="onRotationEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import VueDragPlayground from 'vue-drag-playground'

const items = ref([
  { id: 1, html: '<div>Item 1</div>', x: 100, y: 150, width: 200, height: 150, rotation: 0 },
  {
    id: 2,
    html: '<img src="image.jpg" alt="Image" />',
    x: 300,
    y: 200,
    width: 200,
    height: 150,
    rotation: 45,
  },
])

const onDragStart = (updatedItem) => console.log('Drag started:', updatedItem)
const onDragging = (updatedItem) => console.log('Dragging:', updatedItem)
const onDragEnd = (updatedItem) => console.log('Drag ended:', updatedItem)

const onResizeStart = (updatedItem) => console.log('Resize started:', updatedItem)
const onResizing = (updatedItem) => console.log('Resizing:', updatedItem)
const onResizeEnd = (updatedItem) => console.log('

Resize ended:', updatedItem)

const onRotationStart = (updatedItem) => console.log('Rotation started:', updatedItem)
const onRotating = (updatedItem) => console.log('Rotating:', updatedItem)
const onRotationEnd = (updatedItem) => console.log('Rotation ended:', updatedItem)
</script>
```

## License

This project is licensed under the MIT License.
