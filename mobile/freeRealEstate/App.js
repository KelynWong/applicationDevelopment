/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import dataViewerScreen from './testDataViewerScreen'
import resultViewerScreen from './resultViewerScreen'

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

const DataViewerStack = createStackNavigator();
const ResultViewerStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DataViewerStackScreen= ({navigation}) => (
      <DataViewerStack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#009387',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }}>
            <DataViewerStack.Screen name="DataViewer" component={dataViewerScreen} options={{
                title: 'Data Viewer',
                headerLeft: () => (
                  <Icon.Button  name="ios-menu" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }}/>
        </DataViewerStack.Navigator>
)

const ResultViewerStackScreen= ({navigation}) => (
  <ResultViewerStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: '#009387',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}>
        <ResultViewerStack.Screen name="ResultViewer" component={resultViewerScreen} options={{
            title: 'Result Viewer',
            headerLeft: () => (
              <Icon.Button  name="ios-menu" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}></Icon.Button>
            )
        }}/>
    </ResultViewerStack.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='DataViewer'>
        <Drawer.Screen name='DataViewer' component={DataViewerStackScreen}/>
        <Drawer.Screen name='ResultViewer' component={ResultViewerStackScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

