//import { AsyncStorage } from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';

async function set(key, value){
    return await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function get(key, isJson = true){
    const item = await AsyncStorage.getItem(key);
    return (isJson) ? JSON.parse(item) : item;
}

async function clearAll(){
    const allKeys = await AsyncStorage.getAllKeys();
    return await AsyncStorage.multiRemove(keys)
}

async function getAll(){
    const allKeys = await AsyncStorage.getAllKeys();
    const allValues = await AsyncStorage.multiGet(); //allValues is an array of string
    const result = {};
    allValues.forEach(([key, value]) => result[key] = JSON.stringify(value))
    return result;
}

module.exports = {
    get,
    set,
    clearAll,
    getAll,
} 