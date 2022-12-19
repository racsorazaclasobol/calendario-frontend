export const events = [
    {
        id: '1',
        title: 'Cumpleaños Cami',
        notes: 'Hay que saludar a Cami',
        start: new Date('2022-12-20 15:00:00'),
        end: new Date('2022-12-20 18:00:00'),
    },

    {
        id: '2',
        title: 'Cumpleaños Maria',
        notes: 'Hay que saludar a Maria',
        start: new Date('2022-12-20 15:00:00'),
        end: new Date('2022-12-20 18:00:00'),
    }
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
};

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null
};

export const calendarWithActiveEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] }
}