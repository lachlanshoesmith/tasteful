<template>
  <main
    :class="{ displayingSearchResults: displaySearchResults }"
    class="search"
  >
    <transition name="fade">
      <modal v-if="showModal" @closeModal="showModal = false">
        <template v-slot:left>
          <masthead centred smaller>
            Adding to the database
          </masthead>
        </template>
        <template v-slot:right>
          <paragraph-container>
            <paragraph>
              tasteful prides itself on featuring an incredible amount of music
              that's easy to find. The majority of the work, though, is actually
              done by the awesome folks over at
              <a href="https://musicbrainz.org/">MusicBrainz</a>, who we donate
              to as a part of the
              <nuxt-link
                :to="{ path: '/donate', hash: '#care-package-container' }"
              >
                Care Package
              </nuxt-link>.
            </paragraph>
            <paragraph>
              Since MusicBrainz are responsible for the tasteful database, we
              advise going to <em>them</em> to add new things to the database;
              we'd rather promote existing great solutions rather than start
              from scratch. 💜
            </paragraph>
            <paragraph>
              You can learn about how to contribute
              <a href="https://musicbrainz.org/doc/How_to_Contribute">here</a>.
              Thanks!
            </paragraph>
          </paragraph-container>
        </template>
      </modal>
    </transition>

    <article-content :class="{ displayingSearchResults: displaySearchResults }">
      <paragraph-container
        id="search-container-paragraph-container"
        always-full
      >
        <paragraph>
          <masthead v-show="displaySearchResults" centred smaller>
            Search
          </masthead>
          <div id="search-container" :class="colourMode">
            <input
              id="search-box"
              v-model="searchRequest"
              :class="colourMode"
              :placeholder="'Search ' + searchType + '...'"
              type="text"
              name="search"
            >
            <button id="search-button" type="submit" @click="search">
              <magnify-icon title="Search" />
            </button>
          </div>
          <subheading smaller>
            Refine
          </subheading>
          <form id="refine">
            <div id="refine-radios-container">
              <input
                id="artists-radio"
                v-model="searchType"
                class="radio"
                type="radio"
                name="search-type"
                value="artists"
                checked
              >
              <label for="artists-radio">Artists</label>
              <input
                id="albums-radio"
                v-model="searchType"
                class="radio"
                type="radio"
                name="search-type"
                value="albums"
              >
              <label for="album-radios">Albums</label>
            </div>
            <div v-if="searchType === 'artists'">
              <label for="region">Region</label>
              <select id="region-select" v-model="selectedRegion" name="region">
                <option value="All regions">
                  All regions
                </option>
                <option v-for="country in listOfCountries" :key="country.id">
                  {{ country }}
                </option>
              </select>
            </div>
            <div>
              <label for="specific-check">Specific search</label>
              <input
                id="specific-search-check"
                v-model="specificSearch"
                class="checkbox"
                type="checkbox"
                name="specific-search"
                value="specific"
                checked
              >
            </div>
          </form>
        </paragraph>
      </paragraph-container>
      <paragraph-container v-show="!displaySearchResults">
        <subheading>Welcome to the tasteful search engine!</subheading>
        <paragraph>
          tasteful prides itself on featuring a search engine that makes sense.
          If it doesn't make sense to you, it's designed to be customisable to
          your liking.
        </paragraph>
        <paragraph>
          tasteful would not exist without the absolutely incredible
          <a href="https://musicbrainz.org/">MusicBrainz</a>, and they are also
          power the backbone of this search engine. As such, much of the
          <nuxt-link to="/donate">
            Care Package donations
          </nuxt-link>
          go towards the global teambehind this incredible database and API.
        </paragraph>
      </paragraph-container>
      <paragraph-container v-show="!displaySearchResults">
        <subheading>Why is it so ugly here?</subheading>
        <paragraph>
          This particular page we're sitting on right now is going to change.
          The reason it looks the way it does is because we plan on integrating
          the search bar into the navigation bar - like most websites - but
          there's a few tweaks under the hood that need to be made to make that
          feasible at this stage. Think of this page as a placeholder. Thanks
          for your patience! 🤗
        </paragraph>
      </paragraph-container>
    </article-content>
    <div v-show="displaySearchResults" class="search-results">
      <p v-if="amountOfArtists >= 0">
        {{ amountOfArtists }}
        <span v-if="amountOfArtists === 1">artist</span>
        <span v-else>artists</span>
        found.
      </p>
      <div id="loading-container" :class="{ loading }" />
      <ul>
        <li v-for="result in searchResult" :key="result.id" class="search-item">
          <div v-if="searchType === 'artists'">
            <span v-if="result.aliases">
              AKA
              <span v-for="(alias, i) in result.aliases" :key="alias.id">
                <span
                  v-if="
                    i === result.aliases.length - 1 &&
                      result.aliases.length >= 3
                  "
                >
                  and
                </span>
                <span v-if="alias !== result.name">{{ alias.name }}</span>
                <span v-if="i !== result.aliases.length - 1">, </span>
              </span>
            </span>
            <nuxt-link
              :to="'/artist/' + result.id"
              :class="colourMode"
              class="artist-name"
            >
              {{ result.name }}
            </nuxt-link>
            <div class="tags">
              <tag v-for="tag in result.tags" :key="tag.id" muted>
                {{ tag.name }}
              </tag>
            </div>
          </div>
          <div v-else class="album-item">
            <img
              :src="
                'https://coverartarchive.org/release/' +
                  result.releases[0].id +
                  '/front'
              "
              class="album-art"
            >
            <article>
              <p :class="colourMode">
                {{ result['artist-credit'][0].artist.name }}
              </p>
              <p :class="colourMode" class="artist-name">
                {{ result.title }}
              </p>
            </article>
          </div>
        </li>
      </ul>
      <a
        v-show="!loading"
        @click="showModal = !showModal"
      >Can't find what you're looking for?</a>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import lottie from 'lottie-web'
import countryList from 'country-list'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import masthead from '~/components/Masthead.vue'
import subheading from '~/components/Subheading.vue'
import articleContent from '~/components/ArticleContent.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'
import tag from '~/components/Tag.vue'
import modal from '~/components/Modal.vue'

import loadingData from '~/assets/loading.json'

export default {
  name: 'Search',
  components: {
    masthead,
    subheading,
    articleContent,
    paragraph,
    paragraphContainer,
    tag,
    MagnifyIcon,
    modal
  },
  data () {
    return {
      searchType: 'artists',
      selectedRegion: 'All regions',
      specificSearch: true,
      lastSearchWasSpecific: false,
      searchResult: {},
      searchRequest: '',
      amountOfArtists: -1,
      loading: false,
      displaySearchResults: false,
      showModal: false,
      listOfCountries: countryList.getNames()
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  mounted () {
    // render animations
    lottie.loadAnimation({
      container: document.getElementById('loading-container'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: loadingData
    })
    lottie.stop()
    // stop animation initially to improve performance
  },
  methods: {
    search () {
      this.searchResult = []
      this.loading = true
      this.displaySearchResults = true
      lottie.play()

      if (
        this.specificSearch &&
        (!this.lastSearchWasSpecific || !this.searchRequest.includes('"'))
      ) {
        this.searchRequest = '"' + this.searchRequest + '"'
        this.lastSearchWasSpecific = true
      } else if (!this.specificSearch) {
        this.searchRequest = this.searchRequest.replace(/"/g, '')
        this.lastSearchWasSpecific = false
      }

      if (this.searchType === 'artists') {
        if (this.selectedRegion === 'All regions') {
          this.$axios
            .get(
              'https://musicbrainz.org/ws/2/artist/?query=artist:' +
                this.searchRequest +
                '?inc=url-rels+genres&fmt=json'
            )
            .then((res) => {
              this.processData(res, false)
              this.loading = false
              lottie.stop()
            })
        } else {
          this.$axios
            .get(
              'https://musicbrainz.org/ws/2/artist/?query=artist:' +
                this.searchRequest +
                '+AND+country:' +
                countryList.getCode(this.selectedRegion) +
                '?inc=url-rels+genres&fmt=json'
            )
            .then((res) => {
              this.processData(res, false)
              this.loading = false
              lottie.stop()
            })
        }
      } else {
        this.$axios
          .get(
            'https://musicbrainz.org/ws/2/release-group/?query=release:' +
              this.searchRequest +
              '?inc=genres&inc=recordings&fmt=json'
          )
          .then((res) => {
            this.processData(res, true)
            this.loading = false
            lottie.stop()
          })
      }
    },
    processData (res, isRelease) {
      if (isRelease) {
        const albums = res.data['release-groups']
        albums.forEach(album => this.searchResult.push(album))
      } else {
        const artists = res.data.artists
        this.amountOfArtists = res.data.count
        artists.forEach(artist => this.searchResult.push(artist))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding-left: 3vw;
  padding-right: 3vw;
  padding-bottom: 3vh;
  transition: all 0.3s linear;
  will-change: padding;
  &.displayingSearchResults {
    display: flex;
    padding-left: 0;
    padding-bottom: 0;
    height: 100%;
  }
}

.album-art {
  height: 32px;
  margin-right: 15px;
  margin-top: auto;
  margin-bottom: auto;
}

.search-item {
  display: flex;
  margin-bottom: 1rem;
  .album-item {
    display: flex;
  }
}

.artist-name {
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  width: 50%;
  &.dark {
    color: hsl(222, 88%, 75%);
  }
}

#loading-container {
  width: 64px;
  height: 64px;
  display: none;
  &.loading {
    display: block;
  }
}

#search-container {
  display: flex;
  background: hsl(252, 15%, 90%);
  box-shadow: 0px 0px 20px hsl(252, 5%, 70%);
  border-radius: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  transition: all 0.2s linear;
  &.dark {
    background: hsl(252, 15%, 10%);
    box-shadow: 0px 0px 10px hsl(252, 5%, 10%);
  }
}

#search-box {
  color: hsl(252, 15%, 10%);
  background: none;
  border: none;
  padding: 5px;
  padding-left: 20px;
  padding-right: 10px;
  font-size: 1rem;
  width: 100%;
  &.dark {
    color: hsl(252, 15%, 70%);
  }
}

#search-button {
  font-size: 24px;
  background: none;
  color: hsl(222, 46%, 36%);
  border: none;
  transition: 0.2s all linear;
  &:hover {
    color: hsl(222, 68%, 45%);
    cursor: pointer;
  }
  padding-left: 10px;
  padding-right: 20px;
}

.radio {
  appearance: none;
  display: inline-block;
  position: relative;
  background-color: hsl(352, 42%, 61%);
  color: #666;
  height: 20px;
  width: 20px;
  border: 0;
  border-radius: 5px;
  margin-right: 7px;
  outline: none;
  transition: all 0.2s linear;
  &:hover {
    cursor: pointer;
  }
  &:checked {
    background: hsl(352, 72%, 35%);
  }
}

#refine-radios-container {
  display: flex;
  label {
    margin-left: 5px;
    margin-right: 10px;
  }
}

.article-content {
  margin-left: calc(50% - 15vw);
  margin-right: calc(50% - 15vw);
  transition: 0.3s all linear;
  will-change: contents;
  &.displayingSearchResults {
    border-radius: 20px;
    flex-basis: auto;
    width: 20vw;
    height: 100%;
    margin-left: 3vw;
    padding: 3vh 3vw 3vh 3vw;
    margin-right: 7vw;
    box-shadow: 0px 4px 30px hsla(252, 20%, 20%, 0.3);
  }
}

.search-results {
  width: 60vw;
  height: 80vh;
  overflow: auto;
}

.tags {
  display: flex;
}

.fade-enter-active,
.fade-leave-active {
  transition: all opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1000px) {
  .search {
    &.displayingSearchResults {
      display: block;
      padding-left: 3vw;
      padding-right: 3vw;
    }
  }
  .article-content {
    &.displayingSearchResults {
      width: auto;
      margin-left: auto;
      margin-right: auto;
      padding-top: 0;
    }
  }
}
</style>
