<template>
  <main class="release">
    <transition name="fade">
      <modal v-if="showAddToListModal" scrollable :image-for-right-side="release.imageHQ" @closeModal="showAddToListModal = false">
        <template v-slot:heading>
          <masthead smaller>
            Add release to list
          </masthead>
        </template>
        <template v-slot:left>
          <dropdown
            name="selected-list"
            description-value="2020 favourites, for example."
            :options="['Example list 1', 'Example list 2']"
          >
            Selected list
          </dropdown>
          <text-area name="list-item-description" full-width placeholder="Descriptions are optional, but should be related to the album or artist if included." @input="listItemToAdd.description=$event">
            Description
          </text-area>
          <regular-button wide type="call-to-action">
            Add to list
          </regular-button>
        </template>
      </modal>
    </transition>
    <blur loading :apply-blur="loading" />
    <hero :background="release.image">
      <header>
        <nuxt-link
          class="link"
          :to="'/artist/' + release['artist-credit'][0].artist.id"
          :class="colourMode"
        >
          <subheading>
            {{ release['artist-credit'][0].artist.name }}
          </subheading>
        </nuxt-link>
        <masthead>
          <span v-if="release.title">
            {{ release.title }}
          </span>
          <span v-else>
            Loading...
          </span>
        </masthead>
        <tag desaturated>
          {{ release.firstReleaseDate[3] }}
          <nuxt-link to="/">
            {{ release.firstReleaseDate[2] }}
          </nuxt-link>
        </tag>
        <div class="tags">
          <tag v-for="tag in release.genres" :key="tag.id">
            {{ tag.name }}
          </tag>
        </div>
      </header>
      <img
        id="release-image"
        class="release-image"
        :class="[colourMode]"
        :src="release.image"
        :alt="release.title"
        @load="loading = false"
      >
    </hero>
    <div v-if="selectedReview === false" class="flex-container content">
      <div class="left-column">
        <div class="flex-container">
          <regular-button type="secondary">
            Update rating
          </regular-button>
          <regular-button type="secondary" @pressed="showAddToListModal = true">
            Add to list
          </regular-button>
          <regular-button no-right-margin type="tertiary" :to="'https://musicbrainz.org/release-group/' + id">
            Edit this release
          </regular-button>
        </div>
        <div class="flex-container user-review-container">
          <div class="user-score-container">
            <div v-if="user">
              <profile-picture :username="user.username" size="medium" :url="user.avatar" />
            </div>
            <p class="user-score">
              {{ initialScore }}
            </p>
          </div>
          <div class="user-review-composition-container">
            <text-input
              full-width
              maxlength="125"
              placeholder="Something provocative and enticing!"
              name="review-header"
              :default-value="reviewContent.header"
              @input="reviewContent.header=$event"
            >
              Header
            </text-input>
            <text-area name="review-body" full-width placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin felis nibh, condimentum sit amet tempor quis, ultricies eu massa. Pellentesque aliquam mi at odio commodo, at pharetra arcu consectetur." :default-value="reviewContent.body" @input="reviewContent.body=$event">
              Body
            </text-area>
            <div class="flex-container">
              <regular-button type="primary" @pressed="postReview()">
                Post review
              </regular-button>
              <regular-button type="tertiary" @pressed="openRichEditor">
                Open rich editor
              </regular-button>
            </div>
          </div>
        </div>
        <vertical-table class="relevant-lists-and-charts">
          <template v-slot:header>
            Relevant lists and charts
          </template>
          <template v-slot:content>
            <div class="row">
              <div class="flex-container">
                <profile-picture size="small" url="https://pbs.twimg.com/profile_images/1320206650469502976/Ic6iMceQ_400x400.jpg" />
              </div>
            </div>
            <div class="row">
              Content
            </div>
            <div class="row">
              Content
            </div>
          </template>
        </vertical-table>
      </div>
      <div class="right-column">
        <div v-if="averageScore">
          <pill>
            <div class="flex-container">
              <tag align="right">
                Average
              </tag>
              <p style="color: hsl(249, 10%, 26%)">
                {{ averageScore }}
              </p>
            </div>
            <div class="flex-container">
              <tag align="right">
                Total ratings
              </tag>
              <p style="color: hsl(249, 10%, 26%);">
                {{ amountOfRatings }}
              </p>
            </div>
          </pill>
        </div>
        <div v-if="reviews" class="reviews">
          <review
            v-for="(review, i) in paragraphOnlyReviews"
            :key="review.id"
            :index="i"
            :user="user"
            :review="review"
            :release="id"
            @liked="likeReview(review, i)"
            @show="selectedReview = i"
          />
        </div>
      </div>
    </div>
    <div v-else class="review-container">
      <article-content>
        <masthead>
          {{ reviews[selectedReview].header }}
        </masthead>
        <div class="flex-container review-author-container">
          <profile-picture :username="reviews[selectedReview].username" size="small" :url="reviews[selectedReview].avatar" />
          <div class="review-author">
            <subheading smaller no-margin>
              Review by
              <nuxt-link :to="'/user/' + reviews[selectedReview].username">
                {{ reviews[selectedReview].username }}
              </nuxt-link>
            </subheading>
            <subheading smallest no-margin>
              18 December 2020
            </subheading>
          </div>
        </div>
        <div v-for="block in reviews[selectedReview].body" :key="block.id" class="review-content-block">
          <paragraph v-if="block.type === 'paragraph'" :editable="editing" v-html="sanitise(block.content)" />
          <div v-else-if="block.type === 'image'" class="review-image-container">
            <img class="review-image" :src="block.url" :alt="block.caption">
            <subheading :editable="editing" smaller>
              {{ block.caption }}
            </subheading>
          </div>
        </div>
        <button @click="selectedReview = false; editing = false">
          Go back
        </button>
      </article-content>
      <bar v-if="editing">
        You are currently in <strong>edit mode</strong>. Click on an element to edit its contents.
      </bar>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import sanitizeHtml from 'sanitize-html'
import blur from '~/components/Blur.vue'
import masthead from '~/components/Masthead.vue'
import hero from '~/components/Hero.vue'
import subheading from '~/components/Subheading.vue'
import tag from '~/components/Tag.vue'
import regularButton from '~/components/RegularButton.vue'
import textInput from '~/components/TextInput.vue'
import textArea from '~/components/TextArea.vue'
import verticalTable from '~/components/VerticalTable.vue'
import profilePicture from '~/components/ProfilePicture.vue'
import pill from '~/components/Pill.vue'
import modal from '~/components/Modal.vue'
import dropdown from '~/components/Dropdown.vue'
import review from '~/components/Review.vue'
import paragraph from '~/components/Paragraph.vue'
import articleContent from '~/components/ArticleContent.vue'
import bar from '~/components/Bar.vue'

export default {
  name: 'Release',
  components: {
    blur,
    masthead,
    hero,
    subheading,
    tag,
    regularButton,
    textInput,
    textArea,
    verticalTable,
    profilePicture,
    pill,
    modal,
    dropdown,
    review,
    paragraph,
    articleContent,
    bar
  },
  data () {
    return {
      id: this.$route.params.release,
      averageScore: undefined,
      amountOfRatings: undefined,
      reviews: undefined,
      ratings: {},
      release: {
        'artist-credit': [
          {
            'artist': {
              name: 'Loading...'
            }
          }
        ],
        firstReleaseDate: []
      },
      reviewContent: {
        header: '',
        body: ''
      },
      listItemToAdd: {
        selectedList: '',
        description: ''
      },
      initialScore: undefined,
      paragraphOnlyReviews: undefined,
      loading: false,
      consideredUser: false,
      showAddToListModal: false,
      selectedReview: false,
      editing: false
    }
  },
  computed: mapGetters({
    colourMode: 'theme/colourMode',
    user: 'login/user'
  }),
  watch: {
    user (user) {
      this.checkIfExistingRating()
      this.checkIfExistingReview()
    }
  },
  mounted () {
    this.loading = true
    if (this.release.title === undefined) {
      // if the page is not loaded following a search we must find all the information again
      // get release group info
      this.$axios
        .get(
          `https://us-central1-tasteful.cloudfunctions.net/getReleaseData?query=${this.id}`
        )
        .then((res) => {
          this.release = res.data
          document.title = 'tasteful | ' + this.release.title
          this.checkForReleaseInDatabase()
        })
    } else {
      this.release = this.$store.state.search.release
      document.title = 'tasteful | ' + this.release.title
    }
    this.getRatingsAndReviews()
  },
  methods: {
    rate (scoreString) {
      const applyRating = (score) => {
        // rate on the release page
        const releases = this.$fire.firestore.collection('releases')
        const users = this.$fire.firestore.collection('users')
        const userDoc = users.doc(this.user.id)
        const username = this.user.username
        const releaseData = {
          title: this.release.title,
          artist: this.release['artist-credit'][0].name,
          id: this.id
        }
        releases.doc(this.id).set(releaseData, { merge: true })
        const updateContent = {}
        updateContent[`ratings.${username}`] = score
        releases.doc(this.id).update(updateContent)
        releaseData.score = score
        userDoc.collection('ratings').doc(this.id).set(releaseData)
        alert('Your rating for ' + this.release.title + ' has been submitted.')
      }

      // ensure score is a number
      if (!isNaN(scoreString) && scoreString !== '') {
        const score = Math.floor(Number(scoreString))
        if (score >= 0 && score <= 100) {
          // is a valid number
          applyRating(score)
        }
      } else if (scoreString === '') {
        // Remove the rating.
        applyRating(false)
      }
    },
    checkIfExistingRating () {
      // check if the user has already rated the release
      const users = this.$fire.firestore.collection('users')
      const id = this.user.id
      users.doc(id + '/ratings/' + this.id)
        .get()
        .then((res) => {
          const scoreDoc = res.data()
          if (scoreDoc !== undefined) {
            // if the user has rated the release
            const userScore = scoreDoc.score
            this.initialScore = userScore.toString()
          }
        })
    },
    checkIfExistingReview () {
      this.$fire.firestore.collection('users').doc(this.user.id).collection('reviews').doc(this.id)
        .get()
        .then((doc) => {
          doc.data().review.get()
            .then((review) => {
              this.reviewContent = review.data()
            })
        })
        .catch(() => {
          // User does not have a review.
        })
    },
    getRatingsAndReviews () {
      const releases = this.$fire.firestore.collection('releases')
      releases.doc(this.id)
        .get()
        .then((res) => {
          // get ratings
          this.ratings = res.data().ratings
          if (this.ratings) {
            const ratings = Object.values(this.ratings)
            const sum = ratings.reduce((val, val2) => val + val2, 0)
            this.amountOfRatings = ratings.length
            this.averageScore = Math.floor(sum / this.amountOfRatings)
          }
        })
        .catch((err) => {
          console.log('Release may not exist. Will add to database.')
          console.error(err)
        })

      // get reviews
      releases.doc(this.id).collection('reviews')
        .get()
        .then((res) => {
          this.reviews = res.docs.map(doc => doc.data())
          this.getReviewerAvatars()
          this.getReviewerUsernames()
          this.createParagraphOnlyReviews()
        })
    },
    postReview () {
      if (!this.reviewContent.body) {
        alert('Your review\'s body seems empty. That\'s a pretty important part of a review, don\'t you think?')
      } else {
        // create review object
        const review = this.reviewContent
        // add review to release in database
        const releases = this.$fire.firestore.collection('releases')
        releases.doc(this.id).collection('reviews').doc(this.user.id).set({
          author: this.user.id,
          header: review.header,
          body: review.body,
          likes: 0,
          likers: []
        })
        // add review to user in database
        const users = this.$fire.firestore.collection('users')
        users.doc(this.user.id).collection('reviews').doc(this.id).set({
          review: releases.doc(this.id).collection('reviews').doc(this.user.id) // reference
        })
          .then(() => {
            alert('Your review for ' + this.release.title + ' has been submitted.')
          })
      }
    },
    checkForReleaseInDatabase () {
      const releases = this.$fire.firestore.collection('releases')
      releases.doc(this.id)
        .get()
        .then((release) => {
          if (!release.exists) {
            this.addReleaseToDatabase()
          }
        })
    },
    addReleaseToDatabase (release) {
      this.$fire.firestore.collection('releases').doc(this.id).set(this.release)
    },
    likeReview (review, i) {
      const releases = this.$fire.firestore.collection('releases')
      // check if user has already liked
      if (this.reviews[i].likers.some(liker => liker.id === this.user.id)) {
        this.reviews[i].likes = review.likes - 1
        const indexOfLiker = this.reviews[i].likers.findIndex(review => review.id === this.user.id)
        this.reviews[i].likers.splice(indexOfLiker, 1)
      } else if (this.user.id === review.author) {
        alert('You can\'t like your own review, sorry.')
      } else {
        this.reviews[i].likes = review.likes + 1
        this.reviews[i].likers.push({
          id: this.user.id,
          username: this.user.username
        })
      }
      const likes = this.reviews[i].likes
      const likers = this.reviews[i].likers
      releases.doc(this.id).collection('reviews').doc(review.author).update({
        likes,
        likers
      })
    },
    onUserLoad () {
      this.checkIfExistingRating()
      this.checkForExistingReview()
    },
    getAvatar (id) {
      const imagePath = 'users/' + id + '/avatar.jpg'
      return this.$fire.storage.ref().child(imagePath)
        .getDownloadURL()
        .then(url => url)
    },
    getReviewerAvatars () {
      this.reviews.forEach(async (review) => {
        const i = this.reviews.indexOf(review)
        await this.getAvatar(review.author)
          .then((url) => {
            this.$set(this.reviews[i], 'avatar', url)
          })
      })
    },
    getUsername (id) {
      return this.$fire.firestore.collection('users').doc(id)
        .get()
        .then((user) => {
          const userData = user.data()
          return userData.username
        })
    },
    getReviewerUsernames () {
      this.reviews.forEach(async (review) => {
        const i = this.reviews.indexOf(review)
        const username = await this.getUsername(review.author)
        this.$set(this.reviews[i], 'username', username)
      })
    },
    sanitise (html) {
      const sanitiser = {
        'allowedTags': ['strong'],
        'allowedAttributes': {}
      }
      const sanitisedHTML = sanitizeHtml(html, sanitiser)
      return sanitisedHTML
    },
    createParagraphOnlyReviews () {
      const paragraphOnlyReviews = []
      this.reviews.forEach((review) => {
        const body = review.body // array of 'blocks'
        const bodyOnlyParagraphs = []
        body.forEach((block) => {
          if (block.type === 'paragraph') {
            bodyOnlyParagraphs.push(block)
          }
        })
        const reviewWithOnlyParagraphBlocks = Object.assign({}, review)
        reviewWithOnlyParagraphBlocks.body = bodyOnlyParagraphs // The Line.
        paragraphOnlyReviews.push(reviewWithOnlyParagraphBlocks)
      })
      this.paragraphOnlyReviews = paragraphOnlyReviews
    },
    openRichEditor () {
      this.editing = true
      this.selectedReview = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.release {
  padding-bottom: 3vh;
}
.release-image {
  border-radius: 10px;
  box-shadow: 0px 0px 50px;
  width: 300px;
  margin-left: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  &.light {
    color: rgba($saturated-purple, 0.25)
  }
}
.link {
  text-decoration: none;
}
.tags {
  max-width: 90%;
}
.flex-container {
  display: flex;
}
.user-score-container {
  margin-left: 32px;
  margin-top: 16px;
  margin-right: 16px;
}
.user-score {
  text-align: center;
  color: $saturated-purple;
  font-weight: 700;
  font-size: 18px;
  width: 64px;
  letter-spacing: 2px;
  margin-top: 16px;
}
.user-review-container {
  margin-bottom: 32px;
}
.user-review-composition-container {
  width: 100%;
}
.relevant-lists-and-charts {
  margin-left: 32px;
}
.content {
  padding-left: calc(25vw - 32px);
  padding-right: 25vw;
}
.left-column {
  margin-right: 35px;
  max-width: 25vw;
}
.right-column {
  margin-left: 35px;
  max-width: 25vw;
}
.review-container {
  display: flex;
  justify-content: center;
}
.review-author-container {
  align-items: center;
  margin-top: 24px;
}
.review-author {
  margin-left: 8px;
}
.review-image-container {
  margin-top: 64px;
  margin-bottom: 64px;
  max-width: 512px;
}
.review-image {
  margin-bottom: 32px;
  max-width: 512px;
  box-shadow: 0px 4px 32px $desaturated-dimmest-purple;
  border-radius: 5px;
}
.review-caption {
  max-width: 90%;
}
.review-content-block {
  display: flex;
  justify-content: center;
}
</style>
