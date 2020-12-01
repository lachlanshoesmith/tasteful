<template>
  <p class="tag" :class="[{desaturated}, align]">
    <slot />
  </p>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    desaturated: Boolean,
    align: {
      type: String,
      default: 'centre'
    }
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
    &.centre {
      text-align: center;
    }
    &.left {
      text-align: left;
    }
    &.right {
      text-align: right;
      width: 100%;
    }
  }
</style>
