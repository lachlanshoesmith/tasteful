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
      <img :src="imageURL" :alt="imageURL">
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
import crypto from 'crypto'
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
      imageURL: '',
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
      const searchResult = () => {
        this.$axios
          .get(
            'https://musicbrainz.org/ws/2/artist/?query=artist:"' + this.searchQuery + '"?inc=genres&fmt=json'
          )
          .then((res) => {
            const artists = res.data.artists
            artists.forEach((artist) => {
              artistInfo(artist)
              this.artists.push(artist)
            })
          })
      }
      const artistInfo = (artist) => {
        this.$axios.get(
          'https://musicbrainz.org/ws/2/artist/' + artist.id + '?inc=url-rels&fmt=json'
        )
          .then((res) => {
            artistRelations(res.data.relations)
          })
      }
      const artistRelations = (relations) => {
        relations.forEach((relation) => {
          // get wikidata link
          if (relation.type === 'wikidata') {
            // get wikidata ID
            const wikidataID = relation.url.resource.slice(30) // https://www.wikidata.org/wiki/ = 30 chars
            // lookup image
            getImage(wikidataID)
          }
        })
      }
      const getImage = (wikidataID) => {
        this.$axios
          .get(
            '/wikidataAPI?action=wbgetclaims&format=json&origin=*&property=P18&entity=' + wikidataID
          )
          .then((res) => {
            // get filename and location
            // (this process is a serious pain)
            const imageInfo = res.data.claims.P18[0].mainsnak
            const imageName = imageInfo.datavalue.value.replace(/ /g, '_')
            const hashedImageName = crypto.createHash('md5').update(imageName).digest('hex')
            const firstCharacterInHash = hashedImageName.charAt(0)
            const secondCharacterInHash = hashedImageName.charAt(1)
            const imageURL = 'https://upload.wikimedia.org/wikipedia/commons/' + firstCharacterInHash + '/' + firstCharacterInHash + secondCharacterInHash + '/' + imageName
            this.imageURL = imageURL
          })
          .finally(() => {
            this.loadingSearchResults = false
          })
      }
      searchResult() // begins the search
      this.loadingSearchResults = true
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