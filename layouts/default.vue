<template>
  <div id="app" :class="[colourMode]">
    <div v-if="user && user.username === 'lachlantula'">
      <transition name="fade">
        <modal v-if="showModal" scrollable @closeModal="showModal = false">
          <template #heading>
            <subheading no-defined-width smaller no-top-margin>
              <span v-if="showSignIn">Welcome back!</span>
              <span v-else>Welcome aboard!</span>
            </subheading>
          </template>
          <template #left>
            <paragraph>
              <span v-if="showSignIn">It's always a pleasure to see you.</span>
              <span v-else>Well, this is awkward... I guess we've never met. Let's change that.</span>
              <br>
              <a @click="showSignIn = !showSignIn">
                <span v-if="showSignIn">Don't have an account yet?</span>
                <span v-else>Already got an account with us?</span>
              </a>
            </paragraph>
            <!-- <input-label no-top-margin>
              <span v-if="showSignIn">Sign in</span>
              <span v-else>Sign up</span>
            </input-label> -->
            <paragraph v-if="allowSignup && !showSignIn">
              Your Invitation has been approved, so you're good to sign up.
            </paragraph>
            <form @submit.prevent="signIn">
              <text-input name="email-input" placeholder="Email" :class="{'flashRed' : emailFlashRed}" @input="email = $event" @animation-over="emailFlashRed = false">
                <template #icon>
                  <email-icon title="Email" />
                </template>
              </text-input>
              <text-input
                v-if="!showSignIn"
                name="username-input"
                placeholder="Username"
                :class="{'flashRed' : usernameFlashRed}"
                @input="username = $event"
                @animation-over="usernameFlashRed = false"
              >
                <template #icon>
                  <face-icon title="Username" />
                </template>
              </text-input>
              <text-input
                name="password-input"
                placeholder="Password"
                :class="{'flashRed' : passwordFlashRed}"
                password
                @input="password = $event"
                @animation-over="passwordFlashRed = false"
              >
                <template #icon>
                  <key-icon title="Password" />
                </template>
              </text-input>
              <div id="sign-in-button-container">
                <submit-button include-arrow-icon centre-on-small-screens :stop-loading="emailFlashRed || passwordFlashRed || usernameFlashRed" :success="user !== null && user !== false">
                  <span v-if="user === null || user === false" v-text="showSignIn ? 'Sign in' : 'Sign up'" />
                  <span v-else v-text="showSignIn ? 'Signed in' : 'Signed up'" />
                </submit-button>
                <!-- <a v-if="showSignIn" class="soft modal-link" @click="showSignIn = !showSignIn">Having trouble with your password?</a> -->
                <a class="soft modal-link display-only-if-on-mobile" @click="showSignIn = !showSignIn">
                  <span v-if="showSignIn">Don't have an account yet?</span>
                  <span v-else>Already got an account with us?</span>
                </a>
              </div>
            </form>
            <paragraph v-if="error.display" error>
              {{ error.message }}
            </paragraph>
          <!-- <paragraph v-if="!showSignIn" smaller>
              By signing up for tasteful you agree to our Terms of Service and Privacy Policy, as well as the license the Software follows.
            </paragraph> -->
          </template>
        </modal>
      </transition>
      <div v-if="user">
        <span>Logged in as: {{ user.username }}</span>
        <nuxt-link to="/user/settings">
          Go sign out
        </nuxt-link>
      </div>
      <div v-else>
        <button @click="showModal = true">
          Login
        </button>
      </div>
      <div v-if="user">
        <nuxt v-if="user.username === 'lachlantula' || user.username === 'lachlan' || user.username === 'yves'" />
      </div>
      <div v-else>
        that was fun. but it's time for me to go (unless you're logged in as lachlantula).
      </div>
      <bar :visible="barVisible">
        <span v-if="barMessage">{{ barMessage }}</span>
        <span v-else> <!-- little easter egg for the eagle eyed; shows when the editor is closed and after draft is saved -->
          Weeeeeeeeeee! 🙌
        </span>
      </bar>
    </div>
    <div v-else class="advert">
      <article>
        <masthead centred>
          🤞
        </masthead>
        <masthead centred>
          2021 is the goal
        </masthead>
        <subheading centred smaller>
          Follow our Twitter to stay up to date.
        </subheading>
        <regular-button style="margin-top: 16px;" centred type="primary" to="https://twitter.com/tasteful_app">
          Go to our Twitter
        </regular-button>
      </article>
    </div>
  </div>
</template>

<script>
import EmailIcon from 'vue-material-design-icons/Email.vue'
import FaceIcon from 'vue-material-design-icons/Face.vue'
import KeyIcon from 'vue-material-design-icons/Key.vue'
import { mapGetters } from 'vuex'
import Modal from '@/components/Modal.vue'
import Subheading from '@/components/Subheading.vue'
import Paragraph from '@/components/Paragraph.vue'
import TextInput from '@/components/TextInput.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import bar from '@/components/Bar.vue'
import masthead from '@/components/Masthead.vue'
import subheading from '@/components/Subheading.vue'
import RegularButton from '~/components/RegularButton.vue'

export default {
  components: {
    EmailIcon,
    FaceIcon,
    KeyIcon,
    Modal,
    Subheading,
    Paragraph,
    TextInput,
    SubmitButton,
    bar,
    masthead,
    subheading,
    RegularButton
  },
  layout: 'default',
  data () {
    return {
      showNavbar: true,
      showNavBackground: false,
      lastScrollPosition: 0,
      showModal: false,
      showSignIn: true,
      showSearchModal: false,
      username: '',
      email: '',
      password: '',
      emailFlashRed: false,
      usernameFlashRed: false,
      passwordFlashRed: false,
      noOverflowX: false,
      showMenuOnMobile: false
    }
  },
  computed: mapGetters({
    error: 'login/error',
    user: 'login/user',
    colourMode: 'theme/colourMode',
    colourModeToggle: 'theme/colourModeToggle',
    allowSignup: 'login/allowSignup',
    barVisible: 'interface/barVisible',
    barMessage: 'interface/barMessage'
  }),
  watch: {
    $route (to, from) {
      const routeName = this.$route.name
      if (routeName === 'index') {
        document.title = 'tasteful'
      } else {
        document.title = 'tasteful | ' + routeName
      }
    },
    error (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          error.message = 'Please type your email address in the format person@email.com.'
          this.emailFlashRed = true
          break
        case 'auth/too-many-requests':
          error.message = 'Slow down; your network seems to be showing some weird activity. Try again after a reload.'
          this.emailFlashRed = true
          this.passwordFlashRed = true
          break
        case 'auth/wrong-password':
          error.message = 'Please retype your password - it\'s incorrect.'
          this.passwordFlashRed = true
          break
        case 'auth/user-not-found':
          error.message = 'Couldn\'t find that user, I\'m afraid. Please double-check that you typed your email right.'
          this.emailFlashRed = true
          break
        case 'auth/app-deleted':
        case 'auth/app-not-authorized':
        case 'auth/invalid-api-key':
          this.emailFlashRed = true
          this.passwordFlashRed = true
          error.message = 'There seemed to be a serious error connecting to Firebase. I assume you know what you\'re doing, so the error code is ' + error.code + '.'
          break
        // usernames
        case 'username/symbols':
          this.usernameFlashRed = true
          error.message = 'Keep symbols out of your username, please.'
          break
        case 'username/spaces':
          this.usernameFlashRed = true
          error.message = 'No spaces in usernames, please.'
          break
        case 'username/numbers':
          this.usernameFlashRed = true
          error.message = 'Make sure you\'ve got some letters in your username.'
          break
        case 'username/impersonate':
          this.usernameFlashRed = true
          error.message = 'Please don\'t try to impersonate authority with a username like that. 1312.'
          break
        case 'username/too-short':
          this.usernameFlashRed = true
          error.message = 'Double-check that your username is over three characters long.'
          break
        case 'username/too-long':
          this.usernameFlashRed = true
          error.message = 'Keep your username under 16 characters, cheers.'
          break
        case 'username/taken':
          this.usernameFlashRed = true
          error.message = 'Someone\'s already got that username, unfortunately. Get those creative juices flowing!'
          break
        default:
          this.emailFlashRed = false
          this.passwordFlashRed = false
          this.usernameFlashRed = false
          error.message = 'Not too sure how to handle this one. Code: ' + error.code
      }
    },
    user (user) {
      if (user !== null && user !== false && this.email !== '') {
        // when sign in is completed (and not from persisted state)...
        // check to see if the user has a username
        const usersDatabase = this.$fire.firestore.collection('users')
        usersDatabase.doc(this.user.id).get()
          .then((user) => {
            const userData = user.data()
            let username
            if (userData === undefined || userData.username === undefined) {
              // if the user has no username
              username = null
            } else {
              // if the user has a username
              username = userData.username
            }
            setTimeout(() => {
              this.showModal = false
              if (username !== null) {
                this.$router.push({ path: '/user/' + username })
              } else {
                this.$router.push({ path: '/user/settings' })
              }
            }, 1000)
          })
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
    // check if user is already logged in
    this.$fire.auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('login/updateUser', user)
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll () {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop
      if (currentScrollPosition < 0) {
        return
      } // Stop executing this function if the difference between
      // current scroll position and last scroll position is less than some offset
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 100) {
        return
      }
      this.showNavbar = currentScrollPosition < this.lastScrollPosition
      this.lastScrollPosition = currentScrollPosition
      if (this.showNavbar && this.lastScrollPosition >= 100) {
        this.showNavBackground = true
      } else {
        this.showNavBackground = false
      }
    },
    toggleColourScheme () {
      const indexOfTheme = this.colourModeToggle.indexOf(this.colourMode)
      let indexOfThemeToCommit = 0
      // if the currently selected theme is not in the toggle...
      if (indexOfTheme === -1) {
      // ...reset the theme to the first declared in the toggle.
        indexOfThemeToCommit = 0
      } else if (indexOfTheme === 0) {
        indexOfThemeToCommit = 1
      } else {
        indexOfThemeToCommit = 0
      }
      this.$store.commit('theme/setColourMode', this.colourModeToggle[indexOfThemeToCommit])
      localStorage.setItem('theme', this.colourMode)
    },
    signIn () {
      if (this.showSignIn) { // sign in
        this.$store.dispatch('login/signInUser', { email: this.email, password: this.password })
      } else if (!this.showSignIn && this.allowSignup) { // signup with invite
        this.$store.dispatch('login/signUpUser', { email: this.email, username: this.username, password: this.password })
      } else { // sign up
        alert('Sign ups are currently disabled. If you have an invite code and seed, visit https://tasteful.reviews/invite.')
      // this.$store.dispatch('login/signUpUser', { email: this.email, password: this.password })
      }
    },
    updateDisplayOnSearch (searching) {
      if (searching) {
      // If the search menu is up, disable overflow.
        this.noOverflowX = true
      } else {
        this.noOverflowX = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/palette.scss';

@font-face {
  font-family: 'Public Sans';
  font-weight: 400;
  src: url(/fonts/PublicSans-Medium.woff2) format("woff2");
}
@font-face {
  font-family: 'Public Sans';
  font-weight: 500;
  src: url(/fonts/PublicSans-SemiBold.woff2) format("woff2");
}
@font-face {
  font-family: 'Public Sans';
  font-weight: 700;
  src: url(/fonts/PublicSans-Bold.woff2) format("woff2");
}
@font-face {
  font-family: 'Public Sans';
  font-weight: 900;
  src: url(/fonts/PublicSans-Black.woff2) format("woff2");
}
body,
html,
#app {
  padding: 0;
  margin: 0;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  // &.noOverflowX {
  //   overflow-x: hidden;
  // }
}
body,
html,
#app,
input,
button {
  font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  transition: background 0.2s linear;
  min-height: 100vh;
  &.light {
    background: $lightest-purple;
  }
  &.dark {
    background: $dark-background;
  }
  &.solarised-light {
    background: $solarised-light-main-background;
  }
  &.solarised-dark {
    background: $solarised-dark-main-background;
  }
  &.black {
    background: $black;
  }
}
input, textarea, select {
  font-family: inherit;
}
nav {
  user-select: none;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
  padding-left: 5%;
  padding-right: 5%;
  width: 90%;
  opacity: 1;
  transition: all 0.2s linear;
  &:before {
    transition: all 0.2s linear;
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    background: $nav-background;
    backdrop-filter: blur(5px);
    content: " ";
    width: 100%;
    opacity: 0;
    z-index: -5;
  }
  a {
    padding: 5px;
  }
  &.dark, &.solarised-dark {
    &:before {
      background: linear-gradient(
        270deg,
        hsla(0, 45%, 23%, 0.9),
        hsla(252, 50%, 26%, 0.9)
      );
    }
  }
  &.black {
    &:before {
      background: $dark-grey;
    }
  }
}
nav.nav-unstuck {
  opacity: 0;
  pointer-events: none; // click through div without using display: none
}
nav.nav-beyond-point {
  &:before {
    opacity: 1;
  }
}
.maintenance {
  background: hsl(352, 52%, 55%);
  color: hsl(0, 0%, 100%);
  padding-top: 5px;
  padding-bottom: 5px;
}
#nav-content {
  display: flex;
  align-items: center;
  width: 100%;
  #logo {
    color: $saturated-red;
    background: $tasteful-gradient;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    &:hover {
      background: linear-gradient(270deg, $saturated-red, $saturated-purple);
      background-size: 600% 600%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
      -webkit-animation: logoAnimation 2s ease infinite;
      -moz-animation: logoAnimation 2s ease infinite;
      animation: logoAnimation 2s ease infinite;
      @-webkit-keyframes logoAnimation {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      @-moz-keyframes logoAnimation {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      @keyframes logoAnimation {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    }
  }
}
.tasteful-icon {
  transition: all 0.2s linear;
  height: 30px;
  margin-right: 10px;
  opacity: 0.5;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
}
a {
  outline: none;
  color: $saturated-purple;
  text-decoration: none;
  transition: all 0.2s linear;
  &:hover {
    cursor: pointer;
    color: $dimmer-purple;
  }
  &.soft, &.dark, &.solarised-dark {
    color: $soft-red;
    transition: all 0.2s linear;
    &:hover {
      color: $soft-red-dim;
    }
  }
  &.modal-link {
    font-size: 0.8rem;
    margin-left: 10px;
  }
}
#links {
  font-size: 1.5rem;
  .link {
    text-decoration: none;
  }
}
.link.dark, .link.solarised-dark {
  color: hsl(352, 52%, 75%);
  &:hover {
    color: hsl(352, 32%, 55%);
  }
}
.link.black {
  color: $quite-dark-grey;
  &:hover {
    color: $light-grey;
  }
}
#sign-in-button-container {
  display: flex;
  align-items: center;
}

.display-only-if-on-mobile {
  display: none;
}

.advert {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

input, button, a {
  &:focus {
    outline: none;
  }
}

@media (max-width: 600px) {
  nav {
    &:before {
      background: linear-gradient(270deg, hsl(0, 35%, 73%), hsl(252, 30%, 76%));
      filter: blur(0px);
    }
  }
  #nav-content {
    h1 {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}

@media (max-width: 1000px) {
  #logo {
    display: none;
  }
  #sign-in-button-container {
    margin-top: 5%;
    display: block;
    .submit-button {
      margin-bottom: calc(5% - 5px); // -5px to account for links below
    }
    .modal-link {
      margin-top: 5px;
      margin-left: 0;
    }
  }
  .display-only-if-on-mobile {
    display: block;
  }
  #links {
    display: none;
    &.showMenuOnMobile {
      display: flex;
    }
  }
  .toggle-menu-icon {
    margin-left: auto;
  }
}

@media (min-width: 1000px) {
  #sign-in-button-container {
    height: 55px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
