<template>
  <footer>
    <slot name="primary-section" />

    <!-- university-services-menu section -->
    <section
      class="bg-secondary text-dark-3"
      data-cy="default-footer-university-services-menu"
    >
      <div class="container">
        <div class="row">
          <div class="col">
            <div
              class="d-flex flex-column flex-lg-row align-items-center justify-content-end"
            >
              <nav
                class="nav grid-flex-menu order-2 order-lg-1 mb-space-sm mb-lg-0"
              >
                <a
                  v-for="(item, index) in secondaryNavItems"
                  :key="index"
                  :href="item.uri"
                  :target="formatLinkTarget(item.target)"
                  class="nav-link text-dark-3 menu-item font-weight-bold py-space-xxs py-lg-0"
                  rel="noopener noreferrer"
                >
                  {{ item.text }}
                </a>
              </nav>
              <b-img-lazy
                src="https://live-asuocms.ws.asu.edu/sites/default/files/2023-10/ASU%202024%20Innovation%20RGB%20for%20Digital%20Lockup%20wide%20on%20gold.png"
                alt="Number one in the U.S. for innovation. #1 ASU, #2 Stanford, #3 MIT. - U.S. News and World Report, 9 years, 2016-2024"
                class="order-1 order-lg-2 innovation-image"
              ></b-img-lazy>
              <slot name="secondary-menu" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- university-legal-compliance-menu section -->
    <section
      class="bg-light-2 py-space-xs"
      data-cy="default-footer-university-legal-compliance-menu"
    >
      <div class="container">
        <div class="row">
          <div class="col">
            <nav
              class="nav grid-flex-menu order-2 order-lg-1"
              aria-label="University Legal and Compliance"
            >
              <a
                v-for="(item, index) in tertiaryItems"
                :key="index"
                :href="item.uri"
                :target="formatLinkTarget(item.target)"
                @click="handleTertiaryMenuLinkClick(item)"
                class="nav-link text-dark-3 menu-item py-space-xxs py-lg-0"
                rel="noopener noreferrer"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </footer>
</template>

<script>
import { BImgLazy } from "bootstrap-vue";

export default {
  name: "BaseFooter",
  props: {
    displayApplyNow: {
      type: Boolean,
      default: false,
    },
    displayRfiCta: {
      type: Boolean,
      default: false,
    },
    useCustomContent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      secondaryNavItems: [
        {
          text: "Maps and Locations",
          uri: "https://www.asu.edu/map/interactive/",
          target: "BLNK",
        },
        {
          text: "Jobs",
          uri: "https://www.asu.edu/asujobs",
          target: "BLNK",
        },
        {
          text: "Directory",
          uri: "https://isearch.asu.edu/asu-people/",
          target: "BLNK",
        },
        {
          text: "Contact ASU",
          uri: "https://www.asu.edu/contactasu/",
          target: "BLNK",
        },
        {
          text: "My ASU",
          uri: "https://my.asu.edu/",
          target: "BLNK",
        },
      ],
      tertiaryItems: [
        {
          text: "Copyright and Trademark",
          uri: "https://www.asu.edu/copyright/",
          target: "BLNK",
        },
        {
          text: "Accessibility",
          uri: "https://www.asu.edu/accessibility/",
          target: "BLNK",
        },
        {
          text: "Privacy",
          uri: "https://www.asu.edu/privacy/",
          target: "BLNK",
        },
        {
          text: "Terms of Use",
          uri: "https://www.asu.edu/tou/",
          target: "BLNK",
        },
        {
          text: "Emergency",
          uri: "https://www.asu.edu/emergency/",
          target: "BLNK",
        },
      ],
    };
  },
  components: {
    "b-img-lazy": BImgLazy,
  },
  methods: {
    formatLinkTarget(target) {
      if (target == "SELF") {
        return "_self";
      } else {
        return "_blank";
      }
    },
    handleTertiaryMenuLinkClick(item) {
      const trackingData = {
        event: "link",
        name: "onclick",
        action: "click",
        type: "internal link",
        region: "footer",
        section: "tertiary footer",
        text: item.text.toLowerCase(),
        component: "footer - innovation",
      };

      this.$emit("tertiaryMenuLinkClick", trackingData);
    },
  },
};
</script>

<style lang="scss" scoped>
nav.grid-flex-menu {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-auto-flow: column;
  justify-items: start;
  flex-wrap: wrap;
  width: 100%;
}

img.innovation-image {
  width: 100%;
  height: auto;
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  img.innovation-image {
    height: 100px;
    width: auto;
  }
  nav.grid-flex-menu {
    display: flex;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
  }
  a.menu-item:hover {
    text-decoration: underline;
  }
}
</style>
