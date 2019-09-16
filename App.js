import React from "react";
import { StyleSheet } from "react-native";

import ShopNavigator from "./navigation/ShopNavigator";

import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import productsReducer from "./store/reducers/products";

const reducer = combineReducers({
  products: productsReducer
});

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigator />
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
