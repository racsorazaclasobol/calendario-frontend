import { useCalendarStore } from "../../hooks"


export const FabDelete = () => {

    const { startDeletingEvent, hasEventSelected } = useCalendarStore();

    const onDeleteModal = () => {
        startDeletingEvent();
    }


    return (
        <button className='btn btn-danger fab-danger' onClick={ onDeleteModal } style={{ display: (hasEventSelected) ? '' : 'none' }} >
            <i className='fas fa-trash-alt'>  </i>
        </button>
    )
}
