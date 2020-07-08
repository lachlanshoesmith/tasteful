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
      id: this.$route.params.id,
      release: {}
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  mounted () {
    if (this.release.title === undefined) {
      // if the page is not loaded following a search we must find all the information again
      // get release group info from musicbrainz
      this.$axios
        .get(
          '/musicBrainzAPI/release-group/?query=mbid:"' + this.id + '"&fmt=json'
        )
        .then((res) => {
          this.release = res.data['release-groups'][0]
          document.title = 'tasteful | ' + this.release.title
        })
      // get release art
      this.$axios
        .get(
          '/coverArtArchive/release-group/' + this.id
        )
        .then((res) => {
          const imageURL = res.data.images[0].thumbnails.small
          this.$set(this.release, 'image', imageURL)
        })
        .catch((err) => {
          console.log('No album cover found.\n' + err)
        })
    } else {
      this.release = this.$store.state.search.release
      document.title = 'tasteful | ' + this.release.title
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
