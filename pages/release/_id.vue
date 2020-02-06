<template>
  <main class="release">
    <article-content>
      <masthead>Querying...</masthead>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import articleContent from '~/components/ArticleContent.vue'
// import paragraphContainer from '~/components/ParagraphContainer.vue'
// import paragraph from '~/components/Paragraph.vue'

export default {
  name: 'Release',
  components: {
    masthead,
    articleContent
    // paragraph,
    // paragraphContainer
  },
  data () {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<style lang="scss" scoped>
.release {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
</style>
