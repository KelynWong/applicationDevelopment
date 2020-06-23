  
import * as React from 'react';
import { useState }from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const itemsPerPage = 2;

  const items = [
   {
     key: 1,
     name: 'Page 1',
   },
   {
     key: 2,
     name: 'Page 2',
   },
   {
     key: 3,
     name: 'Page 3',
   }
 ];

//  this.state = {
//   data: null,
//   loaded: true,
//   error: null,
//   companyId: null,
//   audienceReach: null,
// }

// const baseURL = 'http://localhost:3000';

// getData = (ev)=>{
// this.setState({loaded:false, error: null});
// let url = this.baseURL + '/basic/Alldata';

// let req = new Request(url, {
//   method: 'POST'
// });

// fetch(req)
// .then(response=>response.json())
// .then(this.showData)
// .catch(this.badStuff)
// }
// showData = (data)=>{
// this.setState({loaded:true, data});
// console.log(data);
// }
// badStuff = (err) => {
// this.setState({loaded: true, error: err.message});
// }
// componentDidMount(){
//   //this.getData();
//   //geolocation -> fetch
// }
// clearInput = () => {
// this.setState({ companyId: '', audienceReach: '' });
// }

const [page, setPage] = React.useState(0);
const from = page * itemsPerPage;
const to = (page + 1) * itemsPerPage;

export default class dataViewerScreen extends React.Component{
  constructor(){
    super();
    this.state = {
        data: null,
        loaded: true,
        error: null
    }
  }
  baseURL = 'https://jsonplaceholder.typicode.com';

  getData = (ev)=>{
      this.setState({loaded:false, error: null});
      let url = this.baseURL + '/comments';
      let h = new Headers();
      h.append('Authorization', 'Bearer sjdkfhakdkakhkajsdhks');
      h.append('X-Client', 'Steve and Friends');
      
      let req = new Request(url, {
          headers: h,
          method: 'GET'
      });
      
      fetch(req)
      .then(response=>response.json())
      .then(this.showData)
      .catch(this.badStuff)
  }
  showData = (data)=>{
      this.setState({loaded:true, data});
      console.log(data);
  }
  badStuff = (err) => {
      this.setState({loaded: true, error: err.message});
  }
  componentDidMount(){
      //this.getData();
      //geolocation -> fetch
  }
  
  render() {
    return (
      <View style={styles.container}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>Filter by:</Text>
                <View style={styles.textInputContainer}>
                    <Icon style={styles.icon} name="ios-business" size={30}></Icon>
                    <TouchableOpacity>
                            <TextInput
                            style={[styles.bodyText, { width: '100%'}]}
                            placeholder="CompanyId"
                            placeholderTextColor='rgb(0,0,0)'
                            multiline= {false} 
                            onChangeText={(text) => this.setState({companyId:text})}
                            keyboardType='numeric'/>
                    </TouchableOpacity>
                    <Button mode='contained' onPress={this.getData}>Filter</Button>
                </View>

                <View style={styles.textInputContainer}>
                    <Icon style={styles.icon} name="ios-person" size={30}></Icon>
                    <TouchableOpacity>
                        <TextInput
                        style={[styles.bodyText, { marginTop: -5}]}
                        placeholder="Audience Reach"
                        placeholderTextColor='rgb(0,0,0)'
                        multiline= {true} 
                        onChangeText={(text) => this.setState({audienceReach:text})}
                        keyboardType='numeric'/>
                    </TouchableOpacity>
                    <Button mode='contained' onPress={this.clearInput}>Clear</Button>
                </View>
            </View>

        <View style={styles.dataTableContainer}>
            {/* { !this.state.loaded && (
              <Text>LOADING</Text>
            )} */}
          <DataTable>
            <DataTable.Header>
                <DataTable.Title>Dessert</DataTable.Title>
                <DataTable.Title numeric>Calories</DataTable.Title>
                <DataTable.Title numeric>Fat</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Cell>Frozen yogurt</DataTable.Cell>
                <DataTable.Cell numeric>159</DataTable.Cell>
                <DataTable.Cell numeric>6.0</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
                <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
                <DataTable.Cell numeric>237</DataTable.Cell>
                <DataTable.Cell numeric>8.0</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.floor(items.length / itemsPerPage)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${items.length}`}
            />
            </DataTable>
        </View>
      </View>
    )
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
    flex: 6
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
});