import PRODUCTS from "../../data/dummy-data";

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS
};

export default (state = initialState, action) => {
  return state;
};
