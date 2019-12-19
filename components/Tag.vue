<template>
  <span :class="[{ muted }]" class="tag">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    muted: Boolean
  }
}
</script>

<style lang="scss" scoped>
  .tag {
    text-transform: uppercase;
    font-size: 0.6rem;
    padding: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
    margin-right: 10px;
    display: inline-flex;
    align-items: center;
    background: linear-gradient(
      103.68deg,
      hsl(2, 46%, 40%) 0.09%,
      hsl(0, 68%, 45%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(0, 68%, 45%, 0.5);
    color: hsl(0, 100%, 94%);
    font-weight: 900;
    border-radius: 100px;

    &.muted {
      color: hsl(0, 10%, 64%);
      background: none;
      box-shadow: none;
    }
  }
</style>
