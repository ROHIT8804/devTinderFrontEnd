import { createSlice } from '@reduxjs/toolkit';

const requestSlice = createSlice({
    name: 'request',
    initialState: null,
    reducers:{
        setRequest: (state, action)=>{
            return action.payload;
        },
        clearRequest: (state) =>{
            return null;
        }
    }
})

export const { setRequest, clearRequest } = requestSlice.actions;
export default requestSlice.reducer;