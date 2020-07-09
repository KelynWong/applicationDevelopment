import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class resultViewerScreen extends React.Component{
    render() {
        return (
            <View style={styles.container}>
                <Text>HI HI</Text>
            </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    // alignItems: 'center', 
    // justifyContent: 'center'
  },
  filterContainer:{
    height: 150,
    width: "100%",
    //marginTop: "5%",
    borderColor: "rgb(0, 0, 0)",
    borderWidth: 1,
    backgroundColor: "#D7F1FF",
    flex: 2,
  },
  dataTableContainer:{
    flex: 6,
    width: "100%",
  },
  textInputContainer:{
    flexDirection: 'row',
    marginTop: "3%",
    alignItems: 'center',
    height: 40
  },
  filterText:{
    height: 30,
    fontSize: 20,
    marginLeft: "3%",
    marginTop: "3%",
    fontFamily: 'Montserrat-Regular',
  },
  bodyText:{
    fontSize: 17,
    fontFamily: 'Montserrat-Regular',
    marginTop:'5%',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    height: 40
  },
  icon:{
    padding: 6,
    backgroundColor: "#808080"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
    txt: {
        fontSize: 24,
        color: '#333'
    },
    err:{
        color: 'red',
        fontSize: 30,
        fontWeight: 'bold'
    }
});