<template>
  <div :class="colourMode" class="index">
    <resize-observer @notify="handleResize" />
    <main>
      <masthead :fullWidth="isFullWidth">
        {{ mastheadText }}
      </masthead>
      <section class="call-to-action-box">
        <h2>Preregister an account now for early access in the near future.</h2>
        <form
          id="preregistration-input-box"
          @submit.prevent="onSignup"
          name="preregistration"
        >
          <div class="call-to-action-content">
            <div class="email-input">
              <input
                id="preregistration-email-input"
                v-model="email"
                type="email"
                name="email"
                placeholder="Enter your email address here..."
                tabIndex="100"
              >
            </div>
            <div class="username-input">
              <div id="at-sign">
                @
              </div>
              <input
                id="preregistration-username-input"
                v-model="username"
                type="text"
                name="username"
                placeholder="Enter your desired username here..."
                tabIndex="101"
              >
              <button id="preregistration-submit-input" type="submit" tabIndex="103">
                <chevron-right-icon title="Submit your desired username." />
              </button>
            </div>
            <div class="password-input">
              <input
                id="preregistration-password-input"
                v-model="password"
                type="password"
                name="password"
                placeholder="Enter your password here..."
                tabIndex="102"
              >
            </div>
          </div>
        </form>
      </section>
    </main>
    <!-- <footer>
      <nuxt-link to="/demo"
        >Want to see what tasteful will look like in action?</nuxt-link
      >
    </footer> -->
  </div>
</template>

<script>
// @ is an alias to /src
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import masthead from '~/components/Masthead.vue'

export default {
  name: 'Index',
  components: {
    masthead,
    ChevronRightIcon
  },
  data () {
    return {
      username: '',
      email: '',
      password: '',
      mastheadText: 'The best online music community is almost ready for prime time.',
      isFullWidth: false,
      colourMode: 'light'
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/successful-preregistration')
      }
    }
  },
  mounted () {
    this.handleResize()
    this.colourMode = this.$store.state.theme.colourMode
  },
  methods: {
    onSignup () {
      const signup = () => {
        this.mastheadText = "Sit tight, we're signing you up 🥰"
        this.isFullWidth = true
        const details = {
          username: this.username,
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('signUpUser', details)
      }

      if (this.username.length >= 3 && this.password.length >= 3) {
        signup()
      } else {
        alert('Sorry, usernames and/or passwords must be longer than three characters.')
      }
    },
    handleResize () {
      if (document.body.clientWidth < 1000) {
        this.isFullWidth = true
      } else {
        this.isFullWidth = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
  padding-left: 3vw;
  padding-right: 3vw;
  transition: all 0.3s linear;
  &.dark {
    background: hsl(0, 0%, 7%);
  }
  &.sepia {
    background: hsl(16, 90%, 95%);
  }
  &.sepia-dark {
    background: hsl(16, 10%, 15%);
  }
}
main {
  display: flex;
  align-items: flex-start;
  width: 94vw;
}
.call-to-action-box {
  margin-left: auto;
  margin-right: 10vw;
  h2 {
    color: hsl(222, 88%, 15%);
    .dark {
      color: hsl(222, 88%, 75%);
    }
    font-size: 1rem;
    text-align: left;
    font-weight: 500;
  }

.email-input {
  padding: 5%;
  border-radius: 15px;
  width: 90%;
  margin-bottom: 15px;
  background: linear-gradient(
    103.68deg,
    hsl(255, 46%, 36%) 0.09%,
    hsl(255, 68%, 45%) 97.38%
  );
  #preregistration-email-input {
    color: hsl(222, 28%, 95%);
    background: none;
    font-size: 1rem;
    font-weight: 400;
    border: none;
    width: 90%;
    margin-left: 5px;
    &::placeholder {
      color: hsl(222, 40%, 95%);
    }
  }
}

.username-input {
    display: flex;
    padding: 5%;
    border-radius: 25px;
    width: 100%;
    background: linear-gradient(
      103.68deg,
      hsl(222, 46%, 36%) 0.09%,
      hsl(222, 68%, 45%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(222, 46%, 50%, 0.5);
    #at-sign {
      font-size: 1.3rem;
      font-weight: 500;
      color: hsl(222, 50%, 85%);
    }
    #preregistration-username-input {
      color: hsl(222, 28%, 95%);
      background: none;
      font-size: 1rem;
      font-weight: 400;
      border: none;
      width: 90%;
      margin-left: 5px;
      &::placeholder {
        color: hsl(222, 40%, 95%);
      }
    }
    #preregistration-submit-input {
      font-size: 24px;
      background: none;
      color: hsl(222, 50%, 85%);
      border: none;
      transition: 0.2s all linear;
      &:hover {
        color: hsl(222, 80%, 90%);
        font-size: 26px;
      }
    }
  }
}

.password-input {
  padding: 5%;
  border-radius: 15px;
  width: 90%;
  margin-bottom: 15px;
  background: linear-gradient(
    103.68deg,
    hsl(155, 46%, 36%) 0.09%,
    hsl(155, 68%, 45%) 97.38%
  );
  margin-top: 15px;
  #preregistration-password-input {
    color: hsl(222, 28%, 95%);
    background: none;
    font-size: 1rem;
    font-weight: 400;
    border: none;
    width: 90%;
    margin-left: 5px;
    &::placeholder {
      color: hsl(222, 40%, 95%);
    }
  }
}

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  margin-top: auto;
  height: 5%;
}

.masthead {
  margin-top: auto;
  margin-bottom: auto;
}

@media (max-width: 1000px) {
  .index {
    justify-content: center;
    padding: 0;
  }
  main {
    display: block;
    width: 80vw;
  }
  .call-to-action-box {
    margin: 0;
    margin-top: 10vh;
    width: 100%;
    h2 {
      text-align: center;
    }
    .call-to-action-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
  }
  #preregistration-input-box {
    display: flex;
    justify-content: center;
  }
}

.resize-observer {
  width: 0;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
