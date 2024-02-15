<template>
  <div
    class="p-space-sm px-lg-space-md py-lg-space-lg border"
    data-cy="portal-block-app-quick-facts"
  >
    <!-- time-to-apply -->
    <div
      class="mb-space-md mb-lg-space-lg"
      data-cy="portal-block-app-quick-facts-time-to-apply"
    >
      <div class="mb-space-xs">
        <img
          src="@/assets/img/clock.svg"
          alt="time to apply"
          class="img-fluid"
        />
      </div>
      <p class="text-large font-weight-bold mb-space-xxs">Time to apply</p>
      <p class="mb-0 text-small">
        Allow about
        <span class="font-weight-bold bg-secondary p-space-xxxs">
          30-60 minutes</span
        >
        to complete your application. You can save your application and come
        back later.
      </p>
    </div>

    <!-- application-fee -->
    <div
      class="mb-space-md mb-lg-space-lg"
      data-cy="portal-block-app-quick-facts-application-fee"
    >
      <div class="mb-space-xs">
        <img
          src="@/assets/img/credit-card.svg"
          alt="application fee"
          class="img-fluid"
        />
      </div>
      <p class="text-large font-weight-bold mb-space-xxs">Application fee</p>
      <p class="mb-0 text-small font-weight-bold">ASU Online: $70.00</p>
    </div>

    <!-- school-info -->
    <div
      class="mb-space-md mb-lg-space-lg"
      data-cy="portal-block-app-quick-facts-school-info"
    >
      <div class="mb-space-xs">
        <img
          src="@/assets/img/school.svg"
          alt="school info"
          class="img-fluid"
        />
      </div>
      <p class="text-large font-weight-bold mb-space-xxs">School info</p>
      <p class="mb-0 text-small">
        It will be handy to have your high school and previous college
        information available.
      </p>
    </div>

    <!-- help -->
    <div class="mb-lg-space-lg" data-cy="portal-block-app-quick-facts-help">
      <div class="mb-space-xs">
        <img src="@/assets/img/question.svg" alt="help" class="img-fluid" />
      </div>
      <p class="text-large font-weight-bold mb-space-xs">Help</p>
      <div class="d-flex align-items-start justify-content-start mb-space-xs">
        <p class="text-small font-weight-bold mr-space-xxs">Phone:</p>
        <div class="mt-n4">
          <a
            href="tel:+1-866-277-6589"
            class="text-small text-underline mb-space-xxs"
            @click.prevent="handleHelpPhoneClick"
          >
            866-277-6589
          </a>
          <p class="text-xs text-dark-1 mb-0">Call for immediate support.</p>
          <p class="text-xs text-dark-1 mb-0">
            Monday through Friday, 6 a.m. to 6 p.m. (Arizona time)
          </p>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-start">
        <p class="text-small font-weight-bold mr-space-xs">Email:</p>
        <div class="mt-n4">
          <a
            href="mailto:enrollmentonline@asu.edu"
            class="text-small text-underline mb-space-xxs"
            @click.prevent="handleHelpEmailClick"
          >
            enrollmentonline@asu.edu
          </a>
          <p class="text-xs text-dark-1 mb-0">
            Response within one to two business days.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PortalBlockAppQuickFacts",
  methods: {
    handleHelpEmailClick(event) {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "external link",
        region: "main content",
        section: "help ^ email",
        text: "enrollmentonline@asu.edu",
      });

      // open mail window
      window.location.href = event.target.href;
    },
    handleHelpPhoneClick(event) {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "external link",
        region: "main content",
        section: "help ^ phone",
        text: "866-277-6589",
      });

      // open phone window
      window.location.href = event.target.href;
    },
  },
};
</script>

<style lang="scss" scoped>
.mt-n4 {
  margin-top: -4px;
}
</style>
