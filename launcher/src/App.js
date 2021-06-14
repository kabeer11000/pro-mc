import React, {memo} from "react";
// import {useOpenWeather} from 'react-open-weather';
import './App.css';
import Home from "./components/Home/Home";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
    // const {data, isLoading, errorMessage} = useOpenWeather({
    //     key: '4cf55dfa9a0ab63a939fffb8ae325498',
    //     lat: '1.2921',
    //     lon: '36.8219',
    //     lang: 'en',
    //     unit: 'metric', // values are (metric, standard, imperial)
    // });

    return (
        <div className='App'>
            <CssBaseline/>
            <Home/>
        </div>
    );
}

export default memo(App);
