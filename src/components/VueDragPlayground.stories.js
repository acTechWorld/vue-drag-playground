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
      <VueDragPlayground v-bind="args" ref="onboardingTourPoppin" class="w-full h-screen border-2 rounded-lg bg-blue-200"/>
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
      width: 100,
      height: 24,
    },
    {
      html: "<div class='yo' style='background: yellow; padding: 10px;'>Box</div>",
      x: 350,
      y: 300,
    },
  ],
  resizable: true,
}
