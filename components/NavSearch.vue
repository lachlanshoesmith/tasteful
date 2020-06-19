<template>
  <div class="nav-search">
    <text-input
      debounce
      class="search-bar"
      no-bottom-margin
      :focus-highlight="searching"
      placeholder="Search..."
      focus-manual-blur-handling
      @input="searchQuery = $event"
      @focus="updateDisplay"
    >
      <template v-slot:icon>
        <magnify-icon title="Search" />
      </template>
    </text-input>
    <div class="search-content-container" :class="{loadingSearchResults, searching, visible}">
      <div v-if="!resultsLoaded" class="search-content-before-search">
        <!-- only show if search hasnt been made -->
        <div class="search-settings-container" @click="hideSearch">
          <div class="search-settings">
            <divided-container shadow>
              <template v-slot:left>
                <subheading smaller no-top-margin>
                  Search configuration
                </subheading>
                <paragraph soft>
                  Adjust these search parameters to hone in on what you want to find.
                </paragraph>
              </template>
              <template v-slot:right>
                <input-label no-top-margin>
                  Include in search
                </input-label>
                <div class="flex-container">
                  <checkbox checked @change="updateSearchQuery('artists', $event)">
                    Artists
                  </checkbox>
                  <checkbox checked @change="updateSearchQuery('releases', $event)">
                    Releases
                  </checkbox>
                </div>
                <div v-if="includeInSearch['releases']">
                  <input-label>
                    Type of release
                  </input-label>
                  <dropdown-input
                    name="include-in-search-release-type"
                    description-value="Choose which releases are displayed."
                    default-value="All release types"
                    full-width
                    :options="['All release types', 'Singles', 'LPs', 'EPs', 'Mixtapes', 'Broadcasts', 'Live', 'Miscellaneous']"
                  >
                    <template v-slot:icon>
                      <disc-icon title="Release types" />
                    </template>
                  </dropdown-input>
                </div>
                <div v-if="includeInSearch['artists'] || includeInSearch['releases']">
                  <input-label>
                    Country
                  </input-label>
                  <dropdown-input
                    name="include-in-search-country"
                    description-value="Where are the results from?"
                    default-value="All countries"
                    full-width
                    :options="listOfCountries"
                  >
                    <template v-slot:icon>
                      <map-icon title="Country" />
                    </template>
                  </dropdown-input>
                </div>
                <div v-if="!includeInSearch['artists'] && !includeInSearch['releases']">
                  <paragraph>Don't feel like searching anything? I get it. We all have those days. I hope you're okay, though. Feel free to click outside of this little window to return to the rest of tasteful.</paragraph>
                </div>
              </template>
            </divided-container>
          </div>
        </div>
        <div
          v-for="circle in circlesToRender"
          :key="circle.id"
          :style="{ marginLeft: circle.startingPoint[0] + 'px', marginBottom: circle.startingPoint[1] + 'px' }"
          :class="[colourMode]"
          class="circle"
        />
      </div>
      <div v-else @click="hideSearch">
        <masthead centred fit-width no-left-margin-on-large-screens>
          Search results
        </masthead>
        <div class="results">
          <div v-for="artist in artists" :key="artist.id" class="artist" :style="calculateDynamicColours('artist', artist)">
            <div v-if="artist.imageURLLowRes" id="artist-image" class="artist-image" :style="{ 'background-image': 'url(' + artist.imageURL + '), url(' + artist.imageURLLowRes + ')' }" />
            <div>
              <span class="artist-name" :style="calculateDynamicColours('artist-name', artist)">{{ artist.name }}</span>
              <div class="tags">
                <tag v-for="tag in artist.tags" :key="tag.id" :style="{ backgroundColor: artist.imagePalette.DarkVibrant, color: artist.imagePalette.Vibrant }">
                  {{ tag.name }}
                </tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crypto from 'crypto'
import magnifyIcon from 'vue-material-design-icons/Magnify.vue'
import Vibrant from 'node-vibrant'
import anime from 'animejs/lib/anime.es.js'
import mapIcon from 'vue-material-design-icons/Map.vue'
import discIcon from 'vue-material-design-icons/Disc.vue'
import countryList from 'country-list'
import _ from 'lodash'
import textInput from '@/components/TextInput.vue'
import masthead from '@/components/Masthead.vue'
import dividedContainer from '@/components/DividedContainer.vue'
import subheading from '@/components/Subheading.vue'
import paragraph from '@/components/Paragraph.vue'
import inputLabel from '@/components/InputLabel.vue'
import dropdownInput from '@/components/DropdownInput.vue'
import tag from '@/components/Tag.vue'
import checkbox from '@/components/Checkbox.vue'

export default {
  name: 'NavSearch',
  components: {
    textInput,
    magnifyIcon,
    mapIcon,
    discIcon,
    masthead,
    dividedContainer,
    subheading,
    paragraph,
    inputLabel,
    dropdownInput,
    tag,
    checkbox
  },
  props: {
    visible: Boolean
  },
  data () {
    return {
      searching: false,
      searchQuery: '',
      searchResult: [],
      imageURL: '',
      imageURLLowRes: '',
      loadingSearchResults: false,
      resultsLoaded: false,
      artists: [],
      includeInSearch: {
        artists: true,
        releases: true
      }
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    },
    circlesToRender () {
      const amountToRender = _.random(3, 10)
      const circlesToRender = []
      for (let i = 0; i < amountToRender; i++) {
        const circle = {
          'startingPoint': [_.random(25, 70), _.random(0, 500)] // x and y , respectively
        }
        circlesToRender.push(circle)
      }
      return circlesToRender
    },
    listOfCountries () {
      const countries = countryList.getNames()
      countries.unshift('All countries')
      return countries
    }
  },
  watch: {
    searchQuery () {
      this.search()
    }
  },
  methods: {
    updateDisplay (focused) {
      if (focused) {
        this.searching = true
        anime({
          targets: '.circle',
          translateX: '70vw',
          translateY: '-50vh',
          easing: 'easeOutExpo',
          duration: 400000
        })
      } else if (!focused) {
        this.searching = false
      }
    },
    updateSearchQuery (query, value) {
      this.includeInSearch[query] = value
    },
    hideSearch (e) {
      if (e.target === e.currentTarget) {
        // if the parent div is clicked (what we want)
        this.searching = false
      }
    },
    calculateDynamicColours (target, data) {
      switch (target) {
        case 'artist':
          return { backgroundColor: data.imagePalette.DarkMuted }
        case 'artist-name':
          return { color: data.imagePalette.LightVibrant }
      }
    },
    search () {
      this.loadingSearchResults = true
      this.artists = []
      const searchResult = () => {
        this.$axios
          .get(
            '/musicBrainzAPI/artist/?query=artist:"' + this.searchQuery + '"?inc=genres&fmt=json&limit=3'
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
        let foundWikidata = false
        for (let relationIndex = 0; relationIndex < relations.length; relationIndex++) {
          const relation = relations[relationIndex]
          // get wikidata link
          if (relation.type === 'wikidata') {
            foundWikidata = true
            // get wikidata ID
            const wikidataID = relation.url.resource.slice(30) // https://www.wikidata.org/wiki/ = 30 chars
            // lookup image
            getImage(wikidataID, index)
          }
        }
        // if no wikidata page was found, get album art instead
        if (!foundWikidata) {
          getAlbumArtCandidate(index)
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
            try {
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
              getColours(imageName, index, 'artist')
            } catch (e) {
              if (e === 'TypeError: "res.data.claims.P18 is undefined"') {
                // If the artist has no image supplied, get an album artwork instead.
                getAlbumArtCandidate(index)
              }
            }
          })
          .catch((e) => {
            getAlbumArtCandidate(index)
          })
      }
      const getAlbumArtCandidate = (index) => {
        const artist = this.artists[index]
        this.$axios
          .get(
            '/musicBrainzAPI/release-group/?query=arid:' + artist.id + '&limit=1&fmt=json'
          )
          .then((res) => {
            // At this stage tasteful will the first album art from the artist (ie debut, probably).
            // In the future the highest-rating release will be shown, instead.
            const releases = res.data['release-groups']
            // Some artists have no releases and fill basically no purpose on MusicBrainz, lol.
            if (!releases.length) {
              console.log(artist.name + ' has no releases.')
              // Will need to find alternative.
            } else {
              // choose a release from the group (to get specific MBID)
              // normally I would just use group's MBID but i'm having CORS issues at the minute.
              // will probably revisit this one day.
              const release = releases[0].releases[0]
              getAlbumArtLocation(release, index)
            }
          })
      }
      const getAlbumArtLocation = (release, index) => {
        this.$axios
          .get(
            '/archive/download/mbid-' + release.id + '/index.json'
          )
          .then((res) => {
            const imageURL = res.data.images[0].image
            getAlbumArt(imageURL, index)
          })
          .catch((err) => {
            // Try get another album artwork.
            console.error(err)
            index += 1
            getAlbumArtCandidate(index)
          })
      }
      const getAlbumArt = (imageURL, index) => {
        this.artists[index].imageURL = imageURL
        this.artists[index].imageURLLowRes = imageURL
        // get colours
        getColours(imageURL, index, 'release')
      }
      const getColours = (image, index, type) => {
        const palette = (v, imagePalette) => {
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
            .finally(() => {
              this.loadingSearchResults = false
              this.resultsLoaded = true
            })
        }
        if (type === 'artist') {
          const proxyLowResolutionImageURL = '/wikimediaCommons?width=10&f=' + image
          const imagePalette = {}
          const v = new Vibrant(proxyLowResolutionImageURL)
          palette(v, imagePalette)
        } else {
          const imageURL = image
          const imagePalette = {}
          const v = new Vibrant(imageURL)
          palette(v, imagePalette)
        }
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
  width: 95%;
}
.text-input-container {
  margin-left: auto;
  margin-right: auto;
}
.search-content-container {
  display: none;
  position: absolute;
  // border-top: solid 5px green;
  left: 0;
  width: 100%;
  height: 0%;
  backdrop-filter: blur(15px);
  color: $saturated-blue;
  pointer-events: none; // allow clicks through element while not visible
  &.dark, &.black, &.solarised-dark {
    background: rgba($deep-black, 0.8);
  }
  &.light, &.solarised-light {
    background: rgba($light-grey, 0.8);
  }
  &.searching {
    display: block;
    pointer-events: auto;
    overflow-x: hidden;
    &.visible {
      height: 100vh;
    }
  }
}

.results {
  display: flex;
}
.artist {
  margin-right: 20px;
  padding-right: 40px;
  border-radius: 15px;
  display: flex;
}
.artist-image {
  width: 150px;
  height: 150px;
  margin-right: 20px;
  border-radius: 15px 0px 0px 15px;
  background-size: cover, cover;
}
.artist-name {
  font-weight: 500;
}
.circle {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  background: $green-gradient;
  opacity: 0.3;
  &.solarised-light, &.solarised-dark {
    background: $solarised-circle-gradient;
  }
  &.black {
    background: $dark-grey;
  }
}
.search-content-before-search {
  display: flex;
  align-items: flex-end;
  height: 100%;
}
.search-settings-container {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.search-settings {
  padding: 20px;
  width: 40%;
}
.flex-container {
  display: flex;
}
.tags {
  max-width: 80%;
}
</style>
