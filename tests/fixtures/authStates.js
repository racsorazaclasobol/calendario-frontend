export const initialState = { 
    status: 'checking', //* 'authenticated', 'non-authenticated'
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = { 
    status: 'authenticated', //* 'checking', 'non-authenticated'
    user: {
        uid: 'ABC',
        name: 'Oscar'
    },
    errorMessage: undefined,
}

export const notAuthenticatedState = { 
    status: 'non-authenticated', //* 'checking', 'authenticated'
    user: {},
    errorMessage: undefined,
}