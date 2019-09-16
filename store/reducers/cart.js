import * as cartActions from "../actions/cart";
import CartItem from "../../models/CartItem";

const initialState = {
  items: {},
  totalPrice: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case cartActions.ADD_TO_CART:
      const { product } = action;
      let newOrUpdatedItem;
      if (state.items[product.id]) {
        newOrUpdatedItem = new CartItem(
          state.items[product.id].quantity + 1,
          product.price,
          product.title,
          state.items[product.id].sum + product.price
        );
      } else {
        newOrUpdatedItem = new CartItem(
          1,
          product.price,
          product.title,
          product.price
        );
      }
      return {
        ...state,
        items: { ...state.items, [product.id]: newOrUpdatedItem },
        totalPrice: state.totalPrice + product.price
      };
    default:
      return state;
  }
};
