import { invert, keys, flat, crush } from "radash";
import azResidencyContent from "@/content/arizona-residency.json";
import * as _ from "lodash";

export const prepareAndPrefillDynamicContent = (text) => {
  return text
    .replace(/%current_year%/g, new Date().getFullYear())
    .replace(/%current_year-1%/g, new Date().getFullYear() - 1)
    .replace(/%current_year-2%/g, new Date().getFullYear() - 2);
};
export const removeEmptyNullValues = (obj) => {
  // Recursively check all properties of the object
  Object.keys(obj).forEach((key) => {
    // If the property is null or undefined, delete it
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      // If the property is an object, recursively call the function on it
      removeEmptyNullValues(obj[key]);
    }
  });

  // Return the object
  return obj;
};

export const getAnswersFromApi = (psMapping, answers) => {
  const mapping = invert(psMapping);
  const apiResp = {};
  answers.forEach((item) => {
    if (mapping[item.key]) {
      apiResp[mapping[item.key]] = item.answer;
    } else {
      apiResp[item.key] = item.answer;
    }
  });
  return apiResp;
};

export const findState = (state, states) => {
  return states.find((item) => item.value === state) ?? null;
};

export const findContentOptions = (section, component, answer) => {
  const content = azResidencyContent[section][component];
  return content.options.find((item) => item.value === answer) ?? null;
};

// todo merge the data extractPsKeys and prepareResidencyQuestionMapping
export const extractPsKeys = () => {
  const content = Object.keys(azResidencyContent);
  const mapping = {
    sectionFinancialSupport: {},
  };
  content.forEach((item) => {
    if (item !== "sectionFinancialSupport") {
      const component = {};
      Object.entries(azResidencyContent[item]).forEach(([key, value]) => {
        if (value.psKey) {
          component[key] = value.psKey;
          mapping[item] = component;
        }
      });
    }
  });
  const sectionFinancialSupport = azResidencyContent.sectionFinancialSupport;
  sectionFinancialSupport.source.forEach((item) => {
    mapping.sectionFinancialSupport[item.value] = item.psKey;
  });
  sectionFinancialSupport.otherOptions.source.forEach((item) => {
    mapping.sectionFinancialSupport[item.value] = item.psKey;
  });
  mapping.sectionFinancialSupport.inputOtherSourceNota =
    sectionFinancialSupport.otherOptions.inputOtherSourceNota.psKey;
  return mapping;
};

export const generateFormattedSarAnswers = (state, formData, enumSar) => {
  const formattedArray = [];
  const sarKeys = keys(enumSar);
  sarKeys.map((key) => {
    const oldValue = _.get(state, key);
    const formValue = _.get(formData, key);
    const newValue =
      formValue && typeof formValue === "object" ? formValue.value : formValue;
    if (oldValue !== newValue) {
      const sarObject = {
        code: _.get(enumSar, key),
        httpRequest: "post",
        payload: {
          answer: newValue,
        },
        path: key,
      };
      if (oldValue && newValue) {
        sarObject.httpRequest = "patch";
      } else if (oldValue && !newValue) {
        sarObject.httpRequest = "delete";
      }
      // [{
      //   code:"SAR-1",
      //   httpRequest:"post",
      //   payload:{
      //     answer:"Yes"
      //   },
      // }]
      formattedArray.push(sarObject);
    }
  });
  return formattedArray;
};

export const generateFormattedAddress = (address) => {
  const formattedAddress = {
    type: address.type,
    countryCode: address.countryCode.countryCode,
    street1: address.street1,
    street2: address.street2,
    city: address.city,
    stateProvince:
      typeof address.stateProvince === "object"
        ? address.stateProvince.stateCode
        : address.stateProvince,
    postalCode: address.postalCode,
  };
  if (address.addressId) {
    formattedAddress.addressId = address.addressId;
  }
  return formattedAddress;
};

export const generatePreviewResidencyId = (value) => {
  let id = value;
  const string = value.replace(/[^a-z]/gi, "");
  if (string) {
    string.split("").forEach((element) => {
      const value = element.toLowerCase().charCodeAt(0) - 97 + 1;
      id = id.replace(element, `.${value}`);
    });
  }
  return id;
};
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export const prepareResidencyQuestionMapping = (configAzResidencyQuestions) => {
  const configAzResidencyQuestionsMapping = {};
  configAzResidencyQuestions.forEach((item) => {
    configAzResidencyQuestionsMapping[item.resQuestionKey] =
      generatePreviewResidencyId(item.rsQuestionNumber);
  });
  const content = Object.keys(azResidencyContent);
  const mapping = {};
  content.forEach((item) => {
    if (item !== "sectionFinancialSupport") {
      Object.values(azResidencyContent[item]).forEach((value) => {
        if (value.psKey) {
          mapping[value.psKey] = {
            text: prepareAndPrefillDynamicContent(value.label),
            questionId: configAzResidencyQuestionsMapping[value.psKey],
          };
        }
      });
    }
  });
  const sectionFinancialSupport = azResidencyContent.sectionFinancialSupport;
  sectionFinancialSupport.source.forEach((item) => {
    mapping[item.psKey] = {
      text: item.label,
      questionId: configAzResidencyQuestionsMapping[item.psKey],
    };
  });
  sectionFinancialSupport.otherOptions.source.forEach((item) => {
    mapping[item.psKey] = {
      text: item.label,
      questionId: configAzResidencyQuestionsMapping[item.psKey],
    };
  });
  const inputOtherSourceNota =
    sectionFinancialSupport.otherOptions.inputOtherSourceNota;
  mapping[inputOtherSourceNota.psKey] = {
    text: inputOtherSourceNota.label,
    questionId: configAzResidencyQuestionsMapping[inputOtherSourceNota.psKey],
  };
  return mapping;
};

export const generateInstitutionDetail = (
  institute,
  names,
  monthOptions,
  degreeAwardedOptions
) => {
  const data = {
    instituteName: institute.name,
    nameOnTranscript: null,
    location: `${institute.city}, ${institute.stateProvince}, ${institute.countryCode}`,
    degree: null,
    concentration: institute.concentration,
    startDate: null,
    endDate: null,
  };
  // degree
  const degreeAwarded = degreeAwardedOptions.filter(
    (item) => item.value === institute.degreeCode
  );
  data.degree = degreeAwarded.length > 0 ? degreeAwarded[0].text : null;
  // start date
  const startMonth = getMonthDetail(monthOptions, institute.firstAttendedMonth);
  data.startDate = `${startMonth.text}, ${institute.firstAttendedYear}`;
  // end date
  const endMonth = getMonthDetail(monthOptions, institute.lastAttendedMonth);
  data.endDate = `${endMonth.text}, ${institute.lastAttendedYear}`;
  // name on transcript
  const name = names.filter((item) => item.id === institute.transcriptNameId);
  data.nameOnTranscript =
    name.length > 0 ? `${name[0].firstName} ${name[0].lastName}` : null;
  return data;
};

export const generateSchoolDetail = (school, names, monthOptions) => {
  const data = {
    schoolName: school.name,
    nameOnTranscript: null,
    location: `${school.city}, ${school.state}, ${school.country}`,
    graduationDate: null,
    startDate: null,
    endDate: null,
  };

  if (school.gradMonth && school.gradYear) {
    // graduation date
    const graduationMonth = getMonthDetail(monthOptions, school.gradMonth);
    data.graduationDate = `${graduationMonth.text}, ${school.gradYear}`;
  } else {
    // start date
    const startMonth = getMonthDetail(monthOptions, school.startMonth);
    data.startDate = `${startMonth.text}, ${school.startYear}`;
    // end date
    const endMonth = getMonthDetail(monthOptions, school.endMonth);
    data.endDate = `${endMonth.text}, ${school.endYear}`;
  }
  // name on transcript
  const name = names.filter((item) => item.id === school.transcriptNameId);
  data.nameOnTranscript =
    name.length > 0 ? `${name[0].firstName} ${name[0].lastName}` : null;
  return data;
};

export const getMonthDetail = (monthOptions, monthValue) => {
  const month = monthOptions.filter(
    (item) => parseInt(item.value) === parseInt(monthValue)
  );
  return month.length > 0 ? month[0] : null;
};

export const generateProgramDetail = (program, configStore) => {
  try {
    const programDetails = configStore.degreePrograms.filter(
      (item) =>
        item.acadPlanCode === program.plan &&
        item.subPlanCode === program.subplan
    );
    const termDetail = configStore.terms[program.term];

    if (programDetails.length > 0) {
      const data = {
        title: programDetails[0].title,
        location: program.campus === "ONLNE" ? "ASU Online" : null,
      };
      // Start date
      data.term = termDetail ? termDetail.description : null;
      if (program.session === "SESA") {
        data.term = `${data.term} - (Session A)`;
      } else if (program.session === "SESB") {
        data.term = `${data.term} - (Session B)`;
      }
      return data;
    }
    return null;
  } catch (error) {
    return error;
  }
};

export const generateFormattedCourseWorks = (course) => {
  const formattedArray = [];
  course.forEach((element) => {
    if (element.type) {
      const data = {
        subjectId: element.subject,
        courseLevelId: element.courseLevel.id,
        academicYearId: element.academicYear.id,
        courseTitleAlternateText: element.customeCourseName,
        courseId: element.courseName ? element.courseName.id : null,
        termTypeId: element.duration.id,
        grades: [],
      };

      Object.keys(element.grades).forEach((key, index) => {
        data.grades.push({
          gradeId: element.grades[key].id,
          termOrderNumber: `${index + 1}`,
        });
      });
      formattedArray.push({
        type: element.type,
        id: element.highSchoolCourseworkId
          ? element.highSchoolCourseworkId
          : null,
        payload: data,
      });
    }
  });
  return formattedArray;
};

export const generateFormattedProgramOfInterest = (programs) => {
  const formattedArray = programs.map((item) => {
    return {
      priority: item.priority,
      programCode: item.program,
      planCode: item.plan,
      location: item.campus,
      term: item.term,
      session: item.session,
      subPlanCode: item.subplan,
    };
  });
  return formattedArray;
};
export const generateFormattedDate = (month, day, year) => {
  return `${year}-${month}-${day}`;
  // YYYY-MM-DD
};

export const generateSingleLineAddress = (address, country, state) => {
  let data =
    address?.street1 + " " + address?.street2 + "</br>" + address?.city + ",";
  if (state) {
    data = data + state.text;
  } else {
    data = data + address?.stateProvince;
  }
  data = data + "," + country?.text + "</br>" + address?.postalCode;
  return data;
};
export const getProfileErrorMap = ({ data }, sectionMap) => {
  const returnData = [];
  sectionMap.forEach((item) => {
    if (data[item]) {
      returnData.push(data[item]);
    }
  });
  return [...new Set(flat(returnData))];
};
export const applicationMyInformationDetailsErrors = ({ data }, sectionMap) => {
  const returnData = [];
  sectionMap.forEach((item) => {
    if (data[item]) {
      returnData.push(data[item]);
    }
  });
  return [...new Set(flat(returnData))];
};
export const applicationMyProgramsDetailsErrors = ({ data }, sectionMap) => {
  const returnData = [];
  sectionMap.forEach((item) => {
    if (data[item]) {
      returnData.push(data[item]);
    }
  });
  return [...new Set(flat(returnData))];
};
export const applicationMySchoolsDetailsErrors = ({ data }, sectionMap) => {
  const returnData = [];
  sectionMap.forEach((item) => {
    if (data[item]) {
      returnData.push(data[item]);
    }
  });
  return [...new Set(flat(returnData))];
};
export const applicationMyHighSchoolGradesDetailsErrors = (
  { data },
  sectionMap
) => {
  const returnData = [];
  sectionMap.forEach((item) => {
    if (data[item]) {
      returnData.push(data[item]);
    }
  });
  return [...new Set(flat(returnData))];
};
export const applicationMyArizonaResidencyDetailsErrors = (
  { data },
  sectionMap,
  questions
) => {
  const psKeys = Object.values(crush(extractPsKeys()));
  const returnData = [];
  sectionMap.forEach((item) => {
    if (data[item]) {
      data[item].forEach((ele) => {
        let psKey = null;
        if (
          psKeys.some((key) => {
            if (ele.includes(key)) {
              psKey = key;
              return true;
            }
          })
        ) {
          returnData.push(`${psKey}:${questions[psKey].text}`);
        } else {
          returnData.push(ele);
        }
      });
    }
  });
  return returnData;
};
export const applicationMiscellaneousDetailsErrors = ({ data }, sectionMap) => {
  const returnData = [];
  sectionMap.forEach((item) => {
    if (data[item]) {
      returnData.push(data[item]);
    }
  });
  return [...new Set(flat(returnData))];
};

// public functions
function extractGoogleClientId() {
  const gaCookie = getCookie("_ga");
  let gaClientId = null;

  try {
    if (gaCookie && typeof gaCookie !== "undefined") {
      // sample value: GA1.1.2040707708.1641428898
      gaClientId = gaCookie.split(".").splice(2).join(".").toString();
    }
  } catch (error) {
    // eslint-disable-next-line
    console.error("== error in getting client IDs: ", error);
  }

  return gaClientId;
}
export { extractGoogleClientId };
