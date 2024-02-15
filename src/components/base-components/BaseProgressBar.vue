<template>
  <div class="container" data-cy="base-loader">
    <div class="row">
      <div class="col-12">
        <!-- Progress bar -->
        <b-progress
          id="progress_bar"
          class="mt-space-sm border rounded-pill"
          variant="primary"
          :value="value"
          animated
        ></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { BProgress } from "bootstrap-vue";
export default {
  name: "BaseProgressBar",
  components: {
    "b-progress": BProgress,
  },
  props: {
    value: {
      type: Number,
      default: 1,
    },
  },
};
</script>
<style lang="scss" scoped>
#progress_bar {
  width: 40vw;
  @media (max-width: 991px) {
    width: 80vw;
  }
}
</style>
