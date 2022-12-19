import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { useUiStore } from "../../src/hooks";
import { uiSlice } from "../../src/store";

const getMockStore = ( initialState ) => {

    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })

}

describe('Pruebas en useUiStore', () => { 
    
    test('debe de regresar los valores por defecto', () => { 

        const mockStore = getMockStore({ isDateModalOpen: false }) 
        
        const { result } = renderHook( () => useUiStore(), { 
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>   
        } );

        expect( result.current ).toEqual({ 
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal:expect.any(Function)
         })
     });

    test('openDateModal debe de colocar en true el isDateModalOpen', () => { 
        
        const mockStore = getMockStore({ isDateModalOpen: false }) 
        
        const { result } = renderHook( () => useUiStore(), { 
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>   
        } );

        const { openDateModal } = result.current;

        //#region  Razon por la que se usa act
        /*
            Warning: An update to TestComponent inside a test was not wrapped in act(...).

            When testing, code that causes React state updates should be wrapped into act(...):

            act(() => {
            fire events that update state
            })
            assert on the output

         */
        //#endregion
        
        act( () => {
            openDateModal();
        } );

        expect( result.current.isDateModalOpen ).toBeTruthy();

    });

    test('closeDateModal Debe de colocar en false el isDateModalOpen', () => { 
        
        const mockStore = getMockStore({ isDateModalOpen: false }) 
        
        const { result } = renderHook( () => useUiStore(), { 
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>   
        } );

        const { closeDateModal, openDateModal } = result.current;

        //#region  Razon por la que se usa act
        /*
            Warning: An update to TestComponent inside a test was not wrapped in act(...).

            When testing, code that causes React state updates should be wrapped into act(...):

            act(() => {
            fire events that update state
            })
            assert on the output

         */
        //#endregion
        
        act( () => {
            openDateModal();
        } );
        expect( result.current.isDateModalOpen ).toBeTruthy();
        
        act( () => {
            closeDateModal();
        } );
        
        expect( result.current.isDateModalOpen ).toBeFalsy();

    });

    test('closeDateModal Debe de colocar en false el isDateModalOpen', () => { 
        
        const mockStore = getMockStore({ isDateModalOpen: true }) 
        
        const { result } = renderHook( () => useUiStore(), { 
            wrapper: ({ children }) => <Provider store={ mockStore }> { children } </Provider>   
        } );

        const { closeDateModal } = result.current;
        /*
            Warning: An update to TestComponent inside a test was not wrapped in act(...).

            When testing, code that causes React state updates should be wrapped into act(...):

            act(() => {
            fire events that update state
            })
            assert on the output

         */
        //#endregion
                
        act( () => {
            closeDateModal();
        } );
        
        expect( result.current.isDateModalOpen ).toBeFalsy();

    });

 })