<template>
  <span class="tag">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Tag'
}
</script>

<style lang="scss" scoped>
  .tag {
    color: $greyer-blue;
    text-transform: uppercase;
    font-size: 0.6rem;
    padding: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
    margin-right: 10px;
    display: inline-flex;
    align-items: center;
    font-weight: 900;
    border-radius: 100px;
  }
</style>
