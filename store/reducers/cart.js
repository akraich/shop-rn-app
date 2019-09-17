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
    case cartActions.REMOVE_FROM_CART:
      const selectedProduct = state.items[action.pid];
      const qty = selectedProduct.quantity;
      let updatedCartItems;
      if (qty > 1) {
        const item = new CartItem(
          qty - 1,
          selectedProduct.productPrice,
          selectedProduct.productTitle,
          selectedProduct.sum - selectedProduct.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: item };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalPrice: state.totalPrice - selectedProduct.productPrice
      };
    default:
      return state;
  }
};
