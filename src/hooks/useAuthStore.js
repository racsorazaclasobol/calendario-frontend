import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { onChecking, onClearErrorMessage, onLogin, onLogout, onLogOutCalendar } from "../store";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth )
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {

        dispatch( onChecking() );

        try {

            const { data } = await calendarApi.post('/auth', { email, password });

            localStorage.setItem( 'token', data.token );
            localStorage.setItem( 'token-init-date', new Date().getDate() );

            dispatch( onLogin( { name: data.name, uid: data.uid } ) );
                        

        } catch (error) {
            dispatch( onLogout('Credenciales Incorrectas') );
            setTimeout(() => {
                dispatch( onClearErrorMessage() );
            }, 10);
        }
    }

    const startRegister = async ( { name, email, password } ) => {

        dispatch( onChecking() );

        try {

            const { data } = await calendarApi.post( '/auth/new', { name, email, password } );
            
            const { token, name: userName, uid } = data;


            localStorage.setItem( 'token', token );
            localStorage.setItem( 'token-init-date', new Date().getDate() );

            dispatch( onLogin( { name: name, uid: uid } ) );
            
        } catch ( error ) {
            dispatch( onLogout( error.response.data?.msg || 'Error en el registro.' ) );
            setTimeout(() => {
                dispatch( onClearErrorMessage() );
            }, 10);
            localStorage.clear();
        }
    }

    const checkAuthToken = async () => {

        const token = localStorage.getItem('token');

        if ( !token ) {
            dispatch( onLogout() );
        }

        try {

            const { data } = await calendarApi( '/auth/renew' );

            localStorage.setItem( 'token', data.token );
            localStorage.setItem( 'token-init-date', new Date().getDate() );

            dispatch( onLogin( { name: data.name, uid: data.uid } ) );
            
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();

        dispatch( onLogOutCalendar() );
        dispatch( onLogout() );
    }


    return {
        //* Propiedades
        status, 
        user, 
        errorMessage,

        //* Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }

}