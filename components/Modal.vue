<template>
  <div :class="colourMode" class="modal-container">
    <div :class="[{greenBackground}, colourMode]" class="modal">
      <div id="modal-content-left" class="modal-content">
        <close-icon :class="colourMode" class="large-close-icon" title="Close" @click="closeModal" />
        <div :class="[{scrollable}]">
          <slot name="left" />
        </div>
      </div>
      <div id="modal-content-right" class="modal-content" :class="[{scrollable}]">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close.vue'

export default {
  name: 'Modal',
  components: {
    CloseIcon
  },
  props: {
    scrollable: Boolean,
    greenBackground: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  methods: {
    closeModal () {
      this.$emit('closeModal')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal-container {
  background: hsla(0, 0%, 80%, 0.9);
  width: 100vw;
  height: 100vh;
  transition: all 0.2s linear;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 997;
  display: flex;
  justify-content: center;
  align-items: center;
  &.dark {
    background: hsla(0, 0%, 10%, 0.9);
  }
}

.modal {
  background: hsl(0, 0%, 100%);
  box-shadow: 0px 0px 50px hsl(0, 0%, 95%);
  width: 50vw;
  min-height: 50vh;
  max-height: 80vh;
  border-radius: 50px;
  transition: all 0.2s linear;
  display: flex;
  padding-bottom: 20px;
  &:before {
    position: absolute;
    transform: translateY(-10px);
    z-index: -1;
    content: " ";
    background: linear-gradient(270deg, #f14f4f, #5f40dd);
    width: 50vw;
    height: 50vh;
    border-radius: 50px;
    transition: all 0.2s linear;
  }
  &.dark {
    background: hsl(0, 0%, 10%);
    box-shadow: 0px 0px 20px hsl(0, 0%, 12%);
  }
  &.greenBackground {
    background: $green-gradient;
    background-size: 400% 400%;
    animation: GradientAnimation 2s ease infinite;
  }
}

.modal-content {
  height: 100%;
  padding-left: 5%;
  padding-top: 5%;
}

#modal-content-left {
  width: 40%;
  padding-top: calc(5% - 12px);
}

#modal-content-right {
  width: 60%;
  overflow: auto;
  max-height: 60%;
  margin-right: 30px;
}

.subheading-content {
  margin-top: 0;
}

.large-close-icon {
  width: 24px;
  height: 24px;
  svg {
    color: hsl(222, 5%, 20%);
    width: 24px;
    height: 24px;
    &:hover {
      cursor: pointer;
    }
  }
  &.dark {
    svg {
      color: hsl(222, 10%, 55%);
    }
  }
}

.scrollable {
  overflow-y: auto;
}

@media (max-width: 1000px) {
  .modal {
    width: 90vw;
    &:before {
      width: 90vw;
    }
  }
  .modal-content {
    padding-left: 0;
  }
  #modal-content-left {
    position: relative;
    width: 0%;
    z-index: 5;
    margin-top: 20px;
    left: 20px;
    .subheading, .paragraph {
      display: none;
    }
    &.scrollable {
      overflow-y: auto;
    }
  }
  #modal-content-right {
    overflow: none;
    width: 100%;
    text-align: center;
    margin-left: 10px;
    margin-right: 10px;
    .text-input-container {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
    &.scrollable {
      overflow-y: auto;
    }
  }
}

@keyframes GradientAnimation {
  0%{background-position:82% 0%}
  50%{background-position:19% 100%}
  100%{background-position:82% 0%}
}

</style>
