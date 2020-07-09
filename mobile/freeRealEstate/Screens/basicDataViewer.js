import * as React from 'react';
import { useState }from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Picker} from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
// import Picker from '@react-native-community/picker';

// const itemsPerPage = 2;

//   const items = [
//    {
//      key: 1,
//      name: 'Page 1',
//    },
//    {
//      key: 2,
//      name: 'Page 2',
//    },
//    {
//      key: 3,
//      name: 'Page 3',
//    }
//  ];

//  const [page, setPage] = React.useState(0);
// const from = page * itemsPerPage;
// const to = (page + 1) * itemsPerPage;

export default class dataViewerScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            results: [],
            loaded: true,
            error: null,
            companyId: '',
            audienceReach: '',
            rowCount: null,
            pageNo: 0,
            pageSize: 3, //default 3 rows in one page
            page: 1,
        }
        this.getData = this.getData.bind(this);
    }
    baseURL = 'http://192.168.229.1:3000';
    
    componentDidMount(){
      this.getRowCount();
      this.setState({loaded:false, error: null});
      let url = this.baseURL + '/basic/Alldata';
      
      let req = new Request(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({
              pageNo: this.state.pageNo, //OFFSET
              pageSize: this.state.pageSize, //LIMIT 
          })
      });
      
      fetch(req)
      .then((response) => response.json())
      .then(this.showData)
      .catch(this.badStuff)
    }
    getData = (ev)=>{
        console.log('this.state.page: ', this.state.page)
        console.log('this.state.pageNo: ', this.state.pageNo)
        console.log('this.state.companyId: ' + this.state.companyId)
        console.log('this.state.audienceReach: ' + this.state.audienceReach)
        this.setState({loaded:false, error: null});
        let url = this.baseURL + '/basic/Alldata';
        
        let req = new Request(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({
                pageNo: this.state.pageNo, //OFFSET
                pageSize: this.state.pageSize, //LIMIT 
                //Specifically for filters
                companyId: this.state.companyId,
                audienceReach: this.state.audienceReach
            })
        });
        
        fetch(req)
        .then((response) => response.json())
        .then(this.showData)
        .catch(this.badStuff)
    }
    showData = (data)=>{
        this.setState({
            results: data
        });
        console.log(this.state.results);
        this.setState({loaded:true});
    }
    getRowCount = (ev)=>{
      console.log('this.state.companyId: ' + this.state.companyId)
      console.log('this.state.audienceReach: ' + this.state.audienceReach)
      this.setState({loaded:false, error: null});
      let url = this.baseURL + '/extra/basicGetRowCount';
      
      let req = new Request(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({
              companyId: this.state.companyId,
              audienceReach: this.state.audienceReach
          })
      });
      
      fetch(req)
      .then((response) => response.json())
      .then(this.showRowCount)
      .catch(this.badStuff)
    }
    showRowCount = (data)=>{
      this.setState({
        rowCount: data
      });
      console.log(this.state.rowCount[0].count);
      this.setState({loaded:true});
    }
    badStuff = (err) => {
        console.log(err)
        this.setState({loaded: true, error: err.message});
    }
    clearText(){
      this.setState({companyId:''})
      this.setState({audienceReach:''})
    }
    setPage(page){
      var temp = 0;
      this.setState({ page: page })
      console.log("this.state.page: " + this.state.page)
      console.log("this.state.pageSize: " + this.state.pageSize)
      temp = this.state.page * this.state.pageSize
      console.log("temp: " + temp)
      this.setState({ pageNo: temp})
      console.log("this.state.pageNo: " + this.state.pageNo)
      // this.getData();
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
                    <Button mode='contained' onPress={() => { this.getData(); this.getRowCount(); }}>Filter</Button>
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
                    <Button mode='contained' onPress={() => {this.clearText}}>Clear</Button>
                </View>
            </View>

            {/* <DropDownPicker
              items={[
                  {label: '1', value: '1'},
                  {label: '2', value: '2'},
                  {label: '3', value: '3'},
                  {label: '4', value: '4'},
                  {label: '5', value: '5'},
                  {label: '6', value: '6'},
                  {label: '7', value: '7'},
                  {label: '8', value: '8'},
                  {label: '9', value: '9'},
                  {label: '10', value: '10'},
              ]}
              labelStyle={{color: '#00FF00'}}
              placeholder="Number of rows per page"
              defaultValue={3}
              containerStyle={{height: 40}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => this.setState({
                  pageSize: item.value
              })}
            /> */}

            <View>
              <Picker
              style={{width:'100%'}}
              selectedValue={this.state.pageSize}
              onValueChange={(itemValue, itemIndex) =>
              this.setState({pageSize: itemValue})}
              >
                <Picker.Item label="Number of entries per page" value={0}></Picker.Item>
                <Picker.Item label="1" value={1}></Picker.Item>
                <Picker.Item label="2" value={2}></Picker.Item>
                <Picker.Item label="3" value={3}></Picker.Item>
                <Picker.Item label="4" value={4}></Picker.Item>
                <Picker.Item label="5" value={5}></Picker.Item>
                <Picker.Item label="6" value={6}></Picker.Item>
                <Picker.Item label="7" value={7}></Picker.Item>
                <Picker.Item label="8" value={8}></Picker.Item>
                <Picker.Item label="9" value={9}></Picker.Item>
                <Picker.Item label="10" value={10}></Picker.Item>
              </Picker>
            </View>

        <View style={styles.dataTableContainer}>
          <DataTable>
              <DataTable.Header>
                <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines= {4}
                >OptionId</DataTable.Title>
                <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines= {4}
                >CompanyId</DataTable.Title>
                <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines= {2}
                >Cost</DataTable.Title>
                <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines= {2}
                >Audience Reach</DataTable.Title>
                <DataTable.Title
                sortDirection='ascending'
                numberOfLines= {3}
                >Ad Type</DataTable.Title>
              </DataTable.Header>

              { !this.state.loaded && (
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
              )}

              { this.state.error && (
                <Text style={styles.err}>{this.state.error}</Text>
              )}

              { this.state.results && this.state.results.length > 0 && (this.state.results.map( (result, i) => (
                <DataTable.Row key={i}>
                <DataTable.Cell numeric>{result.optionid}</DataTable.Cell>
                <DataTable.Cell numeric>{result.companyid}</DataTable.Cell>
                <DataTable.Cell numeric>{result.cost}</DataTable.Cell>
                <DataTable.Cell numeric>{result.audiencereach}</DataTable.Cell>
                <DataTable.Cell>{result.adtype}</DataTable.Cell>
              </DataTable.Row>
              )))}

              { this.state.rowCount && (
                <DataTable.Pagination
                  page={this.state.page}
                  numberOfPages={Math.floor(this.state.rowCount[0].count / this.state.pageSize)}
                  onPageChange={pagee => {
                    console.log('change', pagee)
                    this.setPage(pagee)
                    // this.setState({ page: pagee })
                    // this.setState({ pageNo: this.state.page * this.state.pageSize})
                    // this.getData();
                  }}
                  label={`${((this.state.page - 1) * this.state.pageSize) + 1}-${((this.state.page + 1) * this.state.pageSize)} of ${this.state.rowCount[0].count}`}
                /> 
              )}
          </DataTable>
        </View>
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