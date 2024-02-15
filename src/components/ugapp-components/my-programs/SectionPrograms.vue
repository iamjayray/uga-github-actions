<template>
  <div>
    <!-- program section -->
    <section id="programs" data-cy="my-programs-program-filters">
      <div class="row">
        <div class="col-12">
          <h3 class="h3-large">
            {{
              programsSelected.length === 0 ||
              programsSelected[0]?.payloadData.priority === "2"
                ? "Search for a program"
                : "Search for additional program"
            }}
          </h3>
          <p class="text-small text-dark-2 my-space-xs">
            You can use a combination of keywords and filters.
          </p>
        </div>
        <!-- Search input -->
        <div class="col-12 col-lg-6">
          <div class="border d-flex h-100">
            <font-awesome-icon
              class="my-auto pl-space-sm"
              icon="fa-magnifying-glass"
              size="sm"
            ></font-awesome-icon>
            <b-form-input
              id="search_input"
              class="text-small border-0 p-space-xs"
              placeholder="Enter keywords"
              v-model.trim="searchValue"
              @blur="triggerSearchQueryGTM"
              data-cy="my-programs-filters-search-input"
            >
            </b-form-input>
          </div>
        </div>
        <!-- Interest area -->
        <div class="col-12 col-lg-3 my-space-xs my-lg-0">
          <base-combo-box
            id="interest_area_select"
            :options="interestAreaOptions"
            v-model="interestArea"
            @close="triggerInterestAreaChangeGTM()"
            placeHolder="Interest Area"
            data-cy="my-programs-filters-interest-area-select"
            uniqueId="interest_area_filter_select"
          />
        </div>
        <!-- College -->
        <div class="col-12 col-lg-3">
          <base-combo-box
            id="college_select"
            :options="collegeOptions"
            v-model="college"
            @close="triggerCollegeChangeGTM()"
            placeHolder="College"
            data-cy="my-programs-filters-college-select"
            uniqueId="college_filter_select"
          />
        </div>
        <!-- Selected filters and total number of programs-->
        <div class="col-12 mt-space-xs">
          <div
            class="mb-lg-space-xs d-none d-lg-flex flex-wrap"
            v-if="isClearFilterButtonsVisible"
            data-cy="my-programs-filters-clear-all-button"
          >
            <button
              class="btn btn-dark-1 d-flex mr-space-xs text-xs mb-space-xs"
              @click="handleClearAllFiltersClick"
            >
              <span>
                Clear All Filters (
                {{ interestArea.length + college.length }} )
              </span>
              <font-awesome-icon
                icon="fa-circle-xmark"
                class="fa-lg ml-space-xxs my-auto"
              />
            </button>
            <!-- interest area -->
            <template v-for="interest in interestArea">
              <button
                :key="interest.value"
                class="btn btn-white border-dark-1 d-flex text-xs mr-space-xs mb-space-xs"
                @click="handleRemoveInterestAreaFilter(interest)"
                data-cy="my-programs-filters-clear-selected-interest-button"
              >
                <span>
                  {{ interest.text }}
                </span>
                <font-awesome-icon
                  icon="fa-circle-xmark"
                  class="fa-lg ml-space-xxs my-auto text-light-4 bg-dark-1 rounded-circle"
                />
              </button>
            </template>
            <!-- college -->
            <template v-for="item in college">
              <button
                :key="item.value"
                class="btn btn-white border-dark-1 d-flex text-xs mr-space-xs mb-space-xs"
                @click="handleRemoveCollegeFilter(item)"
                data-cy="my-programs-filters-clear-selected-college-button"
              >
                <span>
                  {{ item.text }}
                </span>
                <font-awesome-icon
                  icon="fa-circle-xmark"
                  class="fa-lg ml-space-xxs my-auto text-light-4 bg-dark-1 rounded-circle"
                />
              </button>
            </template>
          </div>
          <p
            v-if="filteredPrograms?.length > 0"
            class="text-small"
            data-cy="my-programs-total-programs-length"
          >
            <span class="font-weight-bold">
              {{ filteredPrograms.length }}
              {{ filteredPrograms.length > 1 ? "programs" : "program" }}
              available
            </span>
            <span v-if="programsSelected.length > 0" class="ml-space-xxxs">
              {{
                programsSelected[0]?.payloadData.priority === "1"
                  ? "(without higher admission requirements)"
                  : "(without lower admission requirements)"
              }}
            </span>
          </p>
        </div>
        <div class="col-12" data-cy="my-programs-filtered-programs">
          <template
            v-for="program in filteredPrograms?.slice(0, currentPage * 10)"
          >
            <div
              :key="program.id"
              class="row py-space-sm py-lg-space-md border-bottom"
            >
              <div class="my-auto col-12 col-lg-7">
                <h3 class="h3-large">
                  <span>{{ program.title }}</span>
                </h3>
                <p class="mb-0 mt-space-xs text-dark-2">
                  {{ program.college }}
                </p>
              </div>
              <div
                class="col-12 col-lg-5 mt-space-xs my-lg-auto ml-lg-auto d-flex justify-content-lg-end"
              >
                <a
                  href="javascript:void(0)"
                  class="text-small text-underline mr-space-sm my-auto"
                  @click="handleViewDetailsClick(program)"
                  data-cy="my-programs-view-details-button"
                  >View details</a
                >
                <button
                  class="btn btn-dark-3 text-small my-auto ml-auto ml-lg-0"
                  @click="handleChooseProgramClick(program)"
                  data-cy="my-programs-choose-program-button"
                >
                  Choose this program
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
    <!-- Not finding what you’re looking for? -->
    <section data-cy="my-programs-contact-us-text">
      <div class="row">
        <div
          ref="intersection-observer"
          class="mt-space-lg mt-lg-space-xl col-12 d-lg-flex mb-space-md"
        >
          <p class="text-dark-2 font-weight-bold mb-space-xxs mb-lg-0">
            Can't find what you're looking for?
          </p>
          <a
            href="javascript:void(0)"
            v-b-toggle.need-help-sidebar
            @click="handleContactUsGtmTrigger"
            class="ml-lg-space-sm text-underline mb-space-sm"
            >Contact us for help.</a
          >
        </div>
      </div>
    </section>

    <!-- Need help sidebar -->
    <b-sidebar
      id="need-help-sidebar"
      aria-label="need help? contact us"
      shadow
      right
      backdrop
      backdrop-variant="light-2"
      bg-variant="white"
      no-header
      :no-header-close="true"
      header-class="p-0"
      data-cy="my-programs-need-help-sedebar"
    >
      <!-- content to place in body of the sidebar -->
      <template v-slot:default="{ hide }">
        <!-- header -->
        <div class="px-space-sm pt-space-md">
          <a
            href="javascript:void(0)"
            @click="handleExit(hide)"
            class="font-weight-bold mb-0 text-dark-3"
            data-cy="my-programs-need-help-sedebar-back-button"
            aria-label="close modal"
          >
            <font-awesome-icon
              icon="fa-arrow-left"
              class="mr-space-xs"
            ></font-awesome-icon>
            <span>Back</span>
          </a>
        </div>
        <!-- body -->
        <portal-form-need-help
          class="no-gutters px-space-md py-space-md px-lg-space-lg py-lg-space-lg"
        ></portal-form-need-help>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";
import { BFormInput, VBToggle, BSidebar } from "bootstrap-vue";
import BaseComboBox from "@/components/base-components/BaseComboBox.vue";
import PortalFormNeedHelp from "@/components/portal-components/PortalFormNeedHelp.vue";
import Fuse from "fuse.js";
export default {
  name: "SectionPrograms",
  directives: {
    "b-toggle": VBToggle,
  },
  props: {
    programsSelected: {
      type: Array,
      required: true,
    },
  },
  components: {
    "b-sidebar": BSidebar,
    "b-form-input": BFormInput,
    "base-combo-box": BaseComboBox,
    "portal-form-need-help": PortalFormNeedHelp,
  },
  data() {
    return {
      searchValue: null,
      interestArea: [],
      college: [],
      fuseInstance: null,
      interestAreaOptions: [],
      collegeOptions: [],
      filteredPrograms: null,
      fuseOptions: {
        keys: ["title", "interestAreas", "college"],
        isCaseSensitive: false,
        includeScore: true,
        useExtendedSearch: true,
        includeMatches: true,
        minMatchCharLength: 1,
        shouldSort: true,
        findAllMatches: true,
        location: 0,
        threshold: 0.4,
        distance: 200,
      },
      observer: null,
      currentPage: 1,
      totalPage: 0,
    };
  },
  watch: {
    searchValue() {
      this.searchPrograms();
    },
    interestArea() {
      this.searchPrograms();
    },
    college() {
      this.searchPrograms();
    },
    programsSelected: {
      handler() {
        this.handleClearAllFiltersClick();
        this.searchPrograms();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(useConfigStore, {
      configDegreePrograms: "degreePrograms",
    }),
    isClearFilterButtonsVisible() {
      return this.interestArea.length > 0 || this.college.length > 0;
    },
  },
  methods: {
    initFuse() {
      // create index for Fuse based on keys in fuseOptions on program collection
      const fuseIndex = Fuse.createIndex(
        this.fuseOptions.keys,
        this.configDegreePrograms
      );
      // initialise Fuse with the index
      this.fuseInstance = new Fuse(
        this.configDegreePrograms,
        this.fuseOptions,
        fuseIndex
      );
    },
    triggerSearchQueryGTM() {
      this.$track({
        event: "form",
        action: "click",
        name: "onclick",
        type: "click",
        region: "footer",
        section: "primary footer",
        text: this.searchValue ? this.searchValue.toLocaleLowerCase() : " ",
      });
    },
    triggerInterestAreaChangeGTM() {
      if (this.interestArea.length > 0) {
        this.$track({
          event: "select",
          action: "click",
          name: "onclick",
          type: "select interest area",
          region: "main content",
          section: "search for a program",
          text: this.interestArea
            .reduce((acc, curr) => {
              return acc + curr.text + ",";
            }, "")
            .toLocaleLowerCase(),
        });
      }
    },
    triggerCollegeChangeGTM() {
      if (this.college.length > 0) {
        this.$track({
          event: "select",
          action: "click",
          name: "onclick",
          type: "select college",
          region: "main content",
          section: "search for a program",
          text: this.college
            .reduce((acc, curr) => {
              return acc + curr.text + ",";
            }, "")
            .toLocaleLowerCase(),
        });
      }
    },
    searchPrograms() {
      const query = this.getSearchQuery();
      let programs = null;
      if (query.length > 0) {
        const searchResult = this.fuseInstance.search({
          $and: query,
        });
        programs = searchResult.map((course) => course.item);
      } else {
        // re-initialise the search results with all programs
        programs = this.configDegreePrograms.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
      }
      //  Checking if the one program is selected and removing that program
      if (this.programsSelected.length > 0) {
        this.filteredPrograms = programs.filter((item) => {
          if (this.programsSelected[0].payloadData.priority === "1") {
            return !(
              item.acadPlanCode === this.programsSelected[0].acadPlanCode ||
              item.applicantsMustChooseSecondMajor
            );
          } else {
            return !(
              item.acadPlanCode === this.programsSelected[0].acadPlanCode ||
              !item.applicantsMustChooseSecondMajor
            );
          }
        });
      } else {
        this.filteredPrograms = programs;
      }
      this.totalPage = Math.ceil(this.filteredPrograms?.length / 10);
      this.currentPage = 1;
    },
    getSearchQuery() {
      const searchQuery = [];

      if (this.searchValue) {
        searchQuery.push({ title: this.searchValue });
      }

      // set OR expression for interestArea
      if (this.interestArea.length > 0) {
        const interestAreaQuery = { $or: [] };

        this.interestArea.forEach((item) => {
          interestAreaQuery.$or.push({ interestAreas: `^${item.value}` });
        });

        searchQuery.push(interestAreaQuery);
      }

      // set OR expression for college
      if (this.college.length > 0) {
        const collegeQuery = { $or: [] };

        this.college.forEach((item) => {
          collegeQuery.$or.push({ college: `^${item.value}` });
        });

        searchQuery.push(collegeQuery);
      }
      return searchQuery;
    },
    async handleViewDetailsClick(program) {
      this.$emit("viewProgram", program);
    },
    async handleChooseProgramClick(program) {
      this.$emit("chooseProgram", program);
    },
    handleClearAllFiltersClick() {
      this.searchValue = "";
      this.interestArea = [];
      this.college = [];
    },
    handleRemoveInterestAreaFilter(item) {
      this.interestArea = this.interestArea.filter(
        (interest) => interest.value !== item.value
      );
    },
    handleRemoveCollegeFilter(item) {
      this.college = this.college.filter(
        (college) => college.value !== item.value
      );
    },
    handleContactUsGtmTrigger() {
      this.$track({
        event: "collapse",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "can't find what you're looking for?",
        text: "contact us for help",
      });
    },
    handleExit(hideScope) {
      if (hideScope) {
        // closes the sidebar
        hideScope();
      }
    },
  },
  created() {
    const colleges = [];
    const interestAreas = [];
    this.configDegreePrograms.forEach((program) => {
      // Getting the college options
      if (
        program.college &&
        colleges.findIndex((college) => college.value === program.college) < 0
      ) {
        colleges.push({
          text: program.college.replace(":", ""),
          value: program.college,
        });
      }

      // Getting the interestArea options
      program.interestAreas.forEach((interest) => {
        if (
          interestAreas.findIndex(
            (interestArea) => interestArea.value === interest
          ) < 0
        ) {
          interestAreas.push({
            text: interest.replace(":", ""),
            value: interest,
          });
        }
      });
    });
    this.collegeOptions = colleges.sort((a, b) => (a.text > b.text ? 1 : -1));
    this.interestAreaOptions = interestAreas.sort((a, b) =>
      a.text > b.text ? 1 : -1
    );

    this.searchPrograms();
  },
  mounted() {
    this.initFuse();

    //intersection Observer, infinite scroll for the displaying the program
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio > 0) {
        if (this.currentPage < this.totalPage) {
          this.currentPage += 1;
        }
      }
    });
    this.observer.observe(this.$refs["intersection-observer"]);
  },
  destroyed() {
    this.observer.disconnect();
  },
};
</script>

<style lang="scss" scoped></style>
