import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { useAuthState } from './context/AuthContext'
import { changeColor } from './utils/constants'

import Header from './components/Header'

import Home from './pages/Home'
import Market from './pages/Market'
import Staking from './pages/Staking'

import './App.css'
import 'react-toastify/dist/ReactToastify.min.css'
import Presale from './pages/Presale'

function App() {
    const { authState } = useAuthState()

    useEffect(() => {
        changeColor('--toastify-color-light', '#212121')
        changeColor('--toastify-text-color-light', '#fff')
    }, [authState.preferDark])

    return (
        <>
            <ToastContainer autoClose={3000} />

            <div className='main__header'>
                <Header />
            </div>

            <div className='main__background'>
                <div></div>
                <div></div>
            </div>

            {/* <div class="relative z-50 py-2 overflow-hidden text-black bg-yellow-400 bg-yellow">
                <div class="flex w-full space-x-8 animate-marquee ">
                    <p class="whitespace-nowrap">🚀Join Remittix's 100x Moonshot ICO Today And Secure 30% Bonus when you use code: <strong>RTX30P</strong></p>
                    <p class="whitespace-nowrap">🚀Join Remittix's 100x Moonshot ICO Today And Secure 30% Bonus when you use code: <strong>RTX30P</strong></p>
                </div>
            </div> */}

            <div className='main__content'>
                <div class="header_margin_range">
                </div>
                <marquee class="main__marquee" direction="left" scrollamount="20">
                    🚀Join Remittix's 100x Moonshot ICO Today And Secure 30% Bonus when you use code: <strong>RTX30P</strong>
                    🚀Join Remittix's 100x Moonshot ICO Today And Secure 30% Bonus when you use code: <strong>RTX30P</strong>
                </marquee>                    
                <Presale></Presale>
                {/* <Routes> */}
                {/* <Route path="/" element={<Presale />}></Route> */}
                {/* <Route path="/" element={<Home />}></Route> */}
                {/* <Route path="/dashboard" element={<Market />}></Route> */}
                {/* <Route path="/protect" element={<Staking />}></Route> */}
                {/* <Route path="/presale" element={<Presale />}></Route>  */}
                {/* <Route path="/mint" element={<Mint />}></Route> */}
                {/* <Route path="/earn" element={<Earn />}></Route> */}
                {/* </Routes> */}
            </div>
        </>
    )
}

export default App
