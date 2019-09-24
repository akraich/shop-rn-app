import React, { useEffect, useState, useReducer, useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  View,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import Input from "../components/Input";
import Colors from "../constants/colors";

import * as authActions from "../store/actions/auth";

const UPDATE_INPUT_FORM = "UPDATE_INPUT_FORM";

const formReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_INPUT_FORM:
      const updatedInputValues = {
        ...state.inputValues,
        [action.name]: action.value
      };
      const updatedInputValidities = {
        ...state.inputValidities,
        [action.name]: action.isValid
      };
      let updatedFormIsValid = true;
      for (let key in updatedInputValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
      }
      return {
        inputValues: updatedInputValues,
        inputValidities: updatedInputValidities,
        formIsValid: updatedFormIsValid
      };
    default:
      return state;
  }
};

const LoginScreen = props => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "OKAY" }]);
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (name, value, isValid) => {
      dispatchFormState({ type: UPDATE_INPUT_FORM, name, value, isValid });
    },
    [dispatchFormState]
  );

  const onSubmitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Form not valid",
        "Please fill in valid values to submit the form",
        [{ text: "Okey" }]
      );
      return;
    }
    const { email, password } = formState.inputValues;
    let action;
    if (isSignup) {
      action = authActions.signupUser(email, password);
    } else {
      action = authActions.signinUser(email, password);
    }
    setLoading(true);
    setError(false);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }, [dispatch, formState]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior="padding"
      keyboardVerticalOffset={50}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <View style={styles.authContainer}>
          <ScrollView>
            <Input
              name="email"
              label="E-mail"
              email
              required
              autoCapitalize="none"
              keyboardType="email-address"
              errorText="Please enter a valid email address"
              initialValue=""
              inputChangeHandler={inputChangeHandler}
            />
            <Input
              name="password"
              label="Password"
              minLength={5}
              required
              autoCapitalize="none"
              secureTextEntry
              errorText="Please enter a valid password value"
              initialValue=""
              inputChangeHandler={inputChangeHandler}
            />
            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? "Sign Up" : "Sign In"}
                  color={Colors.primary}
                  onPress={onSubmitHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`SWitch to ${isSignup ? "Sign In" : "Sign UP"}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

LoginScreen.navigationOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "white"
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default LoginScreen;
