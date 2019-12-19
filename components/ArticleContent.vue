<template>
  <div class="article-content">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ArticleContent'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.article-content {
  width: 30vw;
}
@media (max-width: 1000px) {
  .article-content {
    width: 80vw;
  }
}
</style>
