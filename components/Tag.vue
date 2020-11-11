<template>
  <p class="tag" :class="{desaturated}">
    <slot />
  </p>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    desaturated: Boolean
  }
}
</script>

<style lang="scss" scoped>
  .tag {
    display: inline-block;
    color: $dimmish-purple;
    text-transform: uppercase;
    font-size: 14px;
    margin-top: 8px;
    margin-bottom: 8px;
    margin-right: 8px;
    font-weight: 700;
    letter-spacing: 1px;
    &.desaturated {
      color: $desaturated-dimmest-purple;
    }
  }
</style>
