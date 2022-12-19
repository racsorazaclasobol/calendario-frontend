import { createSlice } from '@reduxjs/toolkit'

// import { addHours } from 'date-fns'

// const tempEvent = {
//     _id: new Date().getTime(),
//     title: 'Cumpleaños Cami',
// 	notes: 'Hay que saludar a Cami',
// 	start: new Date(),
// 	end: addHours( new Date(), 2),
// 	bgColor: '#fafafa',
// 	user: {
// 		_id: '123',
// 		name: 'Oscar'
// 	}
// }


export const calendarSlice = createSlice({
   name: 'calendar',
   initialState: { 
        isLoadingEvents: true,
        events: [ 
            // tempEvent 
        ],
        activeEvent: null,
    },
   reducers: {
        setActiveEvent: ( state, { payload } ) => {
            
            state.activeEvent = payload
        
        },
        onAddNewEvent: ( state, { payload } ) => {
            state.events.push( payload );
            state.activeEvent = null;
        },
        onUpdateEvent: ( state, { payload } ) => {

            state.events = state.events.map( event => {
                if( event.id === payload.id ){
                    return payload;
                }
                return event;
            } );
            state.activeEvent = null;
        },
        onDeleteEvent: ( state, { payload } ) => {
            state.isLoadingEvents = false;
            if( state.activeEvent ) {
                state.events = state.events.filter( event => event.id !== state.activeEvent.id );
                state.activeEvent = null;    
            }
        },
        onLoadEvents: ( state, { payload = [] } ) => {
            state.isLoadingEvents = false,
            payload.forEach(event => {
                const existe = state.events.some( eventState => eventState.id === event.id );
                if( !existe ) {
                    state.events.push( event );
                }
            });
        },
        onLogOutCalendar: ( state ) => {
            state.isLoadingEvents = true;
            state.events = [];
            state.activeEvent = null;
        }
    },
})

export const { 
    setActiveEvent, 
    onAddNewEvent, 
    onUpdateEvent, 
    onDeleteEvent, 
    onLoadEvents,
    onLogOutCalendar, 
} = calendarSlice.actions