import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import Colors from "../constants/colors";

import CartItem from "../components/CartItem";

import * as cartActions from "../store/actions/cart";
import * as ordersActions from "../store/actions/orders";

const CartScreen = props => {
  const [loading, setLoading] = useState(false);
  const totalPrice = useSelector(state => state.cart.totalPrice);
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (let key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  const dispatch = useDispatch();

  sendOrderHandler = async () => {
    setLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, totalPrice));
    setLoading(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: <Text style={styles.amount}>${totalPrice.toFixed(2)}</Text>
        </Text>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <Button
            color={Colors.accent}
            title="Order now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={dataItem => (
          <CartItem
            {...dataItem.item}
            deletable={true}
            onRemove={() =>
              dispatch(cartActions.removeFromCart(dataItem.item.productId))
            }
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Cart"
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "white"
  },
  summaryText: {
    fontSize: 18
  },
  amount: {
    fontFamily: "open-sans-bold",
    color: Colors.accent
  }
});

export default CartScreen;
