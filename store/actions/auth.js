import axios from "axios";

import { AsyncStorage } from "react-native";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

const API_KEY = "AIzaSyD_oL3bGhdRhEsJeM5NC8jfV4AIXE33y6Y";

let timer;

export const signupUser = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      );

      const token = response.data.idToken;
      const userId = response.data.localId;
      const expiresIn = response.data.expiresIn;
      const expirationDate = new Date(
        new Date().getTime + parseInt(expiresIn) * 1000
      );
      dispatch(authenticate(token, userId, parseInt(expiresIn) * 1000));

      AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          token,
          userId,
          expiresIn: expirationDate.toIOSString
        })
      );
    } catch (err) {
      const { message } = err.response.data.error;
      throw new Error(message);
    }
  };
};

export const signinUser = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      );
      const token = response.data.idToken;
      const userId = response.data.localId;
      const expiresIn = response.data.expiresIn;
      const expirationDate = new Date(
        new Date().getTime + parseInt(expiresIn) * 1000
      );
      dispatch(authenticate(token, userId, parseInt(expiresIn) * 1000));

      AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          token,
          userId,
          expiresIn: expirationDate.toIOSString
        })
      );
    } catch (err) {
      const { message } = err.response.data.error;
      throw new Error(message);
    }
  };
};

export const authenticate = (token, userId, expireIn) => {
  return dispatch => {
    dispatch(setLogoutTimer(expireIn));
    dispatch({
      type: AUTHENTICATE,
      token,
      userId
    });
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return {
    type: LOGOUT
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expiresIn => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expiresIn / 1000);
  };
};
