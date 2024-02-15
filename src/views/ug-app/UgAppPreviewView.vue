<template>
  <main id="main-content" data-cy="preview-up-app-preview-view">
    <div class="container mb-space-xl mt-space-sm">
      <!-- section heading and back button -->
      <section data-cy="preview-heading-and-back-button">
        <div class="row">
          <div class="col-12">
            <a
              v-if="userType === EnumNameTypes.UserTypeSelf"
              href="javascript:void(0)"
              class="text-dark-3 font-weight-bold text-decoration-none pb-space-xxxs"
              @click="handleBackButtonClick"
            >
              <font-awesome-icon
                icon="fa-arrow-left"
                class="mr-space-xxs pr-space-xxxs"
              ></font-awesome-icon>
              <span>Back</span>
            </a>
            <h1 class="h1-medium mt-space-sm">
              <span class="bg-secondary pr-space-xxxs">{{
                pageData.title
              }}</span>
            </h1>
          </div>
        </div>
      </section>
      <!-- END -->

      <hr class="mt-space-md mb-space-lg" />

      <!-- Application details -->
      <section data-cy="preview-application-details">
        <div class="row">
          <div class="col-12">
            <div class="px-gutter px-lg-0 mb-space-md mb-lg-space-lg">
              <div class="row">
                <div class="col-12 col-lg-6">
                  <h3 class="h3-large mb-space-xs mb-lg-space-sm">
                    <span>Application ID : </span>
                    <span> {{ appId }}</span>
                  </h3>
                  <p class="text-medium text-dark-2">
                    <span>Submitted on </span><span>{{ submitDate }}</span>
                  </p>
                </div>
                <div class="col-12 col-lg-6 text-lg-right">
                  <button
                    @click="generatePDF"
                    class="btn btn-primary text-small py-space-xxs px-space-xs"
                  >
                    <font-awesome-icon
                      icon="fa-download"
                      class="mr-space-xxs"
                    ></font-awesome-icon>
                    <span>Download as PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- My profile -->
            <section-details-collapse
              data-cy="preview-my-profile"
              :compData="applicationMyProfileDetails"
              collapseId="my-profile-page-contents"
            ></section-details-collapse>
            <!-- My information -->
            <section-details-collapse
              data-cy="preview-my-information"
              :compData="applicationMyInformationDetails"
              collapseId="my-information-page-contents"
              bgVariant="white"
            ></section-details-collapse>
            <!-- My programs -->
            <section-details-collapse
              data-cy="preview-my-programs"
              :compData="applicationMyProgramsDetails"
              collapseId="my-programs-page-contents"
            ></section-details-collapse>
            <!-- My schools -->
            <section-details-collapse
              data-cy="preview-my-schools"
              :compData="applicationMySchoolsDetails"
              collapseId="my-schools-page-contents"
              bgVariant="white"
            ></section-details-collapse>
            <!-- highSchoolGrades -->
            <section-details-collapse
              data-cy="preview-my-high-school-grades"
              v-if="!isObjectEmpty(applicationMyHighSchoolGradesDetails.data)"
              :compData="applicationMyHighSchoolGradesDetails"
              collapseId="my-high-school-grades-page-contents"
            ></section-details-collapse>

            <!-- AZ residency -->
            <section-details-collapse
              data-cy="preview-arizona-residency"
              v-if="!isObjectEmpty(applicationMyArizonaResidencyDetails.data)"
              :compData="applicationMyArizonaResidencyDetails"
              collapseId="arizona-residency-page-contents"
              bgVariant="white"
            ></section-details-collapse>
          </div>
        </div>
        <template v-if="isArizonaCollegeConsentSectionVisible">
          <hr class="my-space-md my-lg-space-lg" />

          <!-- Arizona community college transcript consent -->
          <section>
            <div class="row">
              <div class="col-12">
                <h3
                  class="h3-large mb-space-sm mb-lg-space-md pb-lg-space-xxxs"
                >
                  {{ pageData.azCommunityCollegeConsent.title }}
                </h3>
                <a
                  href="#az_community_college_consent"
                  class="text-underline font-weight-bold text-large"
                  v-b-toggle
                  @click.prevent
                >
                  <span>Read consent</span>
                  <font-awesome-icon
                    icon="fa-chevron-down"
                    class="ml-space-xxs consent-icon"
                    size="xs"
                  ></font-awesome-icon>
                </a>

                <b-collapse
                  id="az_community_college_consent"
                  class="mt-space-sm"
                >
                  <section>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="h3-medium mb-space-xs">
                          {{ pageData.azCommunityCollegeConsent.subTitle }}
                        </h3>
                        <p class="text-large mb-space-md">
                          {{ pageData.azCommunityCollegeConsent.text }}
                        </p>
                        <!-- authoization items -->
                        <ul class="text-large pl-space-sm mb-space-md">
                          <template
                            v-for="item in pageData.azCommunityCollegeConsent
                              .authorizationItems"
                          >
                            <li
                              :key="item"
                              v-html="item"
                              class="mb-space-xs"
                            ></li>
                          </template>
                        </ul>
                        <p class="text-large mb-0">
                          {{ pageData.azCommunityCollegeConsent.subText }}
                        </p>
                      </div>
                    </div>
                  </section>
                </b-collapse>
                <!-- Consent -->
                <b-form-group
                  id="group_az_community_college_consent"
                  aria-label="form arizona community college transcript consent"
                  label-class="pb-0"
                  class="twox-checkbox mb-0 position-relative col-lg-10 px-0 mt-space-xs"
                  data-cy="preview-az-community-college-consent"
                >
                  <b-form-checkbox
                    id="az_community_college_consent_checkbox"
                    name="Authorization"
                    disabled
                    v-model="form.azCollegeTranscriptConsent"
                    value="Y"
                    :unchecked-value="null"
                    class="font-weight-bold text-large mt-0"
                    aria-describedby="input-live-help input-live-feedback"
                  >
                    <span>Authorization</span>
                  </b-form-checkbox>
                </b-form-group>
                <!-- END -->
              </div>
            </div>
          </section>
          <!-- END -->
        </template>
      </section>
      <!-- END -->

      <hr class="mt-space-md mb-space-lg" />

      <!-- Application Affidavit -->
      <section data-cy="preview-application-affidavit">
        <div class="row">
          <div class="col-12">
            <h3 class="h3-large mb-space-sm mb-lg-space-md">
              {{ pageData.applicationAffidavit.title }}
            </h3>
            <a
              href="#application_affidavit"
              class="text-underline font-weight-bold text-large"
              v-b-toggle
              @click.prevent
            >
              <span>Read affidavit</span>
              <font-awesome-icon
                icon="fa-chevron-down"
                class="ml-space-xxs affidavit-icon"
                size="xs"
              ></font-awesome-icon>
            </a>
            <b-collapse id="application_affidavit" class="mt-space-sm">
              <p class="mb-space-sm">
                {{ pageData.applicationAffidavit.text }}
              </p>
              <!-- Submitting Official Transcripts (For Degree-Seeking Students) -->
              <div
                class="mb-space-sm"
                data-cy="preview-submitting-official-transcripts"
              >
                <h3 class="h3-medium mb-space-xxs pb-space-xxxs">
                  {{ pageData.applicationAffidavit.officialTranscripts.title }}
                </h3>
                <p class="mb-0">
                  {{ pageData.applicationAffidavit.officialTranscripts.text }}
                </p>
              </div>
              <!-- Academic Integrity -->
              <div class="mb-space-sm" data-cy="preview-academic-integrity">
                <h3 class="h3-medium mb-space-xxs pb-space-xxxs">
                  {{ pageData.applicationAffidavit.academicInterity.title }}
                </h3>
                <p class="mb-0">
                  {{ pageData.applicationAffidavit.academicInterity.text }}
                </p>
              </div>
              <!-- Prohibition Against Discrimination, Harassment and Retaliation -->
              <div
                data-cy="preview-prohibition-against-discrimination-harassment-and-retaliation"
              >
                <h3 class="h3-medium mb-space-xxs pb-space-xxxs">
                  {{
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.title
                  }}
                </h3>
                <div
                  class="mb-space-sm"
                  v-html="
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.text
                  "
                ></div>
                <!-- contacts -->
                <template
                  v-for="contact in pageData.applicationAffidavit
                    .prohibitionAgainstDescrimination.contacts"
                >
                  <p :key="contact.title" class="mb-space-xxs">
                    <span class="font-weight-bold mr-space-xxxs">{{
                      contact.title
                    }}</span>
                    <span>{{ contact.text }}</span>
                  </p>
                </template>
                <a
                  :href="
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.cta.link
                  "
                  :target="
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.cta.target
                  "
                  class="text-underline font-weight-bold"
                  >{{
                    pageData.applicationAffidavit
                      .prohibitionAgainstDescrimination.cta.label
                  }}</a
                >
                <p class="mt-space-sm mb-0">
                  {{ pageData.applicationAffidavit.subText }}
                </p>
              </div>
            </b-collapse>
            <!-- Acknowledgement -->
            <b-form-group
              data-cy="preview-group_acknowledgement"
              id="group_acknowledgement"
              aria-label="form acknowledgement"
              label-class="pb-0"
              class="twox-checkbox mb-0 position-relative col-lg-10 px-0 mt-space-xs"
            >
              <b-form-checkbox
                id="acknowledgement_checkbox"
                name="receive_info_vie_sms_checkbox"
                disabled
                v-model="acknowledgement"
                value="Yes"
                :unchecked-value="null"
                class="font-weight-bold text-large text-dark-3"
                aria-describedby="input-live-help input-live-feedback"
              >
                <span
                  >I, {{ legalFullName }}, certify that all information is
                  correct and complete and I agree to the terms of this
                  affidavit.
                </span>
              </b-form-checkbox>
            </b-form-group>
          </div>
        </div>
      </section>
      <!-- END -->
      <hr class="mt-space-md mb-space-lg" />

      <!-- Return to previous page button -->
      <a
        v-if="userType === EnumNameTypes.UserTypeSelf"
        data-cy="preview-return-to-previous-page-button"
        href="javascript:void(0)"
        class="btn btn-primary text-small py-space-xxs px-space-xs"
        @click="handleBackButtonClick"
      >
        Return to previous page
      </a>
    </div>
  </main>
</template>

<script>
import pageData from "@/content/preview.json";
import { useAppStore } from "@/stores/app-store.js";
import { EnumPageNames } from "@/content/enum-app.js";
import { BFormGroup, BFormCheckbox, BCollapse, VBToggle } from "bootstrap-vue";
import { useUserStore } from "@/stores/user-store.js";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { mapState, mapActions } from "pinia";
import { ASUColors } from "@/content/enum-ug-application.js";
import SectionDetailsCollapse from "@/components/ugapp-components/preview/SectionDetailsCollapse.vue";
import {
  EnumStringConstants,
  EnumNameTypes,
} from "@/content/enum-ug-application";
import { isEmpty } from "radash";
export default {
  name: "UgAppPreviewView",
  metaInfo() {
    return {
      title: `Preview | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  components: {
    "b-form-group": BFormGroup,
    "b-form-checkbox": BFormCheckbox,
    "b-collapse": BCollapse,
    "section-details-collapse": SectionDetailsCollapse,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      EnumNameTypes: EnumNameTypes,
      pageData: pageData,
      appId: null,
      azCommunityCollegeConsentPdfData: {
        data: null,
        title: null,
      },
      isArizonaCollegeConsentSectionVisible: false,
      form: {
        azCollegeTranscriptConsent: null,
      },
      acknowledgement: "Yes",
    };
  },

  computed: {
    ...mapState(useUserStore, {
      legalFullName: "legalFullName",
      userType: "userType",
    }),
    ...mapState(useUgApplicationStore, {
      applicationMyProfileDetails: "myProfileDetails",
      applicationMyInformationDetails: "myInformationDetails",
      applicationMyProgramsDetails: "myProgramsDetails",
      applicationMySchoolsDetails: "mySchoolsDetails",
      applicationMyHighSchoolGradesDetails: "myHighSchoolGradesDetails",
      applicationMyArizonaResidencyDetails: "myArizonaResidencyDetails",
      applicationOtherInstitutions: "otherInstitutions",
      applicationReviewSar: "reviewSar",
    }),
    ...mapState(useAppStore, {
      selectedUndergradApplication: "selectedUndergradApplication",
      submitDate: "formattedSubmissionDate",
    }),
  },
  methods: {
    ...mapActions(useConfigStore, {
      configPopulateInstitutions: "populateInstitutions",
    }),
    ...mapActions(useAppStore, {
      resetProgressBarRequests: "resetProgressBarRequests",
    }),
    generatePDF() {
      const pdf = {
        colors: ASUColors,
        user: {
          legalFullName: this.legalFullName,
          appId: this.appId,
          appSubmitDate: this.submitDate,
        },
        profile: this.applicationMyProfileDetails,
        myInformation: this.applicationMyInformationDetails,
        myProgram: this.applicationMyProgramsDetails,
        mySchools: this.applicationMySchoolsDetails,
        myHighSchoolGrades: this.applicationMyHighSchoolGradesDetails,
        arizonaResidency: this.applicationMyArizonaResidencyDetails,
        azCommunityCollegeConsent: this.azCommunityCollegeConsentPdfData,
        affidavit: this.pageData.applicationAffidavit.pdfBody,
      };

      // Create a worker instance to generate the PDF
      const pdfWorker = new Worker("/pdfMakeServiceWorker.js");

      pdfWorker.addEventListener("message", (event) => {
        const pdfBlob = event.data.blob;
        const downloadLink = URL.createObjectURL(pdfBlob);

        // Create a timestamped filename
        const timestamp = new Date().toISOString();
        const filename = `${this.appId}-${timestamp}.pdf`;

        // Trigger the download
        const a = document.createElement("a");
        a.href = downloadLink;
        a.download = filename;
        a.click();

        // Clean up
        URL.revokeObjectURL(downloadLink);
        pdfWorker.terminate();
      });

      pdfWorker.postMessage(pdf);
    },
    handleBackButtonClick() {
      this.$router.push({
        name: EnumPageNames.PageUndergradDashboard,
        params: { id: this.appId },
      });
    },
    isObjectEmpty(object) {
      return isEmpty(object);
    },
  },
  async created() {
    this.appId = this.$route.params.id;
    // populating the sar questions from state
    this.form.azCollegeTranscriptConsent =
      this.applicationReviewSar.azCollegeTranscriptConsent;
    // populating the arizona community institutions
    let params = `schoolTypeCode=2YR&countryCode=USA&stateCode=AZ`;
    const response = await this.configPopulateInstitutions(params);
    // checking if the arizona college consent should be displayed
    if (response.code === 200) {
      this.applicationOtherInstitutions.forEach((item) => {
        if (
          response.data.some((ele) => ele.externalOrgId === item.extOrgId) &&
          item.degreeCode === EnumStringConstants.NONE
        ) {
          this.isArizonaCollegeConsentSectionVisible = true;
        }
      });
    } else {
      this.$track({
        event: "app_error",
        action: "preview",
        location: this.$router.currentRoute.fullPath,
        code: response.code,
        message: response.errors.toString(),
      });
    }
    // updating the azCommunityCollegeConsentPdfData
    this.azCommunityCollegeConsentPdfData.title =
      this.pageData.azCommunityCollegeConsent.pdfBody.title;
    if (this.isArizonaCollegeConsentSectionVisible) {
      this.azCommunityCollegeConsentPdfData.data =
        this.pageData.azCommunityCollegeConsent.pdfBody.data;
    }
    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
};
</script>
