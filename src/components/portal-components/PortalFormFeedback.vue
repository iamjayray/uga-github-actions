<template>
  <div data-cy="portal-form-feedback">
    <p class="font-weight-bold text-small mb-space-md pb-space-xxxs">
      <span class="px-space-xxs py-space-xxxs bg-secondary"> Feedback </span>
    </p>
    <p class="font-weight-bold mb-space-sm">
      Please rate your experience with the ASU Application.
    </p>
    <b-form
      id="feedback-form"
      data-cy="feedback-form"
      novalidate
      @submit.stop.prevent="handleFeedbackSubmit"
    >
      <b-form-group
        id="rating_group"
        aria-label="rating group"
        class="position-relative"
        data-cy="rating-group"
      >
        <div class="b-rating-input d-flex justify-content-center">
          <span class="text-xs text-dark-1 mr-space-xs my-auto"> Poor </span>

          <b-form-rating
            aria-label="rating"
            size="lg"
            :no-border="true"
            :inline="true"
            :icon-empty="ratingIconType"
            v-model="form.rating"
            :class="{
              invalid: $v.form.rating.$dirty && $v.form.rating.$invalid,
            }"
          ></b-form-rating>

          <span class="text-xs text-dark-1 ml-space-xs my-auto">
            Excellent
          </span>
        </div>
        <b-form-invalid-feedback
          :force-show="$v.form.rating.$dirty && !$v.form.rating.required"
        >
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
      <hr class="my-space-md py-space-xxxs" />
      <p class="font-weight-bold">Please tell us more about your experience.</p>
      <b-form-group
        id="feedback_group"
        aria-label="feedback group"
        class="position-relative mb-space-md"
        data-cy="feedback-group"
      >
        <b-form-textarea
          id="feedback_textarea"
          v-model="form.feedback"
          placeholder="Your feedback will help us improve the experience for future applicants."
          rows="5"
          class="text-xs p-space-xxs text-dark-1"
          :state="$v.form.feedback.$dirty ? !$v.form.feedback.$error : null"
        ></b-form-textarea>
        <b-form-invalid-feedback>
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="d-flex flex-row justify-content-end align-items-center">
        <a
          href="javascript:void(0)"
          @click="handleCancelClick"
          class="btn bg-white text-dark-1 mr-space-sm text-small"
          id="cancel_button"
        >
          Cancel
        </a>

        <button
          :disabled="isSubmitting"
          type="submit"
          class="text-small btn btn-secondary"
          id="submit_button"
        >
          {{ submitText }}
        </button>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "@/services/axiosService.js";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import {
  BForm,
  BFormGroup,
  BFormRating,
  BFormTextarea,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import { useUserStore } from "@/stores/user-store.js";
import { mapState } from "pinia";
export default {
  name: "PortalFormFeedback",
  mixins: [validationMixin],
  components: {
    "b-form": BForm,
    "b-form-group": BFormGroup,
    "b-form-rating": BFormRating,
    "b-form-textarea": BFormTextarea,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  data() {
    return {
      form: {
        rating: null,
        feedback: null,
      },
      submitText: "Submit feedback",
      isSubmitting: false,
    };
  },
  validations: {
    form: {
      rating: {
        required,
      },
      feedback: {
        required,
      },
    },
  },
  computed: {
    ...mapState(useUserStore, {
      userEmail: "email",
    }),
    ratingIconType() {
      if (this.$v.form.rating.$dirty && this.$v.form.rating.$invalid) {
        return "star";
      } else {
        return "star-fill";
      }
    },
  },
  methods: {
    handleCancelClick() {
      this.$emit("cancel");
    },
    async handleFeedbackSubmit() {
      this.$v.form.$touch();

      if (!this.$v.form.$anyError) {
        this.submitText = "Submitting...";
        this.isSubmitting = true;

        // Sanitizing the feedback input
        const feedback = this.form.feedback.replace(
          /(<([^>]+)>|\r\n|\r\n\t|\n|\r|\t)/gm,
          ""
        );
        const formData = new FormData();
        formData.append("feedback", feedback);
        formData.append("rating", this.form.rating);
        formData.append("email", this.userEmail);
        formData.append("source_url", window.location.href);

        const { status } = await axios.post(
          import.meta.env.VITE_API_FEEDBACK_FORM_URL,
          formData
        );

        if (status != 200) {
          // fire data layer event
        }

        this.isSubmitting = false;
        this.$emit("form-submit");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
