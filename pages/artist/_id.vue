<template>
  <main class="artist">
    <article-content>
      <masthead centred smaller>
        {{ artist.name }}
      </masthead>
      <list>
        <li>Country: {{ artist.country }}</li>
        <li>Gender: {{ artist.gender }}</li>
      </list>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import articleContent from '~/components/ArticleContent.vue'
import list from '~/components/List.vue'

export default {
  name: 'Artist',
  components: {
    masthead,
    articleContent,
    list
  },
  data () {
    return {
      id: this.$route.params.id,
      artist: {
        name: 'Querying...'
      }
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  mounted () {
    this.$axios.get('https://musicbrainz.org/ws/2/artist/?query=arid:' + this.id + '&fmt=json')
      .then((res) => {
        this.artist = res.data.artists[0]
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
