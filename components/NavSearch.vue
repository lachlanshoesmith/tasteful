<template>
  <div class="nav-search">
    <text-input
      class="search-bar"
      no-bottom-margin
      placeholder="Search..."
      focus-manual-blur-handling
      @input="searchQuery = $event"
      @focus="updateDisplay"
    >
      <template v-slot:icon>
        <magnify-icon title="Search" />
      </template>
    </text-input>
    <div v-if="searching" class="search-content-container" :class="[{loadingSearchResults}]" @click="clickedWithinSearch = true">
      <masthead centred fit-width no-left-margin-on-large-screens>
        Search results
      </masthead>
      <div class="results">
        <div v-for="artist in artists" :key="artist.id" class="artist">
          {{ artist.name }}
        </div>
      </div>
      <button @click="search">
        Update search results
      </button>
    </div>
  </div>
</template>

<script>
import textInput from '@/components/TextInput.vue'
import magnifyIcon from 'vue-material-design-icons/Magnify.vue'
import masthead from '@/components/Masthead.vue'

export default {
  name: 'NavSearch',
  components: {
    textInput,
    magnifyIcon,
    masthead
  },
  data () {
    return {
      searching: false,
      clickedWithinSearch: false,
      searchQuery: '',
      searchResult: [],
      loadingSearchResults: false,
      artists: [
        'Drake',
        'Jay-Z',
        'Kendrick Lamar'
      ]
    }
  },
  methods: {
    updateDisplay (focused) {
      if (focused) {
        this.searching = true
      } else if (!focused && !this.clickedWithinSearch) {
        this.searching = false
      }
    },
    search () {
      this.loadingSearchResults = true
      this.artists = []
      this.$axios
        .get(
          'https://musicbrainz.org/ws/2/artist/?query=artist:"' + this.searchQuery + '"?inc=genres&fmt=json'
        )
        .then((res) => {
          const artists = res.data.artists
          artists.forEach((artist) => {
            // get artist info
            this.$axios
              .get(
                'https://musicbrainz.org/ws/2/artist/' + artist.id + '?inc=url-rels&fmt=json'
              )
              .then((res) => {
                // get wikidata link
                res.data.relations.forEach((relation) => {
                  if (relation.type === 'wikidata') {
                    // get wikidata ID
                    const wikidataID = relation.url.resource.slice(-7)
                    // lookup image
                    this.$axios
                      .get(
                        'https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=' + wikidataID
                      )
                      .then((res) => {
                        console.log(res)
                        this.artists.push(artist)
                      })
                  }
                })
              })
            this.loadingSearchResults = false
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-search {
  width: 100%;
}
.search-bar {
  width: 100%;
}
.text-input-container {
  margin-left: auto;
}
.search-content-container {
  display: block;
  position: absolute;
  border-top: solid 5px green;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba($deep-black, 0.8);
  color: $saturated-blue;
  &.loadingSearchResults {
    border-top-color: red;
  }
}
.results {
  display: flex;
}
.artist {
  margin-right: 20px;
}
</style>
