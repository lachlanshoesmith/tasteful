<template>
  <main class="invite-container">
    <blur loading :apply-blur="loading" />
    <div v-if="user === null || user === false">
      <div class="invite">
        <article-content>
          <masthead centred smaller>
            Invites
          </masthead>
          <divided-container>
            <template #left>
              <subheading smaller no-top-margin>
                Invites
              </subheading>
              <paragraph>@lachlantula doesn't have any. Don't ask him.</paragraph>
            </template>
            <template #right>
              <form @submit.prevent="testInvitation">
                <text-input
                  v-model="inviteCode"
                  :class="{'flashRed' : flashRed}"
                  full-width
                  name="invite-code-input"
                  placeholder="Invite code"
                  @animation-over="flashRed = false"
                >
                  <template #icon>
                    <key-icon decorative title="Invite code" />
                  </template>
                </text-input>
                <text-input v-model="inviteSeed" :class="{'flashRed' : flashRed}" full-width name="invite-seed-input" placeholder="Invite seed">
                  <template #icon>
                    <fingerprint-icon decorative title="Invite seed" />
                  </template>
                </text-input>
                <submit-button
                  smaller
                  include-arrow-icon
                  centre-on-small-screens
                  :stop-loading="flashRed"
                  :success="inviteSubmitted"
                >
                  <span>Leave RYM</span>
                </submit-button>
              </form>
              <paragraph v-if="inviteSubmitted">
                Your Invitation has been approved; you may now sign up via the login form. Welcome aboard!
              </paragraph>
            </template>
          </divided-container>
          <paragraph-container>
            <subheading>What's an invite seed, an invite code, and an Invitation?</subheading>
            <paragraph>
              An <strong>invite seed</strong> is an eight-character set of alphanumeric characters that is used to significantly reduce the
              likelihood of a randomly-guessed invite code from being successful in developing an Invitation.
              If you're familiar with cryptography, this is a salt.
            </paragraph>
            <paragraph>
              An <strong>invite code</strong> is a code of randomly-generated words that is one of the two parts (the other being the invite seed)
              required in developing an Invitation.
            </paragraph>
            <paragraph>
              An <strong>Invitation</strong> is 'go-ahead' given by the tasteful code that offers the opportunity to sign up for the website.
              This go-ahead is generated following verification that when your invite seed and code are hashed in unison that they reach the same result
              as what is in our database.
            </paragraph>
          </paragraph-container>
          <paragraph-container>
            <subheading>How do I get an invite seed and code?</subheading>
            <paragraph>
              Invite codes are given out rarely to select members of the tasteful community.
              There is no way to get one other than to know somebody who has one and is generous enough to give it to you.
              It may only be used once.
            </paragraph>
          </paragraph-container>
          <paragraph-container>
            <subheading>Why is this all so complicated for seemingly no reason?</subheading>
            <paragraph>So losers like you don't get in.</paragraph>
          </paragraph-container>
        </article-content>
      </div>
    </div>
    <div v-else class="invite">
      <article-content>
        <paragraph-container>
          <subheading>You already have an account, silly!</subheading>
          <paragraph>
            You may have meant to go to your
            <nuxt-link to="/user/settings">
              user settings</nuxt-link> <!-- eslint-disable-line -->
            to generate or share your Invitation?
          </paragraph>
        </paragraph-container>
      </article-content>
    </div>
  </main>
</template>

<script>
import crypto from 'crypto'
import FingerprintIcon from 'vue-material-design-icons/Fingerprint.vue'
import KeyIcon from 'vue-material-design-icons/Key.vue'
import ArticleContent from '~/components/ArticleContent.vue'
import ParagraphContainer from '~/components/ParagraphContainer.vue'
import Paragraph from '~/components/Paragraph.vue'
import Masthead from '~/components/Masthead.vue'
import TextInput from '~/components/TextInput.vue'
import Subheading from '~/components/Subheading.vue'
import DividedContainer from '~/components/DividedContainer.vue'
import SubmitButton from '~/components/SubmitButton.vue'
import Blur from '~/components/Blur.vue'

export default {
  name: 'Invite',
  components: {
    FingerprintIcon,
    KeyIcon,
    TextInput,
    ArticleContent,
    ParagraphContainer,
    Paragraph,
    Masthead,
    Subheading,
    DividedContainer,
    SubmitButton,
    Blur
  },
  data () {
    return {
      inviteSeed: '',
      inviteCode: '',
      loading: true,
      flashRed: false,
      inviteSubmitted: false
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
  mounted () {
    setTimeout(() => {
      this.loading = false
    }, 2000)
  },
  methods: {
    testInvitation () {
      const invitation = crypto.createHash('sha256').update(this.inviteCode + this.inviteSeed).digest('hex')
      this.$fire.firestore.collection('invites').doc(invitation).get()
        .then((res) => {
          if (res.exists && (res.data().used === false)) {
            this.submitInvitation(invitation)
          } else {
            this.flashRed = true
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    submitInvitation (invitation) {
      this.$fire.firestore.collection('invites').doc(invitation).set({
        used: true
      })
        .then(() => {
          // User may now sign up
          this.$store.commit('login/setSignup', true)
          this.inviteSubmitted = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.invite {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
</style>
