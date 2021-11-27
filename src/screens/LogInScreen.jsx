import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,
} from 'react-native';

import firebase from 'firebase';
import Button from '../components/Button';

export default function LogInScreen(props) {
  const { navigation } = props;
  // email=保持したい値 setEmail=値を更新する関数 ''=初期値
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 画面が描写された後に実行される
  // props が変更されるたびに走る
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MemoList' }],
        });
      }
    });
    return unsubscribe; // ログインスクリーンがアンマウントされる瞬間監視状態がキャンセルされる。ちょっとむずかしい。
  }, []); // 第2引数の配列をいれると画面表示された瞬間だけ実行してくれる
  function handlePress() {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const { user } = userCredential;
        console.log(user.uid);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MemoList' }],
        });
      }).catch((error) => {
        console.log(error.code, error.message);
        Alert.alert(error.code);
      });
  }
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>
          Log In
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text); }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email Address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => { setPassword(text); }}
          autoCapitalize="none"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />

        <Button
          label="Submit"
          onPress={handlePress}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Not registerd?</Text>
          <TouchableOpacity onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignUp' }],
            });
          }}
          >
            <Text
              style={styles.footerLink}
            >
              Sign up here!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 27,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
  },
  footerLink: {
    fontSize: 14,
    lineHeight: 24,
    color: '#467fd3',
  },
  footer: {
    flexDirection: 'row',
  },

});
