import { useCalendarStore, useUiStore } from '../../hooks'

export const FabAddNew = () => {

    const { openDateModal } = useUiStore();
    const { setActiveEvent, onNewEmptyActiveEvent } = useCalendarStore();

    const onOpenNewModal = () => {
        onNewEmptyActiveEvent();
        openDateModal();

    }

  return (
    <button className='btn btn-primary fab' onClick={ onOpenNewModal }>
        <i className='fas fa-plus'>  </i>
    </button>
  )
}
