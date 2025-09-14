import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, Button, SafeAreaView,
  ActivityIndicator, TextInput, FlatList, Image
} from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [keyword, setKeyword] = useState(0);
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [value, setValue] = useState(0);
  const requestOptions = {
    method: 'GET',
    headers: {
      'apikey': 'SPHc3GEDFW5DnDzDy8tLqKnJKmDk47Ay'
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=EUR`, requestOptions)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch:" + response.statusText);
        return response.json()
      })
      .then(data => setCurrencies(data.rates ?? {}))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  //  console.log(currencies);

  const convert = () => {
    const numeric = parseFloat(keyword);
    const newrate = numeric / currencies[currency]
    console.log(currencies[currency])
    setValue(newrate.toFixed(2));
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'flex-end', backgroundColor: 'white', paddingBottom: 0, marginBottom: 0, marginEnd:0, paddingEnd: 0 }}>
        <Image
          style={{ width: 300, aspectRatio: 1, resizeMode: 'contain', marginBottom: 0 }}
          source={{ uri: "https://cdn.skuola.net/news_foto/2011/euri.jpg" }}
        />
      </View>
      <View style={{justifyContent: 'flex-start', backgroundColor: 'white'}}>
        <Text style={{ fontSize: 24, marginBottom: 0, marginTop: 0 }}>{value} €</Text>
        {loading && <ActivityIndicator size="large" />}
      </View>


      <View style={{  textDecorationLine: 'underline', flexDirection: 'row', 
        marginLeft: 100, backgroundColor: 'white'}}>
        <TextInput
          style={{ fontSize: 18, borderRadius: 6 }}
          placeholder='Amount'
          keyboardType="decimal-pad"
          value={keyword}
          onChangeText={text => setKeyword(text)}
        />

        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
          style={styles.picker}
          mode='dropdown'
        >
          {Object.keys(currencies).map((cur) => (
            <Picker.Item key={cur} label={cur} value={cur} />
          ))}
        </Picker>
      </View>

      <View  style={{flex: 1}}>
        <Button title="CONVERT" onPress={convert} />
      </View>


      <StatusBar />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  picker: {
    height: 200,
    width: 140,
    marginRight: 100,
  },
});
