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
import layoutTest from './Screens/layoutTest'


import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

const testStack = createStackNavigator();
const basicDataViewerStack = createStackNavigator();
const basicResultViewerStack = createStackNavigator();
const advanceDataViewerStack = createStackNavigator();
const advanceResultViewerStack = createStackNavigator();
const Drawer = createDrawerNavigator();


const test = ({navigation}) => (
    <testStack.Navigator screenOptions={{
          headerStyle: {
              backgroundColor: '#009387',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
              fontWeight: 'bold'
          }
      }}>
          <testStack.Screen name="layoutTest" component={layoutTest} options={{
              title: 'Layout test.',
              headerLeft: () => (
                <Icon.Button  name="ios-menu" size={25} backgroundColor='#009387' onPress={() => navigation.openDrawer()}></Icon.Button>
              )
          }}/>
      </testStack.Navigator>
)

const basicDataViewerStackScreen= ({navigation}) => (
      <basicDataViewerStack.Navigator screenOptions={{
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
        </basicDataViewerStack.Navigator>
)

const basicResultViewerStackScreen= ({navigation}) => (
  <basicResultViewerStack.Navigator screenOptions={{
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
    </basicResultViewerStack.Navigator>
)

const advanceDataViewerStackScreen= ({navigation}) => (
  <advanceDataViewerStack.Navigator screenOptions={{
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
    </advanceDataViewerStack.Navigator>
)

const advanceResultViewerStackScreen= ({navigation}) => (
<advanceResultViewerStack.Navigator screenOptions={{
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
</advanceResultViewerStack.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='layoutTest'>
        <Drawer.Screen name='testing' component={test}/>

        <Drawer.Screen name='basicDataViewer' component={basicDataViewerStackScreen}/>
        <Drawer.Screen name='basicResultViewer' component={basicResultViewerStackScreen}/>
        <Drawer.Screen name='advanceDataViewer' component={advanceDataViewerStackScreen}/>
        <Drawer.Screen name='advanceResultViewer' component={advanceResultViewerStackScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

