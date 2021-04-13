import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react'
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';

interface registerProps {

}
const REGISTER_MUTATION = `
mutation Register($username:String!, $password:String!){
    register(input: { username: $username, password: $password }) {
      errors {
        field
        msg
      }
      user {
        id
        username
      }
    }
  }`;

export const register: React.FC<registerProps> = (props) => {
    const [,register] = useMutation(REGISTER_MUTATION);
        return (
            <Wrapper variant='small'>
            <Formik 
                initialValues={{username: "", password: ""}}
                onSubmit={(values) => {
                    register(values);
                }}>
                {(props)=> (
                    <Form>
                        <InputField name='username' placeholder='username' label='Username'/>
                        <Box mt={4}>
                            <InputField name='password' placeholder='password' label='Password' type='password'/>
                        </Box>
                        <Button mt={2} colorScheme="green" isLoading={props.isSubmitting} type="submit">register</Button>
                    </Form>
                )}
            </Formik>            
            </Wrapper>
        );
}

export default register;