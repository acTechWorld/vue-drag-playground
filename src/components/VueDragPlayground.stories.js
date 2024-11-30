import VueDragPlayground from './VueDragPlayground.vue'
export default {
  title: 'Lib/Components/VueDragPlayground',

  component: VueDragPlayground,
}
import { ref } from 'vue'

const DefaultTemplate = (args) => ({
  components: { VueDragPlayground },
  setup() {
    const refItems = ref(args.items)
    const handleDragStart = (item) => {
      // refItems.value = refItems.value.map((it) =>
      //   it.name === item.name
      //     ? {
      //         ...item,
      //         html: ['astronaut', 'alien'].includes(item.name)
      //           ? item.html.replace(/(<img[^>]*src=')[^']*(')/i, `$1${item.name}_dragging.gif$2`)
      //           : item.html,
      //       }
      //     : it,
      // )
    }
    const handleDragEnd = (item) => {
      // refItems.value = refItems.value.map((it) =>
      //   it.name === item.name
      //     ? {
      //         ...item,
      //         html: ['astronaut', 'alien'].includes(item.name)
      //           ? item.html.replace(/(<img[^>]*src=')[^']*(')/i, `$1${item.name}.gif$2`)
      //           : item.html,
      //       }
      //     : it,
      // )
    }
    return { args, refItems, handleDragStart, handleDragEnd }
  },
  template: `
    <div>      
      <VueDragPlayground @drag-start="handleDragStart" @drag-end="handleDragEnd" v-bind="args" v-model="refItems" class="w-full h-screen rounded-lg outline-black outline-2 outline bg-blue-200"/>
    </div>
  `,
})

export const Default = DefaultTemplate.bind({})

Default.args = {
  items: [
    {
      name: 'block1',
      html: "<h1 style='background: blue; width: 100px'>Heading</h1>",
      x: 50,
      y: 50,
      rotation: 50,
    },
    {
      name: 'block2',
      html: "<div class='yo' style='background: yellow; padding: 10px;'>Box</div>",
      x: 350,
      y: 300,
    },
    {
      name: 'block3',
      html: "<div class='yo' style='background: green; padding: 10px;'>Box</div>",
      x: 100,
      y: 600,
      rotation: -50,
    },
    {
      name: 'rocket',
      html: "<img src='rocket.gif' draggable='false'>",
      x: 500,
      y: 500,
      width: 100,
      height: 100,
    },
    {
      name: 'moon',
      html: "<img src='moon.png' width='200px' height:'200px' draggable='false'>",
      x: 1000,
      y: 200,
      width: 200,
      height: 200,
    },
    {
      name: 'saturn',
      html: "<img src='saturn.png' width='300px' height='300px' draggable='false'>",
      x: 100,
      y: 500,
      width: 300,
      height: 300,
    },
    {
      name: 'alien',
      html: "<img src='alien.gif' width='100px' draggable='false'>",
      x: 150,
      y: 150,
      width: 100,
      height: 100,
    },
    {
      name: 'star',
      html: "<img src='star.gif' width='150px' height='150px' draggable='false'>",
      x: 50,
      y: 900,
      width: 150,
      height: 150,
    },
    {
      name: 'astronaut',
      html: "<img src='astronaut.gif' width='200px' draggable='false'>",
      x: 900,
      y: 700,
      width: 200,
      height: 200,
      rotation: 50,
    },
  ],
  isDrag: true,
  isResize: true,
  isRotate: true,
  isCopy: true,
  isDelete: true,
  maxNumberOfItems: 10,
  throttleDelay: 1,
}
