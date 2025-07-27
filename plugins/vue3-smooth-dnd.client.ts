import { defineNuxtPlugin } from '#app'
import { Container, Draggable } from 'vue3-smooth-dnd'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Container', Container)
  nuxtApp.vueApp.component('Draggable', Draggable)
})
