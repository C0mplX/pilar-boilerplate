import {isEmptyString} from "./validate";

export interface ILoginParams {
  email: string;
  password: string;
}
export interface ISignupParams {
  email: string;
  fname: string;
  lname: string;
  password: string;
}

export const validateSignupParams = (data: ISignupParams) => {
  const validationErrors = [];
  if(isEmptyString(data.email)) {
    validationErrors.push("EMAIL_REQUIRED");
  } else {
    if(!validateEmail(data.email)) {
      validationErrors.push("INVALID_EMAIL");
    }
  }
  if(isEmptyString(data.password)) {
    validationErrors.push("PASSWORD_REQUIRED");
  } else {
    if(data.password.length < 6) {
      validationErrors.push("INVALID_PASSWORD_LENGTH_6");
    }
  }
  if(isEmptyString(data.fname)) {
    validationErrors.push("FNAME_REQUIRED");
  }
  if(isEmptyString(data.lname)) {
    validationErrors.push("LNAME_REQUIRED");
  }
  return validationErrors;
};

export const validateLoginParams = (data: ILoginParams) => {
  const validationErrors = [];
  if(isEmptyString(data.email)) {
    validationErrors.push("EMAIL_REQUIRED");
  } else {
    if(!validateEmail(data.email)) {
      validationErrors.push("INVALID_EMAIL");
    }
  }
  if(isEmptyString(data.password)) {
    validationErrors.push("PASSWORD_REQUIRED");
  } else {
    if(data.password.length < 6) {
      validationErrors.push("INVALID_PASSWORD_LENGTH_6");
    }
  }
  return validationErrors;
};


function validateEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

