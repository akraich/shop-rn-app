import { ADD_ORDER, FETCH_ORDERS } from "../actions/orders";
import order from "../../models/order";

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };
    case FETCH_ORDERS:
      return {
        orders: action.orders
      };

    default:
      return state;
  }
};
