import React from 'react'
import HomeComponent from '../components/home/Home';
import { HomeContextProvider } from '../context/HomeContext';

function HomeElement() {
    return (
        <HomeContextProvider>
            <HomeComponent />
        </HomeContextProvider>
    )
}

export default HomeElement