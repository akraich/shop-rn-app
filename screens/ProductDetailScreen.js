import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { View, Text, Image, Button, StyleSheet } from "react-native";
import Colors from "../constants/colors";

import * as cartActions from "../store/actions/cart";

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(product => product.id === productId)
  );
  const dispatch = useDispatch();
  return (
    <View>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          title="Add to cart"
          color={Colors.primary}
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.title}>${selectedProduct.price}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </View>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return { headerTitle: navData.navigation.getParam("title") };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
  },
  actions: {
    alignItems: "center",
    marginVertical: 10
  },
  title: {
    fontSize: 22,
    color: "#888",
    marginVertical: 20,
    textAlign: "center",
    fontFamily: "open-sans-bold"
  },
  description: {
    fontSize: 14,
    marginHorizontal: 20,
    fontFamily: "open-sans"
  }
});

export default ProductDetailScreen;
