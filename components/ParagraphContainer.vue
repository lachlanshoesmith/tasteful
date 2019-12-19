<template>
  <div class="paragraph-container">
    <div :class="{ alwaysFull }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParagraphContainer',
  props: {
    alwaysFull: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.paragraph-container {
  display: flex;
  justify-content: center;
}

.alwaysFull {
  width: 100%;
}
</style>
