import axios from "axios";
import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const FETCH_PRODUCTS = "FETCH_PRODUCTS";

export const fetchProducts = () => {
  return async dispatch => {
    try {
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
            "u1",
            product.title,
            product.imageUrl,
            product.description,
            product.price
          )
        );
      }
      dispatch({
        type: FETCH_PRODUCTS,
        products: fetchedProducts
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return {
    type: DELETE_PRODUCT,
    pid: productId
  };
};

export const createProduct = (title, imageUrl, price, description) => {
  return async dispatch => {
    const response = await axios.post(
      "https://rn-myshop-app.firebaseio.com/products.json",
      {
        title,
        imageUrl,
        price,
        description
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
        description
      }
    });
  };
};

export const updateProduct = (id, title, imageUrl, description) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      imageUrl,
      description
    }
  };
};
