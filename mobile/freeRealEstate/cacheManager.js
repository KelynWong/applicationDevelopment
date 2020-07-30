// cacheManager.js
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

//import { AsyncStorage } from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';

async function set(key, value){
    console.log("Cache Set!");
    // efqf.q; -> Script Crasher
    return await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function get(key, isJson = true){
    const item = await AsyncStorage.getItem(key);
    console.log("GETTING");
    console.log(JSON.parse(item));
    console.log("GETTING");
    return (isJson) ? JSON.parse(item) : item; // Return JSON if JSON, return item if item

    // return callback(item);
}

// Clears entire AsyncStorage libs.
async function clearAll(){
    return await AsyncStorage.clear();
}


// Not needed:
async function getAll(){
    const allKeys = await AsyncStorage.getAllKeys();
    const allValues = await AsyncStorage.multiGet(); //allValues is an array of string
    const result = {};
    allValues.forEach(([key, value]) => result[key] = JSON.parse(value))

    allValues.forEach(([key, value]) => result[key] = JSON.stringify(value))
    return result;
}

module.exports = {
    get,
    set,
    clearAll,
    getAll,
} 