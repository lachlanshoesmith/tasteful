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
        <divided-container shadow :hide-left-column="resultsLoaded">
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
                :default-value="releaseTypeName"
                full-width
                :options="['All release types', 'Singles', 'LPs', 'EPs']"
                @change="findReleaseType($event)"
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
              <input-label>
                Amount of results displayed
              </input-label>
              <dropdown-input
                name="amount-of-results"
                description-value=">5 results requires a premium subscription."
                :default-value="amountOfResults"
                full-width
                :options="[1, 2, 3, 4, 5]"
                @change="amountOfResults = $event"
              >
                <template v-slot:icon>
                  <view-list-icon title="Amount of results" />
                </template>
              </dropdown-input>
            </div>
            <div v-if="!includeInSearch['artists'] && !includeInSearch['releases']">
              <paragraph>Don't feel like searching anything? I get it. We all have those days. I hope you're okay, though. Feel free to click outside of this little window to return to the rest of tasteful.</paragraph>
            </div>
          </template>
        </divided-container>
      </div>
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
import crypto from 'crypto'
import magnifyIcon from 'vue-material-design-icons/Magnify.vue'
import Vibrant from 'node-vibrant'
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
    searchRelease
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
    search () {
      this.loadingSearchResults = true
      this.showingResults = { artists: false, releases: false }
      this.artists = []
      this.releases = []
      const searchResult = (type) => {
        if (type === 'artist') {
          this.$axios
            .get(
              '/musicBrainzAPI/artist/?query=artist:"' + this.searchQuery + '"?inc=genres&fmt=json&limit=' + this.amountOfResults
            )
            .then((res) => {
              const artists = res.data.artists
              artists.forEach((artist, i) => {
                artistInfo(artist, i)
                this.artists.push(artist)
              })
            })
        }
        if (type === 'release') {
          if (this.releaseType) {
            this.$axios
              .get(
                '/musicBrainzAPI/release-group/?query=releasegroup:"' + this.searchQuery + '" AND primarytype:"' + this.releaseType + '"?inc=genres&fmt=json&limit=' + this.amountOfResults
              )
              .then((res) => {
                this.processReleases(res)
              })
              .finally(() => {
                if (this.releases.length) {
                  this.showSearchResults('releases', true)
                } else {
                  this.showSearchResults('releases', false)
                }
              })
          } else {
            this.$axios
              .get(
                '/musicBrainzAPI/release-group/?query=releasegroup:"' + this.searchQuery + '"?inc=genres&fmt=json&limit=' + this.amountOfResults
              )
              .then((res) => {
                this.processReleases(res)
              })
              .finally(() => {
                if (this.releases.length) {
                  this.showSearchResults('releases', true)
                } else {
                  this.showSearchResults('releases', false)
                }
              })
          }
        }
      }
      const artistInfo = (artist, index) => {
        this.$axios.get(
          '/musicBrainzAPI/artist/' + artist.id + '?inc=url-rels&fmt=json'
        )
          .then((res) => {
            artistRelations(res.data.relations, index)
          })
          .catch((err) => {
            console.log('ERROR WITH artistInfo: ' + err)
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
      const findArtistReleases = (index) => {
        const artistID = this.artists[index].id
        this.$set(this.artists[index], 'releases', {})
        // find releases
        this.$axios.get('/musicBrainzAPI/release-group/?query=arid:' + artistID + ' AND status:"official" AND primarytype:"album"&limit=30&fmt=json')
          .then((res) => {
            // get album artworks
            const releases = res.data['release-groups']
            releases.forEach((releasegroup) => {
              this.$set(this.artists[index].releases, releasegroup.id, {})
              // TODO: merge [with getAlbumArtLocation(.image) function
              const releaseTitle = releasegroup.title
              this.$axios
                .get(
                  '/coverArtArchive/release-group/' + releasegroup.id
                )
                .then((res) => {
                  const imageURL = res.data.images[0].thumbnails.small
                  this.$set(this.artists[index].releases[releasegroup.id], 'image', imageURL)
                  this.$set(this.artists[index].releases[releasegroup.id], 'title', releaseTitle)
                })
                .catch((err) => {
                  console.log('No album cover found.\n' + err)
                })
                .finally(() => {
                  // once the results start loading..
                  this.showSearchResults('artists')
                })
            })
          })
          .catch((err) => {
            console.log('ERROR WITH ' + artistID + ': ' + err)
          })
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
              imageName = imageName.replace(',', '%2C')
              // download very low res image first
              const lowResolutionImageURL = 'https://commons.wikimedia.org/w/thumb.php?width=10&f=' + imageName // only 10px wide; stretched and blurred while loading the main image.
              this.artists[index].imageURLLowRes = lowResolutionImageURL
              console.log(lowResolutionImageURL)
              // Note: may replace full resolution URL with a good-enough alternative (eg. 400px) in the future
              const imageURL = 'https://upload.wikimedia.org/wikipedia/commons/' + firstCharacterInHash + '/' + firstCharacterInHash + secondCharacterInHash + '/' + imageName
              this.artists[index].imageURL = imageURL
              // get colours (TEMPORARILY DISABLED)
              // getColours(imageName, index, 'artist')

              // this would normally be handled by getColours()
              if (this.includeInSearch.releases) {
                // find releases for that artist
                findArtistReleases(index)
              } else {
                this.showSearchResults('artists')
              }
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
        if (artist === undefined) {
          // if all artists have had their album arts found (ie index > this.artists.length)...
          // ...finish the search.
          this.showSearchResults('artists')
        } else {
          // otherwise, keep going
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
            .catch((err) => {
              console.log('ERROR WITH getAlbumArtCandidate: ' + err)
            })
        }
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
            // No album art found, keep it moving.
            console.log('ERROR for ' + release.title + ': ' + err)
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
              this.showSearchResults('artists')
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
      if (this.includeInSearch.artists) {
        searchResult('artist') // begin the artist search
      }
      if (this.includeInSearch.releases) {
        searchResult('release') // begin the release search
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
  width: calc(100% - 3vw);
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
  z-index: 100;
  &.results-position {
    position: sticky;
    transform: none;
    left: 0;
    top: 3vh;
    display: none;
    align-items: flex-start;
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
</style>
