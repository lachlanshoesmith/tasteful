<template>
  <div class="blur" :class="[{applyBlur}]" />
</template>

<script>
export default {
  name: 'Blur',
  props: {
    applyBlur: Boolean
  }
}
</script>

<style lang="scss" scoped>
.blur {
  position: absolute;
  z-index: 3;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  opacity: 0;
  pointer-events: none; // click through div without using display: none
  transition: all 0.2s linear;
  &.applyBlur {
    // this will not work on all browsers, but try if supported
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    // @supports isn't used here to ensure firefox users who have the right preferences enabled can also see it.
    pointer-events: initial;
    opacity: 1;
  }
}
</style>
