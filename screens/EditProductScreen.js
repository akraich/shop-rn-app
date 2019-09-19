import React, { useEffect, useCallback, useReducer } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";

import * as productsActions from "../store/actions/products";

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

const EditProductScreen = props => {
  const productId = props.navigation.getParam("productId");
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(product => product.id === productId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      price: "",
      description: editedProduct ? editedProduct.description : ""
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

  const inputChangeHandler = (name, value) => {
    let isValid = false;
    if (value.trim().length > 0) isValid = true;
    dispatchFormState({ type: UPDATE_INPUT_FORM, name, value, isValid });
  };

  const onSubmitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Form not valid",
        "Please fill in valid values to submit the form",
        [{ text: "Okey" }]
      );
      return;
    }
    const { title, imageUrl, price, description } = formState.inputValues;
    if (!productId) {
      dispatch(
        productsActions.createProduct(title, imageUrl, +price, description)
      );
    } else {
      dispatch(
        productsActions.updateProduct(productId, title, imageUrl, description)
      );
    }
    props.navigation.goBack();
  }, [dispatch, formState, productId]);

  useEffect(() => {
    props.navigation.setParams({ submit: onSubmitHandler });
  }, [onSubmitHandler]);

  return (
    <View style={styles.form}>
      <View style={styles.formControl}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={formState.inputValues.title}
          onChangeText={text => inputChangeHandler("title", text)}
        />
      </View>
      <View style={styles.formControl}>
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={formState.inputValues.imageUrl}
          onChangeText={text => inputChangeHandler("imageUrl", text)}
        />
      </View>
      {productId ? null : (
        <View style={styles.formControl}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.price}
            onChangeText={text => inputChangeHandler("price", text)}
          />
        </View>
      )}
      <View style={styles.formControl}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={formState.inputValues.description}
          onChangeText={text => inputChangeHandler("description", text)}
        />
      </View>
    </View>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitForm = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit product"
      : "Add product",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitForm}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: "100%"
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 10
  },
  input: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  }
});

export default EditProductScreen;
