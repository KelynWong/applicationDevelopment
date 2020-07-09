/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import basicDataViewerScreen from './Screens/basicDataViewer'
import basicResultViewerScreen from './Screens/basicResultViewer'
import advanceDataViewerScreen from './Screens/advDataViewer'
import advanceResultViewerScreen from './Screens/advResultViewer'

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

const basicDataViewerStack = createStackNavigator();
const basicResultViewerStack = createStackNavigator();
const advanceDataViewerStack = createStackNavigator();
const advanceResultViewerStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const basicDataViewerStackScreen= ({navigation}) => (
      <DataViewerStack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#009387',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }}>
            <basicDataViewerStack.Screen name="basicDataViewer" component={basicDataViewerScreen} options={{
                title: 'Data Viewer (basic)',
                headerLeft: () => (
                  <Icon.Button  name="ios-menu" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }}/>
        </DataViewerStack.Navigator>
)

const basicResultViewerStackScreen= ({navigation}) => (
  <ResultViewerStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: '#009387',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}>
        <basicResultViewerStack.Screen name="basicResultViewer" component={basicResultViewerScreen} options={{
            title: 'Result Viewer (basic)',
            headerLeft: () => (
              <Icon.Button  name="ios-menu" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}></Icon.Button>
            )
        }}/>
    </ResultViewerStack.Navigator>
)

const advanceDataViewerStackScreen= ({navigation}) => (
  <DataViewerStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: '#009387',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}>
        <advanceDataViewerStack.Screen name="advanceDataViewer" component={advanceDataViewerScreen} options={{
            title: 'Data Viewer (advance)',
            headerLeft: () => (
              <Icon.Button  name="ios-menu" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}></Icon.Button>
            )
        }}/>
    </DataViewerStack.Navigator>
)

const advanceResultViewerStackScreen= ({navigation}) => (
<ResultViewerStack.Navigator screenOptions={{
    headerStyle: {
        backgroundColor: '#009387',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold'
    }
}}>
    <advanceResultViewerStack.Screen name="advanceResultViewer" component={advanceResultViewerScreen} options={{
        title: 'Result Viewer (advance)',
        headerLeft: () => (
          <Icon.Button  name="ios-menu" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}></Icon.Button>
        )
    }}/>
</ResultViewerStack.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='basicDataViewer'>
        <Drawer.Screen name='basicDataViewer' component={basicDataViewerStackScreen}/>
        <Drawer.Screen name='basicResultViewer' component={basicResultViewerStackScreen}/>
        <Drawer.Screen name='advanceDataViewer' component={advanceDataViewerStackScreen}/>
        <Drawer.Screen name='advanceResultViewer' component={advanceResultViewerStackScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

