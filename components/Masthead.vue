<template>
  <div :class="[{ smaller, fitWidth, fullWidth }, colourMode]" class="masthead">
    <h1 :class="{ centred }" class="masthead-content">
      <slot>Masthead content</slot>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Masthead',
  props: {
    centred: Boolean,
    smaller: Boolean,
    fullWidth: Boolean,
    fitWidth: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.getters.colourMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.masthead {
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 100px;
  max-width: 40vw;
  transition: all 0.2s linear;

  &.light {
    background: linear-gradient(
      103.68deg,
      hsl(252, 46%, 36%) 0.09%,
      hsl(252, 67%, 45%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(252, 67%, 45%, 0.5);
  }
  &.dark {
    background: linear-gradient(
      103.68deg,
      hsl(252, 46%, 26%) 0.09%,
      hsl(252, 67%, 35%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(252, 67%, 45%, 0.2);
  }
  &.sepia {
    background: linear-gradient(
      103.68deg,
      hsl(17, 47%, 76%) 0.09%,
      hsl(17, 67%, 75%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(39, 68%, 15%, 0.5);
    .masthead-content {
      color: hsl(35, 20%, 24%);
    }
  }
  &.sepia-dark {
    background: linear-gradient(
      103.68deg,
      hsl(17, 27%, 56%) 0.09%,
      hsl(17, 47%, 55%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(39, 68%, 15%, 0.5);
    .masthead-content {
      color: hsl(35, 20%, 94%);
    }
  }
}

.masthead-content {
  color: hsla(253, 100%, 94%);
  font-size: 1.8rem;
  font-weight: 900;
  text-align: left;
  margin-left: 5%;
  margin-right: 5%;
  line-height: 2rem;
}
.centred {
  text-align: center;
}
.smaller {
  padding: 5px;
}
.fitWidth {
  padding-left: 5%;
  padding-right: 5%;
  width: fit-content;
  white-space: nowrap;
}
.fullWidth {
  max-width: 50vw;
}
@media (max-width: 1000px) {
  .masthead {
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .masthead-content {
    font-size: 1.5rem;
    line-height: 1.6rem;
    text-align: center;
  }
  .fullWidth {
    max-width: 100vw;
  }
}
</style>
