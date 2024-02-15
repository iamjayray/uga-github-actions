<template>
  <div class="col-12" data-cy="my-schools-name-on-transcript-select">
    <b-form-group
      :data-cy="`my-schools-group_${id}_transcript_name`"
      :id="`group_${id}_transcript_name`"
      :aria-label="title"
      label-class="pb-0"
      class="mb-0 mt-space-xs mt-lg-space-sm mr-lg-gutter position-relative"
    >
      <template #label>
        <label for="school_transcript_name" class="mb-space-xs mb-lg-space-sm">
          <h3 class="h3-medium">
            {{ title }}
          </h3>
        </label>
      </template>
      <div class="row">
        <div class="col-8 col-lg-4">
          <base-select
            :id="`${id}_transcript_name`"
            :options="nameOptions"
            v-model="$v.name.$model"
            :onErrorMsg="selectErrorMsg($v.name)"
            class="px-0 position-relative"
            @change="handleNameChange"
          ></base-select>
        </div>
        <div class="col-4 col-lg-8 d-flex">
          <a
            href="javascript:void(0)"
            class="text-xs text-primary font-weight-bold my-auto text-underline"
            @click="handleEditMyProfileClick"
            data-cy="my-schools-name-on-transcript-edit-name-link"
          >
            <font-awesome-icon icon="fa-pencil" size="xs" />
            <span class="ml-space-xxs">Edit my profile</span></a
          >
        </div>
      </div>
    </b-form-group>
    <!-- add/edit former name -->
    <b-modal
      ref="former-name-add-or-edit-modal"
      v-model="isModalVisible"
      centered
      hide-header
      hide-footer
      body-class="p-0"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
    >
      <div
        class="model-content p-space-md"
        data-cy="former-name-add-or-edit-modal"
      >
        <!-- row: cancel button -->
        <div class="row model-close-button position-absolute">
          <div class="col-12" data-cy="my-schools-cancel-button">
            <a
              href="javascript:void(0)"
              @click="handleModalClose"
              class="d-flex flex-row justify-content-end align-items-center pt-space-md pr-space-md"
              aria-label="close modal"
            >
              <font-awesome-icon
                icon="xmark"
                class="text-light-5"
                size="2x"
              ></font-awesome-icon>
            </a>
          </div>
        </div>
        <!-- row: content -->
        <div class="row mt-space-md">
          <div class="col-12" data-cy="my-schools-content">
            <div>
              <!-- First name -->
              <b-form-group
                data-cy="my-schools-group_former_first_name"
                id="group_former_first_name"
                aria-label="First name"
                label-class="pb-0"
                class="mb-space-sm position-relative"
              >
                <template #label>
                  <label
                    for="former_first_name_input"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-medium">First name</h3>
                  </label>
                </template>
                <b-form-input
                  id="former_first_name_input"
                  class="text-dark-1 text-large"
                  placeholder="Enter your text"
                  v-model.trim="$v.formerName.firstName.$model"
                  :state="
                    $v.formerName.firstName.$dirty
                      ? !$v.formerName.firstName.$error
                      : null
                  "
                >
                </b-form-input>
                <template
                  v-for="error in nameErrorMsg(
                    $v.formerName.firstName,
                    'first name'
                  )"
                >
                  <b-form-invalid-feedback :key="`first_name_${error}`">
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    {{ error }}
                  </b-form-invalid-feedback>
                </template>
              </b-form-group>
              <!-- Last name -->
              <b-form-group
                data-cy="my-schools-group_former_last_name"
                id="group_former_last_name"
                aria-label="Last name"
                label-class="pb-0"
                class="mb-space-sm position-relative"
              >
                <template #label>
                  <label
                    for="former_first_name_input"
                    class="mb-space-xs mb-lg-space-sm"
                  >
                    <h3 class="h3-medium">Last name</h3>
                  </label>
                </template>
                <b-form-input
                  id="former_last_name_input"
                  class="text-dark-1 text-large"
                  placeholder="Enter your text"
                  v-model.trim="$v.formerName.lastName.$model"
                  :state="
                    $v.formerName.lastName.$dirty
                      ? !$v.formerName.lastName.$error
                      : null
                  "
                >
                </b-form-input>
                <template
                  v-for="error in nameErrorMsg(
                    $v.formerName.lastName,
                    'last name'
                  )"
                >
                  <b-form-invalid-feedback :key="`last_name_${error}`">
                    <font-awesome-icon
                      icon="fa-sharp fa-regular fa-circle-exclamation"
                      size="xs"
                    />
                    {{ error }}
                  </b-form-invalid-feedback>
                </template>
              </b-form-group>
            </div>

            <hr class="my-space-sm" />
            <div
              class="d-flex justify-content-end"
              data-cy="my-schools-cancel-and-save-buttons"
            >
              <button
                class="btn btn-white p-0 text-dark-1"
                id="cancle_button"
                @click="handleModalClose"
              >
                Cancel
              </button>
              <button
                id="save_button"
                @click="handleModalSaveClick"
                class="ml-space-md btn btn-primary text-white px-space-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BModal,
} from "bootstrap-vue";
import { required, requiredIf, maxLength } from "vuelidate/lib/validators";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { validationMixin } from "vuelidate";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { EnumPageNames } from "@/content/enum-app.js";
import { mapActions, mapState } from "pinia";
export default {
  name: "NameOnTranscriptSelect",
  mixins: [validationMixin],
  components: {
    "base-select": BaseSelect,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
    "b-modal": BModal,
  },
  props: {
    value: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  watch: {
    applicationformerNames: {
      handler() {
        this.populateNameOptions();
      },
      deep: true,
    },
  },
  data() {
    return {
      nameOptions: [],
      name: null,
      isModalVisible: false,
      isFormerNameEditing: false,
      formerName: { firstName: null, lastName: null, nameType: "former" },
    };
  },
  validations: {
    name: {
      required,
    },
    formerName: {
      firstName: {
        required: requiredIf(function () {
          return this.isModalVisible;
        }),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
        duplicateFormerName: function () {
          return !this.isModalVisible || !this.isDuplicateFormerNameEntered;
        },
        maxLength: maxLength(25),
      },
      lastName: {
        required: requiredIf(function () {
          return this.isModalVisible;
        }),
        validName: function (value) {
          return /^[a-zA-Z-]+( [a-zA-Z-]+)*$/.test(value);
        },
        duplicateFormerName: function () {
          return !this.isModalVisible || !this.isDuplicateFormerNameEntered;
        },
        maxLength: maxLength(30),
      },
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUgApplicationStore, {
      applicationformerNames: "formerNames",
    }),
    ...mapState(useUserStore, {
      userLegalName: "legalName",
    }),
    isDuplicateFormerNameEntered() {
      return this.nameOptions.some(
        (item) =>
          item.firstName === this.formerName.firstName &&
          item.lastName === this.formerName.lastName &&
          (!this.isFormerNameEditing || item.id !== this.name.id)
      );
    },
  },
  methods: {
    ...mapActions(useUgApplicationStore, {
      addApplicationFormerName: "addApplicationFormerName",
      patchApplicationFormerName: "patchApplicationFormerName",
    }),
    handleNameChange() {
      if (this.name?.value !== "oth") {
        this.$emit("input", this.name);
      } else {
        this.isModalVisible = true;
      }
    },
    handleModalClose() {
      this.isModalVisible = false;
      this.isFormerNameEditing = false;
      this.resetFormerName();
      if (this.name?.value === "oth") {
        this.name = null;
        this.$emit("input", this.name);
      }
    },
    async handleModalSaveClick() {
      this.$v.formerName.$touch();
      if (this.$v.formerName.$anyError) {
        return;
      }
      const appId = this.$route.params.id;
      const payload = [];
      let updatedName = null;
      // adding new former name
      if (!this.isFormerNameEditing) {
        payload.push(this.formerName);
        const response = await this.addApplicationFormerName(
          this.authToken,
          appId,
          payload
        );
        if (response.code === 201) {
          const data = response.data.filter(
            (item) =>
              item.firstName === this.formerName.firstName &&
              item.lastName === this.formerName.lastName
          );
          updatedName = data.length > 0 ? data[0] : null;
        } else {
          this.triggerErrorGtm(response.code, response.errors);
        }
      } else if (
        this.formerName.firstName !== this.name.firstName ||
        this.formerName.lastName !== this.name.lastName
      ) {
        const response = await this.patchApplicationFormerName(
          this.authToken,
          appId,
          this.formerName,
          this.name.value
        );
        if (response.code === 200) {
          updatedName = response.data;
        } else {
          this.triggerErrorGtm(response.code, response.errors);
        }
      }
      if (updatedName) {
        this.populateNameOptions();
        this.name = {
          ...updatedName,
          text: `${updatedName.firstName} ${updatedName.lastName}`,
          value: updatedName.id,
        };
      }
      this.isModalVisible = false;
      this.isFormerNameEditing = false;
      this.resetFormerName();
      this.$emit("input", this.name);
    },
    populateNameOptions() {
      const options = [];
      options.push({
        ...this.userLegalName,
        text: `${this.userLegalName.firstName} ${this.userLegalName.lastName}`,
        value: this.userLegalName.id,
      });
      this.applicationformerNames.forEach((name) => {
        options.push({
          ...name,
          text: `${name.firstName} ${name.lastName}`,
          value: name.id,
        });
      });
      // if formername count is less then 10 showing the other option so that user can add new name
      if (this.applicationformerNames.length < 10) {
        options.push({ text: "Other", value: "oth" });
      }
      this.nameOptions = options;
    },
    selectErrorMsg(error) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      }
      return errMsg;
    },
    handleEditMyProfileClick() {
      if (this.name.nameType === "legal") {
        this.$router.push({
          name: EnumPageNames.PageProfile,
        });
      } else {
        this.formerName.firstName = this.name.firstName;
        this.formerName.lastName = this.name.lastName;
        this.isFormerNameEditing = true;
        this.isModalVisible = true;
      }
    },
    resetFormerName() {
      this.$v.formerName.$reset();
      this.formerName = {
        firstName: null,
        lastName: null,
        nameType: "former",
      };
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "my_schools",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors.toString(),
      });
    },
    nameErrorMsg(error, nameType) {
      const errMsg = [];
      if (error.$dirty && !error.required) {
        errMsg.push("This is a required field.");
      } else if (error.$dirty && !error.validName) {
        errMsg.push(
          "The " + nameType + " can only contain letters and hyphens (-).`"
        );
      } else if (error.$dirty && !error.duplicateFormerName) {
        errMsg.push("Name already exists enter a different name.");
      } else if (error.$dirty && !error.maxLength) {
        const maxLength = nameType === "first name" ? "25" : "30";
        errMsg.push(
          "The " +
            nameType +
            " should not be more than " +
            maxLength +
            " characters."
        );
      }
      return errMsg;
    },
  },
  created() {
    this.populateNameOptions();
  },
  mounted() {
    let nameValue = [];
    if (this.value) {
      nameValue = this.nameOptions.filter((name) => name.id === this.value.id);
    }
    if (nameValue.length > 0) {
      this.name = nameValue[0];
    } else {
      this.name = {
        ...this.userLegalName,
        text: `${this.userLegalName.firstName} ${this.userLegalName.lastName}`,
        value: this.userLegalName.id,
      };
    }
    this.$emit("input", this.name);
  },
};
</script>

<style lang="scss" scoped>
.model-close-button {
  right: 0px;
  top: 0px;
}
.model-content {
  border-bottom: 8px solid var(--secondary);
}
</style>
