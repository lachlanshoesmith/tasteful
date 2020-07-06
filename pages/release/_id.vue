<template>
  <main class="release">
    <article-content class="release-content">
      <img class="release-image" :class="[colourMode]" :src="release.image" :alt="release.title">
      <masthead fit-width centred>
        {{ release.title }}
      </masthead>
      <text-input no-icon centred placeholder="Enter a score out of 100." />
      <paragraph-container>
        <paragraph soft>
          Album ratings are currently in alpha. Enjoy cataloguing early, though!
        </paragraph>
      </paragraph-container>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import articleContent from '~/components/ArticleContent.vue'
import textInput from '~/components/TextInput.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'

export default {
  name: 'Release',
  components: {
    masthead,
    articleContent,
    textInput,
    paragraph,
    paragraphContainer
  },
  data () {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    },
    release () {
      return this.$store.state.search.release
    }
  },
  mounted () {
    document.title = 'tasteful | ' + this.release.title
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
.release-image {
  border-radius: 15px;
  box-shadow: 0px 0px 50px;
  max-width: 60vw;
  margin-top: 20px;
  margin-bottom: 20px;
  &.light {
    color: $quite-light-grey;
  }
  &.dark {
    color: $saturated-purple-dim;
  }
  &.black {
    color: $black;
  }
  &.solarised-light {
    color: $solarised-light-main-background;
  }
  &.solarised-dark {
    color: $solarised-dark-main-background;
  }
}
.release-content {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
