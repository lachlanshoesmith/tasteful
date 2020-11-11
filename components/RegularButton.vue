<template>
  <button class="regular-button" :class="[{secondary}, colourMode]" @click="$emit('pressed')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'RegularButton',
  props: {
    secondary: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.regular-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.2s linear;
  color: hsl(253, 100%, 94%);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  background: none;
  padding-top: 16px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 16px;
  margin-right: 16px;
  border-radius: 10px;

  &.light {
    color: $dimmish-purple;
  }
  &.secondary {
    color: $desaturated-lightest-purple;
  }
  &:hover {
    cursor: pointer;
    color: $lightest-purple;
    &.light {
      background: $saturated-purple;
      box-shadow: 0px 0px 10px hsl(252, 20%, 56%);
    }
  }
  &:focus {
    outline: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }
}
</style>
