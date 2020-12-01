<template>
  <main class="release">
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
    <div class="flex-container content">
      <div class="left-column">
        <div class="flex-container">
          <regular-button type="secondary">
            Update rating
          </regular-button>
          <regular-button type="secondary">
            Add to list
          </regular-button>
          <regular-button type="tertiary" :to="'https://musicbrainz.org/release-group/' + id">
            Edit this release
          </regular-button>
        </div>
        <div class="flex-container user-review-container">
          <div class="user-score-container">
            <profile-picture size="medium" url="https://pbs.twimg.com/profile_images/1291718797456359424/7mwTI5rz_400x400.jpg" />
            <p class="user-score">
              {{ initialScore }}
            </p>
          </div>
          <div>
            <text-input full-width placeholder="Something provocative and enticing!" name="review-header" :default-value="reviewContent.header" @input="reviewContent.header=$event">
              Header
            </text-input>
            <text-area name="review-body" full-width placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin felis nibh, condimentum sit amet tempor quis, ultricies eu massa. Pellentesque aliquam mi at odio commodo, at pharetra arcu consectetur." :default-value="reviewContent.body" @input="reviewContent.body=$event">
              Body
            </text-area>
            <div class="flex-container">
              <regular-button type="primary" @pressed="postReview()">
                Post review
              </regular-button>
              <regular-button type="tertiary">
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
          <div v-for="(review, i) in reviews" :key="review.id" class="review">
            <div class="flex-container">
              <div>
                <profile-picture size="small" :url="review.avatar" />
              </div>
              <div>
                <subheading smallest>
                  <nuxt-link :to="'/user/' + review.username">
                    {{ review.username }}
                  </nuxt-link>
                </subheading>
                <subheading smaller>
                  {{ review.header }}
                </subheading>
                <paragraph>{{ review.body }}</paragraph>
                <div v-if="review.likes">
                  <p>Likes: {{ review.likes }}</p>
                  <p>Likers: {{ review.likers }}</p>
                </div>
                <button @click="likeReview(review, i)">
                  <span v-if="user === null || review.likers.includes(user.id)">Unlike this review</span>
                  <span v-else>Like this review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
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
import paragraph from '~/components/Paragraph.vue'

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
    paragraph
  },
  data () {
    return {
      id: this.$route.params.id,
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
      initialScore: undefined,
      loading: false,
      consideredUser: false
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
          this.getReviewerAvatars()
          this.getReviewerUsernames()
        })
    },
    addReleaseToDatabase (release) {
      this.$fire.firestore.collection('releases').doc(this.id).set(this.release)
    },
    likeReview (review, i) {
      const releases = this.$fire.firestore.collection('releases')
      if (review.likers.includes(this.user.id)) {
        this.reviews[i].likes = review.likes - 1
        const indexOfLiker = this.reviews[i].likers.indexOf(this.user.id)
        this.reviews[i].likers.splice(indexOfLiker, 1)
      } else if (this.user.id === review.author) {
        alert('You can\'t like your own review, sorry.')
      } else {
        this.reviews[i].likes = review.likes + 1
        this.reviews[i].likers.push(this.user.id)
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
    getReviewerAvatars () {
      this.reviews.forEach((review) => {
        const i = this.reviews.indexOf(review)
        const imagePath = 'users/' + review.author + '/avatar.jpg'
        this.$fire.storage.ref().child(imagePath)
          .getDownloadURL()
          .then((url) => {
            this.reviews[i].avatar = url
          })
      })
    },
    getReviewerUsernames () {
      this.reviews.forEach((review) => {
        const i = this.reviews.indexOf(review)
        this.$getUsername(review.author, this.$fire)
          .then((username) => {
            this.reviews[i].username = username
          })
      })
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
.review {
  max-width: 400px;
}
</style>
