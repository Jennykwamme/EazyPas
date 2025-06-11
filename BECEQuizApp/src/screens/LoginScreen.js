
import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios'; // Direct axios usage for now, will refactor to api service later
import { BECE_API_BASE_URL } from '../config'; // Assuming a config file for base URL

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short').required('Required'),
});

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError('');
          try {
            // const response = await api.post('/auth/login', values); // Ideal: using api service
            const response = await axios.post(`${BECE_API_BASE_URL}/auth/login`, values);
            const { token, ...userDetails } = response.data;
            await login(token, userDetails); // login from AuthContext
            // Navigation to main app is handled by AppNavigator based on userToken
          } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
              setError(err.response.data.message);
            } else {
              setError('Login failed. Please try again.');
            }
            console.error('Login error:', err);
          }
          setSubmitting(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <TextInput
              label="Email"
              mode="outlined"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <HelperText type="error" visible={touched.email && !!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Password"
              mode="outlined"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              style={styles.input}
            />
            <HelperText type="error" visible={touched.password && !!errors.password}>
              {errors.password}
            </HelperText>

            {error ? <HelperText type="error" visible={!!error} style={styles.apiError}>{error}</HelperText> : null}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Login
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 2,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue', // Or your theme's primary color
  },
  apiError: {
    textAlign: 'center',
    fontSize: 14,
  }
});
