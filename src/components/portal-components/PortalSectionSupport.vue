<template>
  <section class="py-space-xxl bg-light-1">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="h2-small mb-space-xs">Need help? Contact us.</h2>
          <p class="text-dark-2 mb-space-md">
            We're here to assist you every step of the way.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-3">
          <div class="d-flex align-items-start justify-content-start">
            <div class="mr-space-xs">
              <img
                src="@/assets/img/app-enrollment-support.svg"
                alt="login"
                class="img-fluid"
                style="height: 32px; width: 32px"
              />
            </div>
            <div>
              <p class="font-weight-bold">Enrollment support</p>
              <a
                href="tel:+1-866-277-6589"
                class="text-underline mb-space-xxs"
                @click.prevent="handleEnrollmentSupportPhone"
              >
                866-277-6589
              </a>
              <p class="text-dark-2 mb-0">Call for immediate support.</p>
              <p class="text-dark-2 mb-space-sm">
                Monday through Friday, 6 a.m. to 6 p.m. (Arizona time)
              </p>
              <a
                href="mailto:enrollmentonline@asu.edu"
                class="text-underline"
                @click.prevent="handleEnrollmentSupportEmail"
              >
                enrollmentonline@asu.edu
              </a>
              <p class="text-dark-2 mb-space-sm">
                Response within one to two business days
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-3">
          <div class="d-flex align-items-start justify-content-start">
            <div class="mr-space-xs">
              <img
                src="@/assets/img/app-technical-support.svg"
                alt="login"
                class="img-fluid"
                style="height: 32px; width: 32px"
              />
            </div>
            <div>
              <p class="font-weight-bold">Technical support</p>
              <a
                href="tel:+1-855-278-5080"
                class="text-underline mb-space-xxs"
                @click.prevent="handleTechnicalSupportPhone"
              >
                855-278-5080
              </a>
              <p class="text-dark-2 mb-space-sm">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PortalSectionSupport",
  methods: {
    handleEnrollmentSupportPhone(event) {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "external link",
        region: "main content",
        section: "need help? contact us.",
        text: event.target.innerText,
        component: "enrollment support",
      });

      // open phone window
      window.location.href = event.target.href;
    },
    handleEnrollmentSupportEmail(event) {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "external link",
        region: "main content",
        section: "need help? contact us.",
        text: event.target.innerText,
        component: "enrollment support",
      });

      // open mail window
      window.location.href = event.target.href;
    },
    handleTechnicalSupportPhone(event) {
      // fire data layer event
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "external link",
        region: "main content",
        section: "need help? contact us.",
        text: event.target.innerText,
        component: "technical support",
      });

      // open phone window
      window.location.href = event.target.href;
    },
  },
};
</script>

<style lang="scss" scoped></style>
