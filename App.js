import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import productsReducer from "./store/reducers/products";
import { create } from "uuid-js";

const reducer = combineReducers({
  products: productsReducer
});

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.screen}>
        <Text>The Shop App!</Text>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
