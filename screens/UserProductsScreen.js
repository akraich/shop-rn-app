import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { FlatList, Button, Platform, StyleSheet, Alert } from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";

import ProductItem from "../components/ProductItem";

import Colors from "../constants/colors";

import * as productsActions from "../store/actions/products";

const UserProductsScreen = props => {
  const selectItem = id => {
    props.navigation.navigate("EditProduct", {
      productId: id
    });
  };
  const products = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const deleteHandler = id => {
    Alert.alert("Are you sure", "Do you really wanna delete this item?", [
      {
        text: "No",
        style: "default"
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        }
      }
    ]);
  };

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          title={itemData.item.title}
          price={itemData.item.price}
          image={itemData.item.imageUrl}
          onSelect={() => selectItem(itemData.item.id)}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => selectItem(itemData.item.id)}
          />
          <Button
            color="red"
            title="Delete"
            onPress={() => deleteHandler(itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your products",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({});

export default UserProductsScreen;
