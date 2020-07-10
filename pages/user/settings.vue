<template>
  <main class="user">
    <!-- blur while loading -->
    <blur v-if="loading" :apply-blur="loading" />
    <article-content v-if="user !== null && user.username === '' && !loading">
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
          tasteful's gone under some major fundamental changes as I've continued
          to learn more as I go, and unfortunately I've had to reset all
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
            :class="{ flashRed: usernameError }"
            @animation-over="usernameError = false"
          >
            <template v-slot:icon>
              <face-icon title="Username" />
            </template>
          </text-input>
          <submit-button
            include-arrow-icon
            :stop-loading="usernameError"
            :success="username !== undefined"
          >
            <span>Submit</span>
          </submit-button>
        </form>
        <paragraph v-if="error.display" error no-left-margin-on-mobile>
          {{ error.message }}
        </paragraph>
      </paragraph-container>
    </article-content>
    <article-content
      v-else-if="loading === false && (user === false || user === null)"
    >
      <paragraph-container>
        <subheading>How'd we get here?</subheading>
        <paragraph>
          I think you might want to log in to access this page.
        </paragraph>
      </paragraph-container>
    </article-content>
    <article-content v-else wider>
      <!-- the actual settings part -->
      <masthead centred smaller>
        Settings
      </masthead>
      <!-- <divided-container id="public-profile">
        <template v-slot:left>
          <subheading smaller no-top-margin>
            Public profile
          </subheading>
          <paragraph soft>
            These are preferences that control things that are visible to the
            public.
          </paragraph>
        </template>
        <template v-slot:right>
          <input-label no-top-margin>
            Display name
          </input-label>
          <text-input
            name="display-name-input"
            placeholder="This is what people see on your profile."
            default-value="Hello"
            full-width
            @input="update('display name', $event)"
          >
            <template v-slot:icon>
              <face-icon title="Display name" />
            </template>
          </text-input>
          <input-label>
            Username (the one in your URL)
          </input-label>
          <text-input
            name="username-input"
            placeholder="This is how people get to your profile."
            :default-value="!loading ? user.username : ''"
            full-width
            @input="update('username')"
          >
            <template v-slot:icon>
              <link-icon title="Username" />
            </template>
          </text-input>
          <input-label>
            Pronouns
          </input-label>
          <div class="flex-container">
            <dropdown-input
              name="pronouns-input-one"
              description-value="A pronoun."
              :options="['he', 'she', 'they', 'ze', 'xey', 'any']"
              full-width
              right-margin
              @change="update('pronouns', $event)"
            >
              <template v-slot:icon>
                <gender-male-female-icon title="Pronouns" />
              </template>
            </dropdown-input>
            <dropdown-input
              no-icon
              name="pronouns-input-two"
              description-value="Another pronoun!"
              :options="['him', 'her', 'them', 'hir', 'zir', 'xem', 'xyr', 'all']"
              full-width
              @change="update('pronouns', $event)"
            />
          </div>
        </template>
      </divided-container> -->
      <divided-container>
        <template v-slot:left>
          <subheading smaller no-top-margin>
            Theming
          </subheading>
          <paragraph soft>
            Your changes will persist across sessions, but not different browsers and devices at this stage.
          </paragraph>
        </template>
        <template v-slot:right>
          <input-label no-top-margin>
            Currently selected theme
          </input-label>
          <dropdown-input
            name="selected-theme-input"
            description-value="Which lovely theme will you choose?"
            :default-value="colourMode"
            :options="['light', 'dark', 'solarised-light', 'solarised-dark', 'black']"
            full-width
            @change="update('theme', $event)"
          >
            <template v-slot:icon>
              <palette-icon title="Selected theme" />
            </template>
          </dropdown-input>
          <!-- <input-label>
            Dynamic colouring
          </input-label>
          <checkbox>It's enabled. This may impact performance.</checkbox> -->
          <input-label>
            Navbar theme toggle options
          </input-label>
          <div class="flex-container">
            <dropdown-input
              name="navbar-theme-toggle-input-one"
              description-value="A nice theme."
              :default-value="colourModeToggle[0]"
              :options="['light', 'solarised-light']"
              full-width
              right-margin
              @change="update('theme-toggle', [0, $event])"
            >
              <template v-slot:icon>
                <invert-colours-icon title="Navbar theme toggle" />
              </template>
            </dropdown-input>
            <dropdown-input
              no-icon
              name="navbar-theme-toggle-input-two"
              description-value="Another theme that you like (we hope)."
              :default-value="colourModeToggle[1]"
              :options="['dark', 'solarised-dark', 'black']"
              full-width
              @change="update('theme-toggle', [1, $event])"
            />
          </div>
        </template>
      </divided-container>

      <divided-container>
        <template v-slot:left>
          <subheading smaller no-top-margin>
            Invites
          </subheading>
          <paragraph soft>
            Expanding tasteful's world domination, one code and seed at a time.
          </paragraph>
        </template>
        <template v-slot:right>
          <div v-if="!inviteCode">
            <regular-button @pressed="generateInvitation">
              <span>Generate Invitation</span>
            </regular-button>
            <paragraph>
              Be aware that Invitations may only be used once and it is impossible
              to generate a second. Share it wisely.
            </paragraph>
          </div>
          <div v-else>
            <input-label no-top-margin>
              Invite code
            </input-label>
            <text-input
              name="invite-code-input"
              :default-value="!loading ? inviteCode : ''"
              full-width
              disabled
            >
              <template v-slot:icon>
                <key-icon title="Invite code" />
              </template>
            </text-input>
            <input-label>
              Invite seed
            </input-label>
            <text-input
              name="invite-seed-input"
              :default-value="!loading ? inviteSeed : ''"
              full-width
              disabled
            >
              <template v-slot:icon>
                <fingerprint-icon title="Invite seed" />
              </template>
            </text-input>
            <paragraph>Your Invitation has <span v-if="!inviteUsed">not</span> been used. <span v-if="inviteUsed">Thanks for helping tasteful grow!</span><span v-else>Share that code and seed!</span></paragraph>
          </div>
        </template>
      </divided-container>
      <!-- <divided-container>
        <template v-slot:left>
          <subheading smaller no-top-margin>
            Search
          </subheading>
          <paragraph soft>
            For settings related to the tasteful search engine, I suppose.
          </paragraph>
        </template>
        <template v-slot:right>
          <input-label no-top-margin>
            Display album art where no artist image is available
          </input-label>
          <checkbox>Beware: this will seriously hit performance.</checkbox>
          <input-label>
            Display artist image when available
          </input-label>
          <checkbox>This will impact tasteful's data usage.</checkbox>
          <input-label>
            Display album art when available
          </input-label>
          <checkbox>This will also impact tasteful's data usage.</checkbox>
          <input-label>
            Display pretty floating circles
          </input-label>
          <checkbox>Aren't they nice?</checkbox>
        </template>
      </divided-container> -->
      <divided-container red-border>
        <template v-slot:left>
          <subheading smaller no-top-margin>
            Danger zone
          </subheading>
          <paragraph soft>
            Proceed with caution; some of these settings may lead to
            irreversable troubles!
          </paragraph>
        </template>
        <template v-slot:right>
          <!-- <input-label no-top-margin>
            Experimental features
          </input-label>
          <checkbox>They're available now. Proceed with caution!</checkbox> -->
          <regular-button include-arrow-icon @pressed="signOut">
            <span>Sign out</span>
          </regular-button>
        </template>
      </divided-container>
      <paragraph centred>
        Changes are automatically saved, don't worry!
      </paragraph>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import crypto from 'crypto'
import faceIcon from 'vue-material-design-icons/Face.vue'
// import linkIcon from 'vue-material-design-icons/Link.vue'
import keyIcon from 'vue-material-design-icons/Key.vue'
import fingerprintIcon from 'vue-material-design-icons/Fingerprint.vue'
// import genderMaleFemaleIcon from 'vue-material-design-icons/GenderMaleFemale.vue'
import invertColoursIcon from 'vue-material-design-icons/InvertColors.vue'
import paletteIcon from 'vue-material-design-icons/Palette.vue'
import { mapGetters } from 'vuex'
import masthead from '~/components/Masthead.vue'
import subheading from '~/components/Subheading.vue'
import paragraph from '~/components/Paragraph.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import textInput from '~/components/TextInput.vue'
import dropdownInput from '~/components/DropdownInput.vue'
import submitButton from '~/components/SubmitButton.vue'
import regularButton from '~/components/RegularButton.vue'
import articleContent from '~/components/ArticleContent.vue'
import dividedContainer from '~/components/DividedContainer.vue'
import inputLabel from '~/components/InputLabel.vue'
import blur from '~/components/Blur.vue'
// import checkbox from '~/components/Checkbox.vue'
import { adjectives, nouns } from '~/assets/js/words.js'

export default {
  name: 'Settings',
  components: {
    masthead,
    subheading,
    paragraph,
    paragraphContainer,
    textInput,
    dropdownInput,
    submitButton,
    regularButton,
    articleContent,
    faceIcon,
    // linkIcon,
    keyIcon,
    fingerprintIcon,
    // genderMaleFemaleIcon,
    paletteIcon,
    invertColoursIcon,
    dividedContainer,
    blur,
    // checkbox,
    inputLabel
  },
  data () {
    return {
      username: undefined,
      usernameError: false,
      usernameToSubmit: '',
      loading: true,
      inviteCode: undefined,
      inviteSeed: undefined,
      inviteUsed: undefined,
      error: {
        display: false,
        message: ''
      }
    }
  },
  computed: mapGetters({
    colourMode: 'theme/colourMode',
    colourModeToggle: 'theme/colourModeToggle',
    user: 'login/user'
  }),
  mounted () {
    setTimeout(() => {
      if (this.user === null || this.user === false) {
        this.loading = false
      } else if (this.user) {
        this.inviteCode = this.user.inviteCode
        this.inviteSeed = this.user.inviteSeed
        this.loading = false
        // check if Invitation has been used
        this.$fireStore.collection('invites').doc(this.user.invitation).get()
          .then((doc) => {
            const data = doc.data()
            this.inviteUsed = data.used
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }, 3000)
  },
  methods: {
    submitUsername () {
      // remove any existing errors
      this.error.display = false
      this.usernameError = false
      this.error.message = ''
      // check if username is valid
      if (/[\s~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?()._]/g.test(this.usernameToSubmit)) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'No symbols!'
      } else if (this.usernameToSubmit.includes(' ')) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'No spaces, please.'
      } else if (!this.usernameToSubmit.match(/[a-z]/i)) {
        this.error.display = true
        this.usernameError = true
        this.error.message = "Make sure you've got some letters in there."
      } else if (
        this.usernameToSubmit.includes('tastef') ||
        this.usernameToSubmit.includes('admin') ||
        this.usernameToSubmit.includes('settings')
      ) {
        this.error.display = true
        this.usernameError = true
        this.error.message = "Please don't try to impersonate authority. 1312."
      } else if (this.usernameToSubmit.length < 3) {
        this.error.display = true
        this.usernameError = true
        this.error.message =
          'Double-check that your username is over three characters long.'
      } else if (this.usernameToSubmit.length > 16) {
        this.error.display = true
        this.usernameError = true
        this.error.message = 'Keep it under 16 characters, cheers.'
      } else {
        // check if username already existed
        const usernames = this.$fireStore.collection('usernames')
        const users = this.$fireStore.collection('users')
        usernames.get().then((data) => {
          data.forEach((username) => {
            if (
              this.usernameToSubmit.toLowerCase() === username.id.toLowerCase()
            ) {
              this.error.display = true
              this.error.message =
                "Someone's already got that username, unfortunately. Get those creative juices flowing!"
            }
          })
          // update usernameError value once
          if (this.error.display) {
            this.usernameError = true
          } else {
            // if the username wasn't taken, add it to the database
            // first add it to the user's own document
            users
              .doc(this.user.id)
              .set(
                {
                  username: this.usernameToSubmit
                },
                { merge: true }
              )
              .then(() => {
                // then add it to the list of usernames
                usernames
                  .doc(this.usernameToSubmit)
                  .set({
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
    },
    update (toUpdate, value) {
      if (toUpdate === 'display name') {
        console.log(value)
      } else if (toUpdate === 'theme') {
        this.$store.commit('theme/setColourMode', value)
      } else if (toUpdate === 'theme-toggle') {
        const themeToggle = this.colourModeToggle
        if (value[0] === 0) {
          themeToggle[0] = value[1]
        } else {
          themeToggle[1] = value[1]
        }
        this.$store.commit('theme/setColourModeToggle', themeToggle)
      }
    },
    signOut () {
      this.$store.commit('login/setUser', 'logout')
      this.$store.dispatch('login/signOutUser')
    },
    generateInvitation () {
      const randomItem = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)]
      }
      const inviteCode = [randomItem(adjectives), '-', randomItem(adjectives), '-', randomItem(adjectives), '-', randomItem(nouns)]
      this.inviteCode = inviteCode.join('')
      this.inviteSeed = crypto.randomBytes(4).toString('hex')
      const invitation = crypto.createHash('sha256').update(this.inviteCode + this.inviteSeed).digest('hex')
      // check if invitation has already been created (odds are mindbogglingly low)
      this.$fireStore.collection('invites').doc(invitation).get()
        .then((res) => {
          if (res.exists) {
            alert('You just got incredibly lucky: you generated an existing Invitation. This is EXTREMELY rare (like, 1 in trillions of zillions or something odds). I wasn\'t expecting anyone to see this... but I hope you enjoyed this celebration. Have a good day!')
          } else {
            this.$fireStore.collection('users').doc(this.user.id).set({
              inviteSeed: this.inviteSeed,
              inviteCode: this.inviteCode,
              invitation
            }, { merge: true })
              .then(() => {
                this.$fireStore.collection('invites').doc(invitation).set({
                  used: false
                })
              })
          }
        })
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
.flex-container {
  display: flex;
}
</style>
