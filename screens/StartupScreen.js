import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from "react-native";

import * as authActions from "../store/actions/auth";

import Colors from "../constants/colors";

const StartupScreen = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }
      const { token, userId, expiresIn } = JSON.parse(userData);
      const expirationDate = new Date(expiresIn);
      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }
      const expiryTime = expirationDate.getTime() - new Date().getTime();
      dispatch(authActions.authenticate(token, userId, expiryTime));
      props.navigation.navigate("Shop");
    };
    loadUserData();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default StartupScreen;
