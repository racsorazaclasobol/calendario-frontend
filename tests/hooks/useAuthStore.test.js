import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { calendarApi } from "../../src/api";
import { useAuthStore } from "../../src/hooks";
import { authSlice } from "../../src/store";
import { initialState, notAuthenticatedState } from '../fixtures/authStates'
import { testUserCredentials } from '../fixtures/testUser'

describe('Pruebas en el useAuthStore', () => { 

    const getMockStore = ( initialState ) => {
        
        return configureStore({ 
            reducer: {
                auth: authSlice.reducer
            },
            preloadedState: {
                auth: { ...initialState }
            }
        });
    }

    beforeEach( () => localStorage.clear() ); //Antes de ejecutar cualquier cosa, ejecuta esto
    
    test('Debe de regresar los valores por defecto', () => { 

        const mockStore = getMockStore({
            status: 'checking', //* 'authenticated', 'non-authenticated'
            user: {},
            errorMessage: undefined,
        });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } > { children } </Provider>
        } );

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        })
    })

    test('startLogin debe de realizar el login correctamente', async() => {

        const mockStore = getMockStore({ notAuthenticatedState });
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async() => {
            await result.current.startLogin( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;

        expect({ status, user, errorMessage }).toEqual({ 
            status: 'authenticated',
            user: { name: 'Test User', uid: '63a9c2ea45f819d8a760da85' },
            errorMessage: undefined,
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );

    });

    test('startLogin debe de fallar la autenticacion', async() => {

        const mockStore = getMockStore({ notAuthenticatedState });
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async() => {
            await result.current.startLogin({ email:'asdasdas@gmail.com', password:'asdasdas' });
        });

        const { errorMessage, status, user } = result.current;

        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'non-authenticated',
            user: {}
        });

        await waitFor( () => expect( result.current.errorMessage ).toBe( undefined ) )

    })

    test('startRegister debe de crear un usuario', async() => {

        const newUser = { name: 'Test User 2', email: 'algo@gmail.com', password: '123456'  };

        const mockStore = getMockStore({ notAuthenticatedState });
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        //Lo siguiente se agrega en el curso: 451 - startRegister debe de crear un usuario
        // Lo siguiente es para que no ejecute fisicamente el registro, sino que lo simula
        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data:{
                ok: true,
                uid: '123456789',
                name: 'Test User 2',
                token: 'daksdlasad564d6a4sd6a54asasda56s5'
            }
        })

        await act( async() => {
            await result.current.startRegister( newUser );
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User 2', uid: '123456789' }            
        });

        spy.mockRestore(); //Limpiamos el espia

    });

    test('startRegister debe de fallar', async() => {

        const mockStore = getMockStore({ notAuthenticatedState });
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async() => {
            await result.current.startRegister( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'El usuario ya existe.',
            status: 'non-authenticated',
            user: {}            
        });

    });

    test('checkAuthToken debe de ejecutar el logout si no hay un tocken', async() => {

        const mockStore = getMockStore({ ...initialState });
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'non-authenticated',
            user: {}
        });

    });

    test('checkAuthToken debe de autenticar el usuario si hay un token', async() => {

        const { data } = await calendarApi.post( '/auth', testUserCredentials );
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '63a9c2ea45f819d8a760da85' }
          });

    });

    test('checkAuthToken debe de limpiar el localStorage y hacer logout con el token expirado', async() => {

        const tokenExpirado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MzkxMGRhNGQ0OWIwMzllNjc2N2U4ODkiLCJuYW1lIjoiTWFyaW8iLCJpYXQiOjE2NzA0NTA1OTcsImV4cCI6MTY3MDQ1Nzc5N30.MBKiZzT-j1VNTiv3iDs3hQSw3cEXlW9DbeJjOeSBPC4';
        localStorage.setItem('token', tokenExpirado);

        const mockStore = getMockStore({ ...initialState });
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            status: 'non-authenticated',
            user: {},
            errorMessage: undefined,
        });

        expect( localStorage.getItem('token') ).toBe( null );

    });

    

})