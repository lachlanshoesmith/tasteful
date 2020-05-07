<template>
  <div
    :class="{displayingSearchResults: displaySearchResults, desktop}"
    class="search"
  >
    <paragraph :class="{ displayingSearchResults: displaySearchResults }">
      <div id="search-container" :class="colourMode">
        <input
          id="search-box"
          v-model="searchRequest"
          :class="colourMode"
          :placeholder="'Search...'"
          type="text"
          name="search"
          @keyup.enter="search"
        >
        <nuxt-link
          id="settings-button"
          to="/search"
          class="icon-button"
          :class="colourMode"
          @click.native="$emit('close-search-modal')"
        >
          <settings-icon title="Settings" />
        </nuxt-link>
        <button id="search-button" class="icon-button" type="submit" @click="search">
          <magnify-icon title="Search" />
        </button>
      </div>
    </paragraph>
    <div v-show="displaySearchResults" class="search-results">
      <p v-if="amountOfArtists >= 0 && !loading" class="search-results-amount" :class="colourMode">
        {{ amountOfArtists }}
        <span v-if="amountOfArtists === 1">artist</span>
        <span v-else>artists</span>
        found.
      </p>
      <div id="loading-container" :class="{ loading }" />
      <ul class="search-results-list">
        <li v-for="result in searchResult" :key="result.id" class="search-item">
          <div v-if="searchType === 'artists'">
            <!-- <span v-if="result.aliases">
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
            </span> -->
            <nuxt-link
              :to="'/artist/' + result.id"
              :class="colourMode"
              class="artist-name"
              @click.native="$emit('close-search-modal')"
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
  </div>
</template>

<script>
// @ is an alias to /src
import lottie from 'lottie-web'
import SettingsIcon from 'vue-material-design-icons/Settings.vue'
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import paragraph from '~/components/Paragraph.vue'
import tag from '~/components/Tag.vue'

import loadingData from '~/assets/loading.json'

export default {
  name: 'Search',
  components: {
    paragraph,
    tag,
    SettingsIcon,
    MagnifyIcon
  },
  props: {
    desktop: Boolean
  },
  data () {
    return {
      searchType: 'artists',
      specificSearch: true,
      lastSearchWasSpecific: false,
      searchResult: {},
      searchRequest: '',
      amountOfArtists: -1,
      loading: false,
      displaySearchResults: false,
      showModal: false
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  mounted () {
    // focus search
    document.getElementById('search-box').focus()
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
        this.$axios
          .get(
            'https://musicbrainz.org/ws/2/artist/?query=artist:' +
                this.searchRequest +
                '?inc=genres&fmt=json'
          )
          .then((res) => {
            this.processData(res, false)
            this.loading = false
            lottie.stop()
          })
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
  display: flex;
  flex-direction: column;
  transition: all 0.3s linear;
  &.displayingSearchResults {
    max-height: 50vh;
  }
  &.desktop {
    display: none;
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
    margin: auto;
    padding-top: 20px;
  }
}

#search-container {
  display: flex;
  background: hsl(252, 15%, 90%);
  border-radius: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  transition: all 0.2s linear;
  &.dark {
    background: hsl(252, 15%, 10%);
  }
  &.black {
    background: $deep-black;
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
  &.black {
    color: $quite-light-grey;
  }
}

.icon-button {
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

#settings-button {
  color: hsl(222, 30%, 65%);
  padding-right: 0px;
  &:hover {
    color: hsl(222, 46%, 36%);
  }
  &.dark {
    color: hsl(222, 46%, 26%);
    &:hover {
      color: hsl(222, 68%, 45%);
    }
  }
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

.search-results {
  overflow: auto;
  max-height: inherit;
  margin: 0;
  padding: 0;
}

.search-results-amount {
  color: $soft-red;
  font-size: 1rem;
  &.dark {
    color: $soft-red-dim;
  }
}

.tags {
  display: flex;
}

a {
  color: $soft-red;
  &:hover {
    color: $soft-red-dim;
    cursor: pointer;
  }
}

.search-results-list {
  padding-left: 20px;
}

@media (max-width: 1000px) {
  .search {
    &.displayingSearchResults {
      padding-left: 3vw;
      padding-right: 3vw;
    }
  }
}

@media (min-width: 1000px) {
  .search {
    &.desktop {
      display: flex;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
