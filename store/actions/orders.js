import axios from "axios";
import Order from "../../models/order";
export const ADD_ORDER = "ADD_ORDER";
export const FETCH_ORDERS = "FETCH_ORDERS";

export const addOrder = (items, totalAmount) => {
  return async (dispatch, getState) => {
    const date = new Date();
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await axios.post(
      `https://rn-myshop-app.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        items: items,
        amount: totalAmount,
        date: date.toISOString()
      }
    );
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: response.data.name,
        items: items,
        amount: totalAmount,
        date: date
      }
    });
  };
};

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const response = await axios.get(
      `https://rn-myshop-app.firebaseio.com/orders/${userId}.json`
    );
    let transformedOrders = [];
    let order;
    for (let key in response.data) {
      order = new Order(
        key,
        response.data[key].items,
        response.data[key].amount,
        new Date(response.data[key].date)
      );
      transformedOrders.push(order);
    }
    dispatch({ type: FETCH_ORDERS, orders: transformedOrders });
  };
};
