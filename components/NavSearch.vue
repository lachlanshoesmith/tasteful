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
    <div v-if="searching" class="search-content-container" :class="{loadingSearchResults}" @click="clickedWithinSearch = true">
      <masthead centred fit-width no-left-margin-on-large-screens>
        Search results
      </masthead>
      <div class="results">
        <div v-for="artist in artists" :key="artist.id" class="artist">
          <div v-if="artist.imageURLLowRes" id="artist-image" class="artist-image" :style="{ 'background-image': 'url(' + artist.imageURL + '), url(' + artist.imageURLLowRes + ')' }" />
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
import Vibrant from 'node-vibrant'

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
      imageURLLowRes: '',
      loadingSearchResults: false,
      artists: []
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
            '/musicBrainzAPI/artist/?query=artist:"' + this.searchQuery + '"?inc=genres&fmt=json'
          )
          .then((res) => {
            const artists = res.data.artists
            artists.forEach((artist, i) => {
              artistInfo(artist, i)
              this.artists.push(artist)
            })
          })
      }
      const artistInfo = (artist, index) => {
        this.$axios.get(
          '/musicBrainzAPI/artist/' + artist.id + '?inc=url-rels&fmt=json'
        )
          .then((res) => {
            artistRelations(res.data.relations, index)
          })
      }
      const artistRelations = (relations, index) => {
        for (let relationIndex = 0; relationIndex < relations.length; relationIndex++) {
          const relation = relations[relationIndex]
          // get wikidata link
          if (relation.type === 'wikidata') {
            // get wikidata ID
            const wikidataID = relation.url.resource.slice(30) // https://www.wikidata.org/wiki/ = 30 chars
            // lookup image
            getImage(wikidataID, index)
            break
          }
        }
      }
      const getImage = (wikidataID, index) => {
        this.$axios
          .get(
            '/wikidataAPI?action=wbgetclaims&format=json&origin=*&property=P18&entity=' + wikidataID
          )
          .then((res) => {
            // get filename and location
            // (this process is a serious pain)
            const imageInfo = res.data.claims.P18[0].mainsnak
            // remove invalid characters before hash
            let imageName = imageInfo.datavalue.value.replace(/ /g, '_')
            const hashedImageName = crypto.createHash('md5').update(imageName).digest('hex')
            const firstCharacterInHash = hashedImageName.charAt(0)
            const secondCharacterInHash = hashedImageName.charAt(1)
            // remove other invalid characters after hash (generates incorrect md5 otherwise)
            imageName = imageName.replace('(', '%28') // no regex here as these should only occur once.
            imageName = imageName.replace(')', '%29')
            // download very low res image first
            const lowResolutionImageURL = 'https://commons.wikimedia.org/w/thumb.php?width=10&f=' + imageName // only 10px wide; stretched and blurred while loading the main image.
            this.artists[index].imageURLLowRes = lowResolutionImageURL
            // Note: may replace full resolution URL with a good-enough alternative (eg. 400px) in the future
            const imageURL = 'https://upload.wikimedia.org/wikipedia/commons/' + firstCharacterInHash + '/' + firstCharacterInHash + secondCharacterInHash + '/' + imageName
            this.artists[index].imageURL = imageURL
            // get colours
            getColours(imageName, index)
          })
          .finally(() => {
            this.loadingSearchResults = false
          })
      }
      const getColours = (imageName, index) => {
        const proxyLowResolutionImageURL = '/wikimediaCommons?width=10&f=' + imageName
        const imagePalette = {}
        const v = new Vibrant(proxyLowResolutionImageURL)
        v.getPalette()
          .then((palette) => {
            Object.keys(palette).forEach((colour) => {
              const r = palette[colour]._rgb[0]
              const g = palette[colour]._rgb[1]
              const b = palette[colour]._rgb[2]
              const formattedRGB = `rgb(${r}, ${g}, ${b})`
              imagePalette[colour] = formattedRGB
            })
            this.artists[index].imagePalette = imagePalette
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
  backdrop-filter: blur(15px);
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
.artist-image {
  width: 150px;
  height: 150px;
  background-size: cover, cover;
  border-radius: 50px;
}
</style>
