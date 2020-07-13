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
        <magnify-icon v-if="!loadingSearchResults" title="Search" />
        <spinner v-else />
      </template>
    </text-input>
    <div class="search-content-container" :class="{loadingSearchResults, 'results-layout': resultsLoaded, searching, visible}">
      <div class="search-settings" :class="{ 'results-position': resultsLoaded }">
        <divided-container class="search-settings-divided-container" :class="{resultsLoaded}" shadow :hide-left-column="resultsLoaded" conservative-mobile-view>
          <template v-slot:left>
            <subheading smaller no-top-margin>
              Search configuration
            </subheading>
            <paragraph soft>
              Adjust these search parameters to hone in on what you want to find<span v-if="!includeInSearch['artists'] && !includeInSearch['releases']"> (or not, I guess)</span>.
            </paragraph>
          </template>
          <template v-slot:right>
            <input-label no-top-margin>
              Include in search
            </input-label>
            <div class="flex-container">
              <checkbox checked @change="updateSearchQuery('artists', $event); search ('from-input')">
                Artists
              </checkbox>
              <checkbox checked @change="updateSearchQuery('releases', $event); search ('from-input')">
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
                :default-value="releaseTypeName"
                :options="['All release types', 'Singles', 'LPs', 'EPs']"
                @change="findReleaseType($event); search ('from-input')"
              >
                <template v-slot:icon>
                  <disc-icon title="Release types" />
                </template>
              </dropdown-input>
            </div>
            <div v-if="includeInSearch['artists']">
              <input-label>
                Country
              </input-label>
              <dropdown-input
                name="include-in-search-country"
                description-value="Where are the results from?"
                default-value="All countries"
                :options="listOfCountries"
                @change="selectedRegion = $event; search ('from-input')"
              >
                <template v-slot:icon>
                  <map-icon title="Country" />
                </template>
              </dropdown-input>
            </div>
            <input-label>
              Amount of results displayed
            </input-label>
            <dropdown-input
              name="amount-of-results"
              description-value=">5 results requires a premium subscription."
              :default-value="amountOfResults"
              :options="[1, 2, 3, 4, 5]"
              @change="amountOfResults = $event; search ('from-input')"
            >
              <template v-slot:icon>
                <view-list-icon title="Amount of results" />
              </template>
            </dropdown-input>
            <div v-if="!includeInSearch['artists'] && !includeInSearch['releases']" class="not-on-mobile">
              <paragraph>Don't feel like searching anything? I get it. We all have those days. I hope you're okay, though. Feel free to click outside of this little window to return to the rest of tasteful.</paragraph>
            </div>
          </template>
        </divided-container>
        <divided-container class="search-settings-mobile-results-prompt" :class="{resultsLoaded}" shadow :hide-left-column="resultsLoaded" :conservative-mobile-view="resultsLoaded">
          <template v-slot:right>
            <regular-button centre-on-small-screens include-arrow-icon @pressed="resultsLoaded = false">
              Return to search parameters
            </regular-button>
          </template>
        </divided-container>
      </div>
      <regular-button v-if="!resultsLoaded" class="hide-search-button" centre-on-small-screens @pressed="hideSearch">
        Hide search
      </regular-button>
      <div v-if="!resultsLoaded" class="search-content-before-search" @click="hideSearch">
        <!-- only show if search hasnt been made -->
        <div
          v-for="circle in circlesToRender"
          :key="circle.id"
          :style="{ marginLeft: circle.startingPoint[0] + 'px', marginBottom: circle.startingPoint[1] + 'px' }"
          :class="[colourMode]"
          class="circle"
        />
      </div>
      <div v-else class="results-container" @click="hideSearch">
        <div class="results">
          <div>
            <!-- <div v-for="artist in artists" :key="artist.id" class="artist" :style="calculateDynamicColours('artist', artist)"> -->
            <search-artist v-for="artist in artists" :key="artist.id" :artist="artist" @changeSearching="searching = $event" />
          </div>
          <!-- <div v-for="release in releases" :key="release.id" class="artist" :style="calculateDynamicColours('artist', artist)"> -->
          <div class="release-results">
            <search-release v-for="release in releases" :key="release.id" :release="release" @changeSearching="searching = $event" />
          </div>
          <div v-if="!showingResults.artists && !showingResults.releases && !loadingSearchResults">
            <subheading>No results found.</subheading>
            <paragraph>
              I'm sorry I couldn't be better for you.
              Consider using less specific search criteria or ensuring you spelled correctly what you searched for.
              If you're searching for a release, by the way, you only need to search for the release's name.
              For example, search for 'fetch the bolt cutters' instead of 'fiona apple fetch the bolt cutters'.
            </paragraph>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import magnifyIcon from 'vue-material-design-icons/Magnify.vue'
import anime from 'animejs/lib/anime.es.js'
import mapIcon from 'vue-material-design-icons/Map.vue'
import discIcon from 'vue-material-design-icons/Disc.vue'
import viewListIcon from 'vue-material-design-icons/ViewList.vue'
import countryList from 'country-list'
import _ from 'lodash'
import textInput from '@/components/TextInput.vue'
import dividedContainer from '@/components/DividedContainer.vue'
import subheading from '@/components/Subheading.vue'
import paragraph from '@/components/Paragraph.vue'
import inputLabel from '@/components/InputLabel.vue'
import dropdownInput from '@/components/DropdownInput.vue'
import checkbox from '@/components/Checkbox.vue'
import spinner from '@/components/Spinner.vue'
import searchArtist from '@/components/SearchArtist.vue'
import searchRelease from '@/components/SearchRelease.vue'
import regularButton from '@/components/RegularButton.vue'

export default {
  name: 'NavSearch',
  components: {
    textInput,
    magnifyIcon,
    mapIcon,
    discIcon,
    viewListIcon,
    dividedContainer,
    subheading,
    paragraph,
    inputLabel,
    dropdownInput,
    checkbox,
    spinner,
    searchArtist,
    searchRelease,
    regularButton
  },
  props: {
    visible: Boolean
  },
  data () {
    return {
      searching: false,
      searchQuery: '',
      imageURL: '',
      imageURLLowRes: '',
      loadingSearchResults: false,
      resultsLoaded: false,
      releaseType: false,
      releaseTypeName: 'All release types',
      artists: [],
      releases: [],
      showingResults: {
        artists: false,
        releases: false
      },
      selectedRegion: 'All countries',
      amountOfResults: '3',
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
          loop: true,
          duration: 400000
        })
      } else if (!focused) {
        this.searching = false
      }
    },
    findReleaseType (value) {
      this.releaseTypeName = value
      switch (value) {
        case 'All release types':
          this.releaseType = false
          break
        case 'Singles':
          this.releaseType = 'single'
          break
        case 'LPs':
          this.releaseType = 'album'
          break
        case 'EPs':
          this.releaseType = 'ep'
      }
    },
    updateSearchQuery (query, value) {
      this.includeInSearch[query] = value
    },
    hideSearch (e) {
      try {
        if (e.target === e.currentTarget) {
        // if the parent div is clicked (what we want)
          this.searching = false
        }
      } catch (err) {
        // if e is undefined, presumably ie. button is calling this function
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
    showSearchResults (toShow, result = true) {
      anime.remove('.circle')
      this.loadingSearchResults = false
      this.resultsLoaded = true
      this.$set(this.showingResults, toShow, result)
    },
    processReleases (releases) {
      this.releases = releases.data['release-groups']
      this.releases.forEach((releasegroup, i) => {
        // get album art first
        this.$axios
          .get(
            '/coverArtArchive/release-group/' + releasegroup.id
          )
          .then((res) => {
            const imageURL = res.data.images[0].thumbnails.small
            this.$set(this.releases[i], 'image', imageURL)
          })
          .catch((err) => {
            console.log('No album cover found.\n' + err)
          })
      })
    },
    search (source) {
      this.loadingSearchResults = true
      this.showingResults = { artists: false, releases: false }
      this.artists = []
      this.releases = []

      // const getColours = (image, index, type) => {
      //   const palette = (v, imagePalette) => {
      //     v.getPalette()
      //       .then((palette) => {
      //         Object.keys(palette).forEach((colour) => {
      //           const r = palette[colour]._rgb[0]
      //           const g = palette[colour]._rgb[1]
      //           const b = palette[colour]._rgb[2]
      //           const formattedRGB = `rgb(${r}, ${g}, ${b})`
      //           imagePalette[colour] = formattedRGB
      //         })
      //         this.artists[index].imagePalette = imagePalette
      //       })
      //       .finally(() => {
      //         this.showSearchResults('artists')
      //       })
      //   }
      //   if (type === 'artist') {
      //     const proxyLowResolutionImageURL = '/wikimediaCommons?width=10&f=' + image
      //     const imagePalette = {}
      //     const v = new Vibrant(proxyLowResolutionImageURL)
      //     palette(v, imagePalette)
      //   } else {
      //     const imageURL = image
      //     const imagePalette = {}
      //     const v = new Vibrant(imageURL)
      //     palette(v, imagePalette)
      //   }
      // }

      // check if a query is present
      if (!this.searchQuery && source === 'from-input') {
        this.loadingSearchResults = false
        return false
      }

      // convert country to a code
      let countryCode = this.selectedRegion
      if (this.selectedRegion !== 'All countries') {
        countryCode = countryList.getCode(this.selectedRegion)
      }

      if (this.includeInSearch.artists) {
        this.$axios
          .get(
            `https://us-central1-tasteful.cloudfunctions.net/search?query=${this.searchQuery}&querytype=artist&releasetype=All&region=${countryCode}&limit=${this.amountOfResults}`
          )
          .then((res) => {
            this.artists = res.data
            this.showingResults.artists = true
            if (!this.includeInSearch.releases) {
              this.loadingSearchResults = false
              this.resultsLoaded = true
            } else if (this.includeInSearch.releases && this.showingResults.releases) {
              this.loadingSearchResults = false
              this.resultsLoaded = true
            }
          })
      }
      if (this.includeInSearch.releases) {
        this.$axios
          .get(
            `https://us-central1-tasteful.cloudfunctions.net/search?query=${this.searchQuery}&querytype=release-group&releasetype=${this.releaseType}&region=${countryCode}&limit=${this.amountOfResults}`
          )
          .then((res) => {
            this.releases = res.data
            this.showingResults.releases = true

            if (!this.includeInSearch.artists) {
              this.loadingSearchResults = false
              this.resultsLoaded = true
            } else if (this.includeInSearch.artists && this.showingResults.artists) {
              this.loadingSearchResults = false
              this.resultsLoaded = true
            }
          })
      }
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
  backdrop-filter: blur(15px);
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
  & > * {
    display: none;
  }
  &.searching {
    display: block;
    pointer-events: auto;
    overflow-x: hidden;
    &.visible {
      height: 100vh;
    }
    & > * {
      display: block;
      &.search-content-before-search {
        display: flex;
      }
      &.search-settings {
        display: flex;
      }
    }
  }
  &.results-layout {
    display: flex;
    padding-left: 3vw;
    width: calc(100% - 3vw);
  }
}
.results-container {
  width: 100%;
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
  display: none;
  align-items: flex-end;
  height: 100%;
}
.search-settings {
  width: 40%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: fit-content;
  z-index: 100;
  &.results-position {
    position: sticky;
    transform: none;
    left: 0;
    top: 3vh;
    display: none;
  }
}
.flex-container {
  display: flex;
}
.tags {
  max-width: 100%;
}
.results {
  display: flex;
  transform: none !important; // bandaid fix for anime.js-related bug
  padding-left: 3vw;
  padding-top: 3vh;
  padding-bottom: 10vh;
  overflow-y: auto;
}
.release-results {
  display: grid;
  grid-template-columns: repeat(3, 150px);
  grid-gap: 20px;
  margin-left: 3vw;
}
.search-settings-mobile-results-prompt {
  display: none !important; // conflicts with .search-content-container > * display: none // TO FIX!!
}
.hide-search-button {
  display: none !important; // conflicts with .search-content-container > * display: none
}
@media (max-width: 1000px) {
  .search-content-container {
    width: 100%;
    &.results-layout {
      display: block;
      padding-left: 0;
    }
  }
  .not-on-mobile {
    display: none;
  }
  .search-content-before-search {
    display: none !important; // to fix... one day. im tired
  }
  .circle {
    display: none; // performance yknow
  }
  .search-settings {
    width: 100vw;
    position: relative;
    top: 30px;
    left: 0;
    transform: none;
    margin-bottom: 5vh;
    &.results-position {
      width: 98vw;
      left: 1vw;
      top: 3vh;
      max-height: 10vh;
    }
  }
  .search-settings-divided-container {
    margin-left: auto;
    margin-right: auto;
    &.resultsLoaded {
      display: none;
    }
  }
  .search-settings-mobile-results-prompt {
    &.resultsLoaded {
      width: 100%;
      display: flex;
      &::before {
        width: 100%;
      }
    }
  }
  .hide-search-button {
    display: block !important; // conflicts with .hide-search-button display: none. it's ugly and i need to fix
    position: sticky;
    top: 50vh;
    z-index: 10000;
  }
  .results {
    display: block;
  }
  .release-results {
    margin-left: 0;
    display: block;
  }
}
</style>
