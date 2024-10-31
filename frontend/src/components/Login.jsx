import { Formik, Form, Field } from 'formik';

function Login() {
    console.log(1);
    return (
        <div>
            <h1>Login</h1>
            <Formik
            initialValues={{username: '',password: ''}}>
                <Form>
                    <label htmlFor='username'>Username</label>
                    <Field id='username' name='username' placeholder="Username" />

                    <label htmlFor='password'>Password</label>
                    <Field id='password' name='password' type='password' placeholder='Password' />

                    <button type='submit'>Submit</button>
                </Form>
            </Formik>
        </div>
    )
};
export default Login;