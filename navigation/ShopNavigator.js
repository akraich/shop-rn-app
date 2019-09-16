import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";

import { createStackNavigator } from "react-navigation-stack";

import ProductsOverviewScreen from "../screens/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";

import Colors from "../constants/colors";

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : ""
      },
      headerTintColor: Platform.OS === "android" ? "white" : Colors.primary
    }
  }
);

export default createAppContainer(ProductsNavigator);
