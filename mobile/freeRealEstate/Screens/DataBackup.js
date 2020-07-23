import * as React from 'react';
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-material-dropdown';


let data = [{
  value: '5',
}, {
  value: '10',
}, {
  value: '15',
}, {
  value: '20',
}, {
  value: '25',
}, {
  value: '30',
}, {
  value: '35',
}, {
  value: '40',
}, {
  value: '45',
}, {
  value: '50',
}];

export default class dataViewerScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      results: [],
      loaded: true,
      error: null,
      companyId: '',
      audienceReach: '',
      rowCount: null,
      pageNo: 0,
      pageSize: 5, //default 5 rows in one page
      page: 1,
    }
    this.getData = this.getData.bind(this);
  }
  // baseURL = 'http://192.168.229.1:3000';
  baseURL = 'http://192.168.86.1:3000';

  componentDidMount() {
    this.getRowCount();
    this.setState({ loaded: false, error: null });
    let url = this.baseURL + `/basic/Alldata?pageNo=${this.state.pageNo}&pageSize=${this.state.pageSize}`;

    let req = new Request(url, {
      method: 'GET',
    });

    fetch(req)
      .then((response) => response.json())
      .then(this.showData)
      .catch(this.badStuff)
  }
  getData = (ev) => {
    if (!this.state.companyId && !this.state.audienceReach) {
      Alert.alert('OOPS!', "Fill in at least one of the parameters!(CompanyId, Audience reach)", [
        { text: 'Understood', onPress: () => console.log('Alert closed.') }
      ]);
    } else {
      this.companyIdValidation();
      this.audienceReachValidation();
    }
    this.setState({ loaded: false, error: null });
    let url = this.baseURL + `/basic/Alldata?pageNo=${this.state.pageNo}&pageSize=${this.state.pageSize}&companyId=${this.state.companyId}&audienceReach=${this.state.audienceReach}`;

    let req = new Request(url, {
      method: 'GET',
    });

    fetch(req)
      .then((response) => response.json())
      .then(this.showData)
      .catch(this.badStuff)
  }
  showData = (data) => {
    this.setState({
      results: data
    });
    console.log(this.state.results);
    this.setState({ loaded: true });
    this.getRowCount;
  }
  getRowCount = (ev) => {
    console.log('this.state.companyId: ' + this.state.companyId)
    console.log('this.state.audienceReach: ' + this.state.audienceReach)
    this.setState({ loaded: false, error: null });
    let url = this.baseURL + `/extra/basicGetRowCount?companyId=${this.state.companyId}&audienceReach=${this.state.audienceReach}`;

    let req = new Request(url, {
      method: 'GET',
    });

    fetch(req)
      .then((response) => response.json())
      .then(this.showRowCount)
      .catch(this.badStuff)
  }
  showRowCount = (data) => {
    this.setState({
      rowCount: data
    });
    console.log(this.state.rowCount[0].count);
    this.setState({ loaded: true });
  }
  badStuff = (err) => {
    console.log(err)
    this.setState({ loaded: true, error: err.message });
  }
  clearText() {
    this.setState({
      companyId: '',
      audienceReach: ''
    }, () => {
      this.componentDidMount();
    });
  }
  setPage(page) {
    var temp = 0;
    this.setState({ page: page })
    console.log("this.state.page: " + this.state.page)
    console.log("this.state.pageSize: " + this.state.pageSize)
    temp = this.state.page * this.state.pageSize
    console.log("temp: " + temp)
    this.setState({ pageNo: temp })
    console.log("this.state.pageNo: " + this.state.pageNo)
    // this.getData();
  }

  companyIdValidation() {
    console.log("this.state.companyId.length: " + this.state.companyId.length)
    if (this.state.companyId) {
      if (isNaN(this.state.companyId) == true) {
        this.setState({ companyId: '' })
        Alert.alert('OOPS!', "Company Id has to be a 10 digit number!", [
          { text: 'Understood', onPress: () => console.log('Alert closed.') }
        ]);
      } else if (this.state.companyId % 1 != 0) {
        this.setState({ companyId: '' })
        Alert.alert('OOPS!', "Company Id has to be a 10 digit number! Not a decimal!", [
          { text: 'Understood', onPress: () => console.log('Alert closed.') }
        ]);
      } else if (this.state.companyId.length != 10) {
        this.setState({ companyId: '' })
        Alert.alert('OOPS!', "Company Id has to be a 10 digit number!", [
          { text: 'Understood', onPress: () => console.log('Alert closed.') }
        ]);
      }
    }
  }

  audienceReachValidation() {
    if (this.state.audienceReach) {
      // If filterAudienceReach exists
      if (isNaN(this.state.audienceReach) == true) {
        this.setState({ audienceReach: '' })
        Alert.alert('OOPS!', "Audience reach has to be a numeric number!", [
          { text: 'Understood', onPress: () => console.log('Alert closed.') }
        ]);
      } else if (this.state.audienceReach % 1 != 0) {
        this.setState({ audienceReach: '' })
        Alert.alert('OOPS!', "Audience reach has to be a numeric number! Not a decimal!", [
          { text: 'Understood', onPress: () => console.log('Alert closed.') }
        ]);
      }
    }
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
                style={[styles.bodyText, { width: '100%' }]}
                placeholder="CompanyId"
                placeholderTextColor='rgb(0,0,0)'
                multiline={false}
                onChangeText={(text) => this.setState({ companyId: text })}
                value={this.state.companyId}
                keyboardType='numeric' />
            </TouchableOpacity>
            <Button mode='contained' onPress={() => { this.getData() }}>Filter</Button>
          </View>

          <View style={styles.textInputContainer}>
            <Icon style={styles.icon} name="ios-person" size={30}></Icon>
            <TouchableOpacity>
              <TextInput
                style={[styles.bodyText, { marginTop: -5 }]}
                placeholder="Audience Reach"
                placeholderTextColor='rgb(0,0,0)'
                multiline={true}
                onChangeText={(text) => this.setState({ audienceReach: text })}
                value={this.state.audienceReach}
                keyboardType='numeric' />
            </TouchableOpacity>
            <Button mode='contained' onPress={() => { this.clearText() }}>Clear</Button>
          </View>
        </View>

        <Dropdown
          label='Page size'
          data={data}
          // pickerStyle={}
          value={this.state.pageSize}
          onChangeText={value => {
            this.setState({ pageSize: value })
          }}
        />

        <View style={styles.dataTableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines={4}
              >OptionId</DataTable.Title>
              <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines={4}
              >CompanyId</DataTable.Title>
              <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines={2}
              >Cost</DataTable.Title>
              <DataTable.Title numeric
                sortDirection='ascending'
                numberOfLines={2}
              >Audience Reach</DataTable.Title>
              <DataTable.Title
                sortDirection='ascending'
                numberOfLines={3}
              >Ad Type</DataTable.Title>
            </DataTable.Header>

            {!this.state.loaded && (
              <ActivityIndicator size="large" color="black"></ActivityIndicator>
            )}

            {this.state.error && (
              <Text style={styles.err}>{this.state.error}</Text>
            )}

            <View style={styles.dataTableContent}>
              <ScrollView>
                {this.state.results && this.state.results.length > 0 && (this.state.results.map((result, i) => (
                  <DataTable.Row key={i}>
                    <DataTable.Cell numeric>{result.optionid}</DataTable.Cell>
                    <DataTable.Cell numeric>{result.companyid}</DataTable.Cell>
                    <DataTable.Cell numeric>{result.cost}</DataTable.Cell>
                    <DataTable.Cell numeric>{result.audiencereach}</DataTable.Cell>
                    <DataTable.Cell>{result.adtype}</DataTable.Cell>
                  </DataTable.Row>
                )))}
              </ScrollView>
            </View>

            {this.state.rowCount && (
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
  filterContainer: {
    height: 150,
    width: "100%",
    //marginTop: "5%",
    borderColor: "rgb(0, 0, 0)",
    borderWidth: 1,
    backgroundColor: "#D7F1FF",
    flex: 2,
  },
  dataTableContainer: {
    flex: 6,
    width: "100%",
  },
  dataTableContent: {
    height: 300,
  },
  textInputContainer: {
    flexDirection: 'row',
    marginTop: "3%",
    alignItems: 'center',
    height: 40
  },
  filterText: {
    height: 30,
    fontSize: 20,
    marginLeft: "3%",
    marginTop: "3%",
    fontFamily: 'Montserrat-Regular',
  },
  bodyText: {
    fontSize: 17,
    fontFamily: 'Montserrat-Regular',
    marginTop: '5%',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    height: 40
  },
  icon: {
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
  err: {
    color: 'red',
    fontSize: 30,
    fontWeight: 'bold'
  }
});