import months from "../../src/content/months.json";

export const generateSarValues = (object, values = []) => {
  if (typeof object !== "object") {
    return [...values, object];
  }
  return Object.values(object).flatMap((v) => generateSarValues(v, values));
};

export const getMonthDetails = (month) => {
  const value = months.filter(
    (item) => parseInt(item.value) === parseInt(month)
  );
  return value.length > 0 ? value[0] : null;
};

export const getFormettedDOB = ({ date, month, year }) => {
  const newDate = new Date();
  let dob = null;
  // adding year
  dob = `${year ? year : newDate.getFullYear()}-`;
  // adding month
  const currentMonth = newDate.getMonth() + 1;
  dob =
    dob +
    `${month ? month : currentMonth > 9 ? currentMonth : `0${currentMonth}`}-`;
  // adding date
  const currentDate = newDate.getDate();
  dob =
    dob + `${date ? date : currentDate > 9 ? currentDate : `0${currentDate}`}`;
  return dob;
};
