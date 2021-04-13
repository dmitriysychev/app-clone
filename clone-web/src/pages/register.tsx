import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';

interface registerProps {

}

export const register: React.FC<registerProps> = (props) => {
        return (
            <Wrapper variant='small'>
            <Formik 
                initialValues={{username: "", password: ""}}
                onSubmit={(values) => {
                    console.log(values);
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