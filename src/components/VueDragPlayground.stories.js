import VueDragPlayground from './VueDragPlayground.vue'
export default {
  title: 'Lib/Components/VueDragPlayground',

  component: VueDragPlayground,
}

const DefaultTemplate = (args) => ({
  components: { VueDragPlayground },

  setup() {
    return { args }
  },

  template: `
    <div>      
      <VueDragPlayground v-bind="args" class="w-full h-screen rounded-lg outline-black outline-2 outline bg-blue-200"/>
    </div>
  `,
})

export const Default = DefaultTemplate.bind({})

Default.args = {
  items: [
    {
      html: "<h1 style='background: blue; width: 100px'>Heading</h1>",
      x: 50,
      y: 50,
      rotation: 50,
    },
    {
      html: "<div class='yo' style='background: yellow; padding: 10px;'>Box</div>",
      x: 350,
      y: 300,
    },
    {
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
      name: 'soucoupe',
      html: "<img src='soucoupe.svg' width='100px' draggable='false'>",
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
