import { addHours } from "date-fns";
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onUpdateEvent, setActiveEvent } from "../store/calendar/calendarSlice";

const emptyEvent = { title: '', notes: '', start: new Date(), end: addHours( new Date(), 2), bgColor: '#fafafa', user: { _id: '123', name: 'Oscar' } }

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
	const { user } = useSelector( state => state.auth );
    
    const onSetActiveEvent = ( calendarEvent ) => {
        dispatch( setActiveEvent( calendarEvent ) );
    }

    const onNewEmptyActiveEvent = () => {

        dispatch( setActiveEvent( emptyEvent ) );
    }

    const startSavingEvent = async( calendarEvent ) => {

		try {
			
			if ( calendarEvent.id ) {
				//Actualizar
			  	await calendarApi.put( `/events/update/${ calendarEvent.id }`, calendarEvent );
				dispatch ( onUpdateEvent({ ...calendarEvent, user }) );
				return;  
			} 
			
			//Insertar
			const { data } = await calendarApi.post('/events/new', calendarEvent);
			dispatch( onAddNewEvent( { ...calendarEvent, id: data.evento.id, user } ) );
			
		} catch (error) {
			Swal.fire('Error al guardar', error.response.data?.msg, 'error');
			console.log(error)
		}
	}

	const startDeletingEvent = async() => {
		
		try {

			if ( activeEvent ){

				await calendarApi.delete(`/events/delete/${ activeEvent.id }`); 
				dispatch( onDeleteEvent() );
				return;

			}

		} catch (error) {	
			Swal.fire('Error al eliminar', error.response.data?.msg, 'error');
			console.log(error)
		}
		
	}

  const startLoadingEvents = async () => {

	try {

		const { data } = await calendarApi.get('/events/events');
		const events = convertEventsToDateEvents( data.eventos );

		dispatch( onLoadEvents( events ) );
	
	} catch (error) {
		console.log('Error cargando eventos')
		console.log(error)
	}


  }

    
  return {
    // Propiedades y Objetos
    events,
    activeEvent,
	  hasEventSelected: !!activeEvent,

    //Metodos
    onSetActiveEvent,
    onNewEmptyActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  }
}
