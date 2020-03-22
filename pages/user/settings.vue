<template>
  <main class="user">
    <article-content v-if="user !== null">
      <!-- If no username was found on the account... -->
      <masthead centred smaller>
        Add username
      </masthead>
      <paragraph-container>
        <subheading>Hi!</subheading>
        <paragraph>
          Thank you so much for preregistering and sticking with me throughout
          this long development time. I really appreciate your patience.
        </paragraph>
        <paragraph>
          tasteful's gone under some major fundamental changes as I've
          continued to learn more as I go, and unfortunately I've had to reset all
          usernames due to several bugs. This will not happen again; my first
          attempt was elementary and, admittedly, untested.
        </paragraph>
        <paragraph>
          <strong>Please enter your desired username.</strong>
        </paragraph>
        <form class="username-input-container" @submit.prevent="submitUsername">
          <text-input
            v-model="usernameToSubmit"
            no-bottom-margin
            name="username-input"
            placeholder="Username"
            :class="{'flashRed' : usernameError}"
            @animation-over="usernameError = false"
          >
            <template v-slot:icon>
              <face-icon title="Username" />
            </template>
          </text-input>
          <submit-button include-arrow-icon :stop-loading="usernameError" :success="username !== undefined">
            <span>Submit</span>
          </submit-button>
        </form>
        <paragraph v-if="error.display" error no-left-margin-on-mobile>
          {{ error.message }}
        </paragraph>
      </paragraph-container>
    </article-content>
    <article-content v-else>
      <paragraph-container>
        <subheading>How'd we get here?</subheading>
        <paragraph>I think you might want to log in to access this page.</paragraph>
      </paragraph-container>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import faceIcon from 'vue-material-design-icons/Face.vue'
import masthead from '~/components/Masthead.vue'
import subheading from '~/components/Subheading.vue'
import paragraph from '~/components/Paragraph.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import textInput from '~/components/TextInput.vue'
import submitButton from '~/components/SubmitButton.vue'
import articleContent from '~/components/ArticleContent.vue'

export default {
  name: 'Settings',
  components: {
    masthead,
    subheading,
    paragraph,
    paragraphContainer,
    textInput,
    submitButton,
    articleContent,
    faceIcon
  },
  data () {
    return {
      username: undefined,
      usernameError: false,
      usernameToSubmit: '',
      error: {
        display: false,
        message: ''
      }
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    },
    user () {
      return this.$store.state.login.user
    }
  },
  methods: {
    submitUsername () {
      // remove any existing errors
      this.error.display = false
      this.usernameError = false
      this.error.message = ''
      // check if username is valid
      if (this.usernameToSubmit.includes(' ')) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'No spaces, please.'
      } else if (!this.usernameToSubmit.match(/[a-z]/i)) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'Make sure you\'ve got some letters in there.'
      } else if (this.usernameToSubmit.includes('tastef') || this.usernameToSubmit.includes('admin')) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'Please don\'t try to impersonate authority. 1312.'
      } else if (this.usernameToSubmit.length < 3) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'Double-check that your username is over three characters long.'
      } else if (this.usernameToSubmit.length > 16) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'Keep it under 16 characters, cheers.'
      } else {
      // check if username already existed
        const usernames = this.$fireStore.collection('usernames')
        const users = this.$fireStore.collection('users')
        usernames.get()
          .then((data) => {
            data.forEach((username) => {
              if (this.usernameToSubmit.toLowerCase() === username.id.toLowerCase()) {
                this.error.display = true
                this.error.message = 'Someone\'s already got that username, unfortunately. Get those creative juices flowing!'
              }
            })
            // update usernameError value once
            if (this.error.display) {
              this.usernameError = true
            } else {
              // if the username wasn't taken, add it to the database
              // first add it to the user's own document
              users.doc(this.user.id).set({
                username: this.usernameToSubmit
              }, { merge: true })
                .then(() => {
                  // then add it to the list of usernames
                  usernames.doc(this.usernameToSubmit).set({
                    uid: this.user.id
                  })
                    .then(() => {
                      // all is done.
                      this.username = this.usernameToSubmit
                      setTimeout(() => {
                        this.$router.push({ path: '/user/' + this.username })
                      }, 1000)
                    })
                    .catch((error) => {
                      this.error.display = true
                      this.error.message = 'Something went wrong. ' + error
                    })
                })
                .catch((error) => {
                  this.error.display = true
                  this.error.message = 'Something went wrong. ' + error
                })
            }
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
.username-input-container {
  display: flex;
  align-items: center;
}
.submit-button {
  margin-left: 10px;
}
</style>
