import axios from "axios";
import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const FETCH_PRODUCTS = "FETCH_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const response = await axios.get(
        "https://rn-myshop-app.firebaseio.com/products.json"
      );

      const fetchedProducts = [];
      let product;
      for (let key in response.data) {
        product = response.data[key];
        fetchedProducts.push(
          new Product(
            key,
            product.ownerId,
            product.title,
            product.imageUrl,
            product.description,
            product.price
          )
        );
      }
      dispatch({
        type: FETCH_PRODUCTS,
        products: fetchedProducts,
        userProducts: fetchedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await axios.delete(
      `https://rn-myshop-app.firebaseio.com/products/${productId}.json?auth=${token}`
    );
    dispatch({
      type: DELETE_PRODUCT,
      pid: productId
    });
  };
};

export const createProduct = (title, imageUrl, price, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await axios.post(
      `https://rn-myshop-app.firebaseio.com/products.json?auth=${token}`,
      {
        title,
        imageUrl,
        price,
        description,
        ownerId: userId
      }
    );
    const id = response.data.name;
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id,
        title,
        imageUrl,
        price,
        description,
        ownerId: userId
      }
    });
  };
};

export const updateProduct = (id, title, imageUrl, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    await axios.patch(
      `https://rn-myshop-app.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        title,
        imageUrl,
        description
      }
    );
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        imageUrl,
        description
      }
    });
  };
};
