import React, { useState, useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  Platform,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";

import OrderItem from "../components/OrderItem";

import * as ordersActions from "../store/actions/orders";
import Colors from "../constants/colors";

const OrdersScreen = props => {
  const [loading, setLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    await dispatch(ordersActions.fetchOrders());
    setLoading(false);
  }, [dispatch, setLoading]);

  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]);
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={dataItem => (
        <OrderItem
          amount={dataItem.item.amount}
          date={dataItem.item.readableDate}
          items={dataItem.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: "You orders",
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

const styles = StyleSheet.create({});

export default OrdersScreen;
