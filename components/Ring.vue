<template>
  <div class="ring-container">
    <!-- https://css-tricks.com/building-progress-ring-quickly/ thanks guys :) -->
    <svg class="ring" :height="width" :width="width">
      <circle
        v-if="shadow"
        class="ring-circle shadow"
        :stroke-width="strokeWidth"
        :stroke="colour"
        fill="transparent"
        :r="radius"
        :cx="position"
        :cy="position"
      />
      <circle
        class="ring-circle"
        :style="{ 'stroke-dashoffset': circumference - percent / 100 * circumference, 'stroke-dasharray': `${circumference} ${circumference}` }"
        :stroke-width="strokeWidth"
        :stroke="colour"
        fill="transparent"
        :r="radius"
        :cx="position"
        :cy="position"
      />
    </svg>
    <div class="inside-ring" :style="{ 'width': `${width}px`, 'height': `${width}px`, 'top': `calc(0% + 96px)` }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Ring',
  props: {
    width: {
      type: Number,
      default: 128
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    percent: {
      type: Number,
      default: 4
    },
    colour: {
      type: String,
      default: 'hsl(252, 70%, 56%)' // saturated-purple
    },
    shadow: Boolean
  },
  data () {
    return {
      circumference: undefined,
      position: undefined,
      radius: undefined
    }
  },
  watch: {
    width () {
      this.calculateDimensions()
    }
  },
  created () {
    this.calculateDimensions()
  },
  methods: {
    calculateDimensions () {
      this.radius = (this.width / 2) - (this.strokeWidth * 2)
      this.circumference = this.radius * 2 * Math.PI
      this.position = this.width / 2
    }
  }
}
</script>

<style lang="scss" scoped>
.ring {
  display: flex;
  transform: rotate(180deg);
  position: relative;
}
.ring-circle {
  transition: stroke-dashoffset 0.2s;
}
.shadow {
  opacity: 0.1;
}
.inside-ring {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
