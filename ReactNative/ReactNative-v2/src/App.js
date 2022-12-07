import React from "react";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Sidebar from "./components/sidebar/sidebar.component";
import Home from "./components/home/home.container";
import Detail from "./components/detail/detail.container";


const Drawer = DrawerNavigator(
	{
		Detail: { screen: Detail },
	},
	{
		initialRouteName: "Detail",
		contentComponent: props => <Sidebar {...props} />,
	}
);

const App = StackNavigator(
    {
        Home: { screen: Home },
		Drawer: { screen: Drawer }
    },
    {
        initialRouteName: "Home",
        headerMode: "none",
    }
);

export default () => (
    <Root>
        <App />
    </Root>
);
