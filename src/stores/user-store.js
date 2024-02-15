import ugApplicationApi from "@/api/ug-application-api";
import ugGenderApi from "@/api/ug-gender-api.js";
import ugNameApi from "@/api/ug-name-api.js";
import ugPronounApi from "@/api/ug-pronoun-api.js";
import userApi from "@/api/user-api.js";
import ugPhoneApi from "@/api/ug-phone-api.js";
import ugSarApi from "@/api/ug-sar-api.js";
import { defineStore } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store";
import AcceptedVisaTypes from "@/content/valid-visa-types.json";
import jwt_decode from "jwt-decode";
import * as _ from "lodash";

import {
  EnumNameTypes,
  EnumSarCodes,
  EnumAzResidency,
} from "@/content/enum-ug-application.js";
export const useUserStore = defineStore({
  id: "user",
  persist: true,
  state: () => ({
    userType: EnumNameTypes.UserTypeSelf, // By default setting the usertype to self
    userId: null,
    asuId: null,
    adminEmail: null,
    adminName: null,
    email: null,
    names: [],
    preferredFirstName: null,
    dateOfBirth: null, // format: YYYY-MM-DD, dataType: String
    attendedASU: null,
    firstGeneration: null,
    pronouns: [],
    genders: [],
    phones: [],
    sex: null,
    birthCountry: null,
    citizenCountry: null,
    visaCode: null,
    ssn: null,
    isUsCitizen: null,
    primaryLanguageAtHome: null,
    primaryLanguageAtHomeOther: null,
    receiveInfoBySMS: null,
  }),
  getters: {
    legalName() {
      const result = this.names.filter((item) => item.nameType === "legal");

      return result.length > 0 ? result[0] : null;
    },
    legalNameId() {
      return this.legalName ? this.legalName.id : null;
    },
    legalFirstName() {
      return this.legalName ? this.legalName.firstName : null;
    },
    legalMiddleName() {
      return this.legalName ? this.legalName.middleName : null;
    },
    legalLastName() {
      return this.legalName ? this.legalName.lastName : null;
    },
    legalSuffix() {
      return this.legalName ? this.legalName.suffix : null;
    },
    legalFullName() {
      let result = "";

      if (this.legalFirstName) {
        result += this.legalFirstName;
      }

      if (this.legalMiddleName) {
        result += ` ${this.legalMiddleName}`;
      }

      if (this.legalLastName) {
        result += ` ${this.legalLastName}`;
      }

      if (this.legalSuffix) {
        result += ` ${this.legalSuffix}`;
      }

      return result !== "" ? result : "N/A";
    },
    formattedFullName() {
      let result = "";

      if (this.preferredFirstName) {
        result += this.preferredFirstName;
      } else if (this.legalFirstName) {
        result += this.legalFirstName;
      }

      if (this.legalLastName) {
        result += ` ${this.legalLastName}`;
      }

      return result !== "" ? result : "N/A";
    },
    formattedFirstName() {
      return this.preferredFirstName
        ? this.preferredFirstName
        : this.legalFirstName;
    },
    dobMonth(state) {
      return state.dateOfBirth ? state.dateOfBirth.substring(5, 7) : null;
    },
    dobDay(state) {
      return state.dateOfBirth ? state.dateOfBirth.substring(8, 10) : null;
    },
    dobYear(state) {
      return state.dateOfBirth
        ? parseInt(state.dateOfBirth.substring(0, 4))
        : null;
    },
    formattedDob() {
      let result = "N/A";
      if (this.dateOfBirth) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        result = `${monthNames[parseInt(this.dobMonth) - 1]} ${this.dobDay}, ${
          this.dobYear
        }`;
      }

      return result;
    },
    userAge(state) {
      const today = new Date();
      const birthDate = new Date(state.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();

      // Check if the birthday for this year has passed
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      } else if (
        today.getMonth() === birthDate.getMonth() &&
        today.getDate() === birthDate.getDate()
      ) {
        // Check if the birthday is today, compare the time
        const todayTime = today.getHours() * 60 + today.getMinutes();
        const birthDateTime =
          birthDate.getHours() * 60 + birthDate.getMinutes();
        if (todayTime < birthDateTime) {
          age--;
        }
      }

      return age;
    },
    isValidVisaType(state) {
      return (
        AcceptedVisaTypes.some((item) => item.value === state.visaCode) ||
        state.citizenCountry === EnumAzResidency.usCountryCode
      );
    },
    phone(state) {
      return (phoneType) => {
        const phone = state.phones.filter(
          (phone) => phone.phoneType === phoneType
        );
        return phone.length > 0 ? phone[0] : null;
      };
    },
  },
  actions: {
    populateUserId(id) {
      this.userId = id;
    },
    populateAsuId(id) {
      this.asuId = id;
    },
    async updateAsuId(token, appId, id) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            asuID: id,
          }
        );
        if (data.code === 200) {
          this.asuId = id;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    populateEmail(email) {
      this.email = email;
    },
    populateUserType(type) {
      this.userType = type;
    },
    // names
    async populateNames(token, applicationId) {
      try {
        const { data } = await ugNameApi.fetchAllApplicationName(
          token,
          applicationId
        );

        if (data.code === 200) {
          this.names = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async updateLegalName(token, applicationId, nameId, payloadData) {
      try {
        payloadData["nameType"] = "legal";
        const { data } = await ugNameApi.updateApplicationName(
          token,
          applicationId,
          nameId,
          payloadData
        );
        if (data.code === 200) {
          const index = this.names.findIndex((item) => item.id === nameId);

          if (index !== -1) {
            this.names[index] = data.data;
          }
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // preferredFirstName
    populatePreferredFirstName(preferredFirstName) {
      this.preferredFirstName = preferredFirstName;
    },
    async updatePreferredFirstName(token, applicationId, payloadData) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          applicationId,
          payloadData
        );
        if (data.code === 200) {
          this.preferredFirstName = data.data.preferredFirstName;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // dateOfBirth
    populateDateOfBirth(dob) {
      this.dateOfBirth = dob;
    },
    async updateDateOfBirth(token, applicationId, payloadData) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          applicationId,
          payloadData
        );

        if (data.code === 200) {
          this.populateDateOfBirth(data.data.dateOfBirth);
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // birthCountry
    populateBirthCountry(country) {
      this.birthCountry = country;
    },
    async updateBirthCountry(token, appId, country) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            birthCountry: country,
          }
        );
        if (data.code === 200) {
          this.birthCountry = country;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    // citizenCountry
    populateCitizenCountry(country) {
      this.citizenCountry = country;
    },
    async updateCitizenCountry(token, appId, country) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            citizenCountry: country,
          }
        );
        if (data.code === 200) {
          this.citizenCountry = country;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // visaCode
    populateVisaCode(visaCode) {
      this.visaCode = visaCode;
    },
    async updateVisaCode(token, appId, code) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            visaCode: code ? code : null,
          }
        );
        if (data.code === 200) {
          this.visaCode = code;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    // attendedAsu
    populateAttendedAsu(attended) {
      this.attendedASU = attended;
    },
    // firstGeneration
    populateFirstGeneration(generation) {
      this.firstGeneration = generation;
    },
    // pronouns
    async populatePronouns(token, applicationId) {
      try {
        const { data } = await ugPronounApi.fetchApplicationPronouns(
          token,
          applicationId
        );

        if (data.code === 200) {
          this.pronouns = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    async addPronouns(token, applicationId, pronoun) {
      try {
        const { data } = await ugPronounApi.createApplicationPronoun(
          token,
          applicationId,
          pronoun
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async updatePronouns(token, applicationId, pronoun) {
      try {
        const { data } = await ugPronounApi.updateApplicationPronoun(
          token,
          applicationId,
          pronoun
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async deletePronoun(token, applicationId, pronounId) {
      try {
        const { data } = await ugPronounApi.deleteApplicationPronoun(
          token,
          applicationId,
          pronounId
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    // genders
    async populateGenders(token, applicationId) {
      try {
        const { data } = await ugGenderApi.fetchApplicationGender(
          token,
          applicationId
        );

        if (data.code === 200) {
          this.genders = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    async addGenders(token, applicationId, genders) {
      try {
        const { data } = await ugGenderApi.createApplicationGender(
          token,
          applicationId,
          genders
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    async updateGenders(token, applicationId, genders) {
      try {
        const { data } = await ugGenderApi.updateApplicationGender(
          token,
          applicationId,
          genders
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    async deleteGender(token, applicationId, genderId) {
      try {
        const { data } = await ugGenderApi.deleteApplicationGender(
          token,
          applicationId,
          genderId
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    // sex
    populateSex(sex) {
      this.sex = sex;
    },
    async updateUserSex(token, appId, legalSex) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            sex: legalSex,
          }
        );
        if (data.code === 200) {
          this.sex = legalSex;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    // primaryLanguageAtHome
    populatePrimaryLanguageAtHome(language) {
      try {
        this.primaryLanguageAtHome = language;
      } catch (error) {
        return error;
      }
    },

    async updatePrimaryLanguageAtHome(token, appId, language) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            primaryLanguageAtHome: language,
          }
        );
        if (data.code === 200) {
          this.primaryLanguageAtHome = language;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // primaryLanguageAtHomeOther
    populatePrimaryLanguageAtHomeOther(language) {
      this.primaryLanguageAtHomeOther = language;
    },
    async updatePrimaryLanguageAtHomeOther(token, appId, language) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            primaryLanguageAtHomeOther: language,
          }
        );
        if (data.code === 200) {
          this.primaryLanguageAtHomeOther = language;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // SSN
    populateSocialSecurityNumber(ssn) {
      this.ssn = ssn;
    },
    async updateSocialSecurityNumber(token, appId, ssn) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          {
            ssn: ssn,
          }
        );
        if (data.code === 200) {
          this.ssn = data.data.ssn;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },

    // user CRUD
    async createAccount(email, password) {
      try {
        const { data } = await userApi.signUp(email, password);

        if (data.code === 201) {
          this.email = email;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async resendVerificationEmail(email) {
      try {
        const { data } = await userApi.resendCode(email);

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async forgotPassword(email) {
      try {
        const { data } = await userApi.forgotPassword(email);
        // set state.email attribute
        this.email = data.data.email;

        return data;
      } catch (error) {
        return error.response?.data;
      }
    },
    async resetPassword(code, email, password) {
      try {
        const { data } = await userApi.resetPassword(code, email, password);

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    populateAdminInfo(token) {
      const decoded = jwt_decode(token);
      this.adminEmail = `${decoded.sub}@asu.edu`;
      this.adminName = decoded.sub;
    },
    async updateUserInfo(token, appId, payload) {
      try {
        const { data } = await ugApplicationApi.updateApplicationUserInfo(
          token,
          appId,
          payload
        );
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async populateUserPhones(token, appId) {
      try {
        const { data } = await ugPhoneApi.fetchAllApplicationPhone(
          token,
          appId
        );
        if (data.code === 200) {
          this.phones = data.data;
        }

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async addUserPhone(token, appId, payload) {
      try {
        const { data } = await ugPhoneApi.createApplicationPhone(
          token,
          appId,
          payload
        );
        if (data.code === 201) {
          this.phones.push(data.data);
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async patchUserPhone(token, appId, phoneId, payload) {
      try {
        const { data } = await ugPhoneApi.updateApplicationPhone(
          token,
          appId,
          phoneId,
          payload
        );
        if (data.code === 200) {
          const index = this.phones.findIndex(
            (phone) => phone.phoneType === payload.phoneType
          );
          this.phones[index] = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async removeUserPhone(token, appId, phoneId) {
      try {
        const { data } = await ugPhoneApi.deleteApplicationPhone(
          token,
          appId,
          phoneId
        );
        if (data.code === 200) {
          this.phones = this.phones.filter((item) => item.phoneId !== phoneId);
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    async populateReceiveInfoBySMS(token, appId) {
      const ugApplicationStore = useUgApplicationStore();
      const sarResponse = ugApplicationStore.sarAnswers.filter(
        (item) => item.name === EnumSarCodes.profileSar.receiveInfoViaSmsSarCode
      );

      this.receiveInfoBySMS =
        sarResponse.length > 0 ? sarResponse[0].answer : null;
    },
    async submitPhoneDetails(token, appId, phoneDetails) {
      let responses = [];
      const phoneDatas = phoneDetails.map((item) => {
        return {
          areaCode: item.areaCode,
          phoneNumber: item.phoneNumber,
          phoneType: item.phoneType,
          countryCode: item.countryCode,
        };
      });
      await Promise.all(
        phoneDatas.map(async (element) => {
          const phone = this.phones.filter(
            (phone) => phone.phoneType === element.phoneType
          );
          if (phone.length > 0) {
            element.phoneId = phone[0].phoneId;
            if (!_.isEqual(phone[0], element)) {
              let response = null;
              if (_.isEmpty(element.phoneNumber)) {
                response = await this.removeUserPhone(
                  token,
                  appId,
                  phone[0].phoneId
                );
              } else {
                delete element.phoneId;
                response = await this.patchUserPhone(
                  token,
                  appId,
                  phone[0].phoneId,
                  element
                );
              }
              responses.push(response);
            }
          } else if (!_.isEmpty(element.phoneNumber)) {
            const response = await this.addUserPhone(token, appId, element);
            responses.push(response);
          }
        })
      );
      responses = responses.filter(
        (response) => response.code !== 200 && response.code !== 201
      );
      if (responses.length > 0) {
        return {
          ...responses[0],
          section: "User phone number",
        };
      } else {
        return {
          code: 200,
          message: "success",
          section: "User phone number",
        };
      }
      return responses;
    },
    async submitReceiveInfoBySMS(token, appId, receiveInfoBySMSValue) {
      try {
        let response = { code: 200 };
        // if there is no change returning the response as 200
        if (this.receiveInfoBySMS === receiveInfoBySMSValue) {
          return response;
        }
        if (!this.receiveInfoBySMS) {
          response = await ugSarApi.createApplicationSarQuestionResponse(
            token,
            appId,
            EnumSarCodes.profileSar.receiveInfoViaSmsSarCode,
            { answer: receiveInfoBySMSValue }
          );
        } else {
          response = await ugSarApi.updateApplicationSarQuestionResponse(
            token,
            appId,
            EnumSarCodes.profileSar.receiveInfoViaSmsSarCode,
            { answer: receiveInfoBySMSValue }
          );
        }
        if (response.data.code === 200 || response.data.code === 201) {
          this.receiveInfoBySMS = response.data.data.answer;
        }
        return response.data;
      } catch (error) {
        return error.response.data;
      }
    },
  },
});
