import React from "react";

import { useSelector } from "react-redux";

import { View, Text, StyleSheet } from "react-native";

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(product => product.id === productId)
  );
  console.log(selectedProduct);
  return (
    <View>
      <Text>{selectedProduct.title}</Text>
    </View>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return { headerTitle: navData.navigation.getParam("title") };
};

const styles = StyleSheet.create({});

export default ProductDetailScreen;
