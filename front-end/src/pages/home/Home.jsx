import React from 'react'
import HomeComponent from '../../components/home/Home';
import { HomeContextProvider } from '../../context/HomeContext';

function Home() {
    return (
        <HomeContextProvider>
            <HomeComponent />
        </HomeContextProvider>
    )
}

export default Home