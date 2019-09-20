import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Button,
  View,
  Text,
  FlatList,
  Platform,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";

import ProductItem from "../components/ProductItem";

import * as cartActions from "../store/actions/cart";
import * as productsActions from "../store/actions/products";
import Colors from "../constants/colors";

const ProductsOverviewScreen = props => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setRefreshing(false);
  }, [dispatch, setError, setLoading]);

  useEffect(() => {
    const willFocusLis = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    return () => {
      willFocusLis.remove();
    };
  }, []);

  useEffect(() => {
    setLoading(false);
    loadProducts().then(() => {
      setLoading(false);
    });
  }, [dispatch, loadProducts]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        ></ActivityIndicator>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Something went wrong</Text>
        <Button
          title="Try again"
          color={Colors.primary}
          onPress={loadProducts}
        ></Button>
      </View>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found, you might wanna start adding some</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={refreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          title={itemData.item.title}
          price={itemData.item.price}
          image={itemData.item.imageUrl}
          onSelect={() => {
            props.navigation.navigate("ProductDetail", {
              productId: itemData.item.id,
              title: itemData.item.title
            });
          }}
        >
          <Button
            color={Colors.primary}
            title="View details"
            onPress={() => {
              props.navigation.navigate("ProductDetail", {
                productId: itemData.item.id,
                title: itemData.item.title
              });
            }}
          />
          <Button
            color={Colors.primary}
            title="Add to cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
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
    )
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ProductsOverviewScreen;
