import React, { useEffect, useCallback, useReducer } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import Input from "../components/Input";

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

  const inputChangeHandler = useCallback(
    (name, value, isValid) => {
      dispatchFormState({ type: UPDATE_INPUT_FORM, name, value, isValid });
    },
    [dispatchFormState]
  );

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Title"
            name="title"
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
            inputChangeHandler={inputChangeHandler}
            required
            errorText="Please provide a valid title"
          />
          <Input
            label="Image URL"
            name="imageUrl"
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
            inputChangeHandler={inputChangeHandler}
            required
            errorText="Please provide a valid image URL"
          />
          {productId ? null : (
            <Input
              label="Price"
              name="price"
              initialValue={editedProduct ? editedProduct.price : ""}
              initiallyValid={!!editedProduct}
              inputChangeHandler={inputChangeHandler}
              required
              errorText="Please provide a valid price"
            />
          )}
          <Input
            label="Description"
            name="description"
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            inputChangeHandler={inputChangeHandler}
            required
            multiline
            numberOfLines={3}
            errorText="Please provide a valid description"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  }
});

export default EditProductScreen;
