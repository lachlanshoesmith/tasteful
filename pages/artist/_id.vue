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
      <section v-if="singles.length > 0">
        <subheading>Singles</subheading>
        <list>
          <li v-for="(single, index) in singles" :key="index">
            {{ single.title }}
          </li>
        </list>
      </section>
      <section v-if="mixtapes.length > 0">
        <subheading>Mixtapes</subheading>
        <list>
          <li v-for="(mixtape, index) in mixtapes" :key="index">
            {{ mixtape.title }}
          </li>
        </list>
      </section>
      <section v-if="albums.length > 0">
        <subheading>Albums</subheading>
        <list>
          <li v-for="(album, index) in albums" :key="index">
            {{ album.title }}
          </li>
        </list>
        <section v-if="live.length > 0">
          <subheading no-top-margin smaller>
            Live
          </subheading>
          <list>
            <li v-for="(album, index) in live" :key="index">
              {{ album.title }}
            </li>
          </list>
        </section>
      </section>
      <section v-if="extendedPlays.length > 0">
        <subheading>EPs</subheading>
        <list>
          <li v-for="(ep, index) in extendedPlays" :key="index">
            {{ ep.title }}
          </li>
        </list>
      </section>
      <section v-if="broadcasts.length > 0">
        <subheading>Broadcasts</subheading>
        <list>
          <li v-for="(broadcast, index) in broadcast" :key="index">
            {{ broadcast.title }}
          </li>
        </list>
      </section>
      <section v-if="others.length > 0">
        <subheading>Other</subheading>
        <list>
          <li v-for="(other, index) in others" :key="index">
            {{ other.title }}
          </li>
        </list>
      </section>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import articleContent from '~/components/ArticleContent.vue'
import subheading from '~/components/Subheading.vue'
import list from '~/components/List.vue'

export default {
  name: 'Artist',
  components: {
    masthead,
    articleContent,
    subheading,
    list
  },
  data () {
    return {
      id: this.$route.params.id,
      artist: {
        name: 'Querying...'
      },
      singles: [],
      albums: [],
      live: [],
      extendedPlays: [],
      mixtapes: [],
      broadcasts: [],
      others: []
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  mounted () {
    // this.$axios.get('https://musicbrainz.org/ws/2/artist/?query=arid:' + this.id + '&fmt=json')
    //   .then((res) => {
    //     this.artist = res.data.artists[0]
    //     document.title = 'tasteful | ' + this.artist.name
    //   })
    // this.$axios.get('https://musicbrainz.org/ws/2/release-group/?query=arid:' + this.id + '+AND+status:official&limit=100&fmt=json')
    //   .then((res) => {
    //     this.releases = res.data['release-groups']
    //     this.sortReleasesByType()
    //   })
  },
  methods: {
    sortReleasesByType () {
      for (const release of this.releases) {
        if (release['primary-type'] === 'Single') {
          this.singles.push(release)
        } else if (release['primary-type'] === 'Album') {
          if (release['secondary-types'] && release['secondary-types']) {
            if (release['secondary-types'].includes('Mixtape/Street')) {
              this.mixtapes.push(release)
            } else if (release['secondary-types'].includes('Live')) {
              this.live.push(release)
            }
          } else {
            this.albums.push(release)
          }
        } else if (release['primary-type'] === 'EP') {
          this.extendedPlays.push(release)
        } else if (release['primary-type'] === 'Broadcast') {
          this.broadcasts.push(release)
        } else {
          this.others.push(release)
        }
      }
      this.singles.sort(
        (release1, release2) => this.sortReleasesAlphabetically(release1, release2)
      )
      this.mixtapes.sort(
        (release1, release2) => this.sortReleasesAlphabetically(release1, release2)
      )
      this.live.sort(
        (release1, release2) => this.sortReleasesAlphabetically(release1, release2)
      )
      this.albums.sort(
        (release1, release2) => this.sortReleasesAlphabetically(release1, release2)
      )
      this.extendedPlays.sort(
        (release1, release2) => this.sortReleasesAlphabetically(release1, release2)
      )
      this.broadcasts.sort(
        (release1, release2) => this.sortReleasesAlphabetically(release1, release2)
      )
      this.others.sort(
        (release1, release2) => this.sortReleasesAlphabetically(release1, release2)
      )
    },
    sortReleasesAlphabetically (release1, release2) {
      if (release1.title < release2.title) {
        return -1
      } else if (release1.title > release2.title) {
        return 1
      }
      return 0
    }
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
