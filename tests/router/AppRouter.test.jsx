import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { AppRouter } from '../../src/router/AppRouter';
import { CalendarPage } from '../../src/calendar/Pages/CalendarPage'


jest.mock('../../src/hooks/useAuthStore');

//En este caso, para renderizar la pagina del calendario, este posee muchos hooks, asi que se realiza lo siguiente, 
//para no hacer tantos mooks. Clase: 457
jest.mock('../../src/calendar/Pages/CalendarPage', () => ({
    CalendarPage: () => <h1>Calendar Page</h1>
}));



describe('Pruebas en AppRouter', () => {

    const mockCheckAuthToken = jest.fn();
    beforeEach( () => jest.clearAllMocks() );

    test('Debe de mostrar la pantalla de carga y llamar checkAuthToken', () => { 

        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken,
        });

        render( <AppRouter /> );

        expect( screen.getByText('Cargando...') ).toBeTruthy();
        expect( mockCheckAuthToken ).toHaveBeenCalled();
        
    });

    test('Debe de mostrar el login en caso de no estar autenticado', () => { 

        useAuthStore.mockReturnValue({
            status: 'non-authenticated',
            checkAuthToken: mockCheckAuthToken,
        });

        const { container } = render( <MemoryRouter> <AppRouter /> </MemoryRouter> );

        expect( screen.getByText('Ingreso') ).toBeTruthy();
        expect( screen.getByText('Registro') ).toBeTruthy();
        expect( container ).toMatchSnapshot();
        
    });

    test('Debe de mostrar el calendario si estamos autenticado', () => { 

        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken,
        });

        render( <MemoryRouter> <AppRouter /> </MemoryRouter> );

        expect( screen.getByText('Calendar Page') ).toBeTruthy();
                
    });



});