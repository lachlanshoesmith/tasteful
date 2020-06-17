<template>
  <label :class="[colourMode]" class="checkbox-container">
    <input type="checkbox" checked="checked">
    <span class="checkmark" />
    <slot />
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-container {
  &.light {
    color: hsl(222, 5%, 20%);
  }
  &.dark {
    color: $quite-light-grey;
  }
}
</style>
