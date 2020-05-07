<template>
  <div class="mini-modal" :class="colourMode">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MiniModal',
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<style lang="scss" scoped>
  .mini-modal {
    position: absolute;
    z-index: 2;
    margin-top: 10px;
    right: 7%;
    padding: 20px;
    min-width: fit-content;
    border-radius: 20px;
    background: $snow-white;
    box-shadow: 0px 4px 10px $light-grey;
    transition: all 0.2s linear;
    &.dark {
      background: $deep-black;
      box-shadow: -2px 4px 10px $dark-grey;
    }
  }
</style>
