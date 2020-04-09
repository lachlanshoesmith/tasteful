<template>
  <div :class="[{wider}]" class="article-content">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ArticleContent',
  props: {
    wider: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.article-content {
  width: 30vw;
  &.wider {
    width: auto;
    min-width: 30vw;
    max-width: 40vw;
  }
}
@media (max-width: 1000px) {
  .article-content {
    width: 80vw;
    &.wider {
      min-width: 80vw;
      max-width: 95vw;
    }
  }
}
</style>
