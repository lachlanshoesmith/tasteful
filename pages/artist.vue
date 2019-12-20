<template>
  <main class="artist">
    <article-content>
      <masthead centred smaller>
        {{ artist.name }}
      </masthead>
      <paragraph-container>
        <paragraph>
          <ul>
            <li>Country: {{ artist.country }}</li>
            <li>Gender: {{ artist.gender }}</li>
          </ul>
        </paragraph>
      </paragraph-container>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import articleContent from '~/components/ArticleContent.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'

export default {
  name: 'Artist',
  components: {
    masthead,
    articleContent,
    paragraph,
    paragraphContainer
  },
  data () {
    return {
      id: this.$route.params.artist,
      artist: {
        name: 'Querying...'
      }
    }
  },
  computed: {
    colourMode () {
      return this.$store.getters.colourMode
    }
  },
  mounted () {
    this.axios.get('https://musicbrainz.org/ws/2/artist/?query=arid:' + this.id + '?inc=url-rels+genres&fmt=json')
      .then((res) => {
        this.artist = res.data.artists
        document.title = 'tasteful | ' + this.artist.name
      })
  }
}
</script>

<style lang="scss" scoped>
.artist {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
</style>
