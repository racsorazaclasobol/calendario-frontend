import { authSlice, onChecking, onClearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { initialState, authenticatedState, notAuthenticatedState } from "../../fixtures/authStates"
import { testUserCredentials } from "../../fixtures/testUser";

describe('Pruebas en authSlice', () => { 
    
    test('Debe de regresar el estado inicial', () => { 
        
        expect( authSlice.getInitialState() ).toEqual( initialState );

    });

    test('Debe de realizar un login', () => { 

        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );
        expect( state ).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })       

     })

    test('Debe de realizar un logout', () => { 

    const errorMessage = 'Credenciales no válidas';
    const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );      
    
    expect( state ).toEqual({
        status: 'non-authenticated',
        user: {},
        errorMessage: errorMessage
    })
    })

    test('Debe de limpiar el mensaje de error', () => { 
        
        const errorMessage = 'Credenciales no válidas';
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) );      

        const newState = authSlice.reducer( state, onClearErrorMessage() );

        expect( newState.errorMessage ).toBe( undefined )

     })

    test('Debe mostrar los valores del onChecking', () => { 
    
        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );

        const newState = authSlice.reducer( state, onChecking() );

        expect( newState ).toEqual( {
            status: 'checking',
            user: {},
            errorMessage: undefined,
        } );

    })

 })