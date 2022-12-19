import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogOutCalendar, onUpdateEvent, setActiveEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventsState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en Calendar Slice', () => { 
    
    test('Debe de regresar el estado por defecto', () => { 
        
        const state = calendarSlice.getInitialState();

        expect( state ).toEqual( initialState );

     });

     test('onSetActiveEvent debe de actucar el evento', () => { 
        
        const state = calendarSlice.reducer( calendarWithEventsState, setActiveEvent( events[0] ) );

        expect( state.activeEvent ).toEqual( events[0] );

     });

     test('onAddNewEvent debe de agregar el evento', () => { 
        
        const newEvent = {
            id: '3',
            title: 'Cumpleaños Oscar',
            notes: 'Hay que saludar a Oscar',
            start: new Date('2022-12-20 15:00:00'),
            end: new Date('2022-12-20 18:00:00'),
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );

        expect( state.events ).toEqual( [ ...events, newEvent ] );

     });

     test('onUpdateEvent debe de actualizar el evento', () => { 
        
        const updatedEvent = {
            id: '1',
            title: 'Cumpleaños Oscar',
            notes: 'Hay que saludar a Oscar',
            start: new Date('2022-12-20 15:00:00'),
            end: new Date('2022-12-20 18:00:00'),
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );

        expect( state.events ).toContain( updatedEvent )

     });

    test('onDeleteEvent debe de borrar el evento activo', () => { 

        const state = calendarSlice.reducer( calendarWithActiveEventsState, onDeleteEvent() );

        expect( state.activeEvent ).toBeNull();
        expect( state.events ).not.toContain( events[0] );


    });

    test('onLoadEvent debe de establecer los eventos', () => { 
        
        const state = calendarSlice.reducer( initialState, onLoadEvents( [ ...events ] ) );

        expect( state.events ).toEqual( [ ...events ] )
        expect( state.isLoadingEvents ).toBe( false )
        
    });

    test('onLogOutCalendar debe de limpiar los estados', () => { 

        const state = calendarSlice.reducer( calendarWithActiveEventsState, onLogOutCalendar() );

        expect( state ).toEqual( initialState );
    
    })


 })