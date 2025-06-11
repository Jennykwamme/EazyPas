
import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios'; // Direct axios usage for now
import { BECE_API_BASE_URL } from '../config'; // Assuming a config file

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

export default function SignUpScreen({ navigation }) {
  const { login } = useContext(AuthContext); // Use login to set token after successful registration
  const [error, setError] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError('');
            const { name, email, password } = values;
            try {
              // const response = await api.post('/auth/register', { name, email, password }); // Ideal
              const response = await axios.post(`${BECE_API_BASE_URL}/auth/register`, { name, email, password });
              const { token, ...userDetails } = response.data;
              await login(token, userDetails); // Log the user in directly
            } catch (err) {
              if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
              } else {
                setError('Sign up failed. Please try again.');
              }
              console.error('Sign up error:', err);
            }
            setSubmitting(false);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <>
              <TextInput
                label="Name"
                mode="outlined"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.name && !!errors.name}>
                {errors.name}
              </HelperText>

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

              <TextInput
                label="Confirm Password"
                mode="outlined"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry
                style={styles.input}
              />
              <HelperText type="error" visible={touched.confirmPassword && !!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>

              {error ? <HelperText type="error" visible={!!error} style={styles.apiError}>{error}</HelperText> : null}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Sign Up
              </Button>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
    color: 'blue',
  },
  apiError: {
    textAlign: 'center',
    fontSize: 14,
  }
});
