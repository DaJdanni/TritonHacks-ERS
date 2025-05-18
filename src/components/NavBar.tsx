import React from 'react'
import {ImgButton} from './Button'
import userData from '../api/MapData'

const NavBar: React.FC = React.memo(() => {

    const [expanded, setExpanded] = React.useState(false);

    const expandNavBar = () => {
        console.log(userData.getUserLocation());
        setExpanded(!expanded);
    }

    return (
        <>
        {expanded ? (
            <nav className='z-8 fixed left-0 top-0 p-2 h-4/12 w-screen lg:h-screen lg:w-3/10 bg-palette-brown flex flex-col items-start lg:items-end'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="size-24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

            <ImgButton styling='fixed h-24 w-24 bg-gray-800 opacity-0' imageName='Expandable.png' callback={expandNavBar} ></ImgButton>
            </nav>
        ) : (
            <nav className='z-8 fixed left-0 top-0 p-2 h-1/12 w-screen lg:h-screen lg:w-1/12 bg-palette-brown flex flex-col items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="size-24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <ImgButton styling='fixed h-24 w-24 opacity-0' imageName='Expandable.png' callback={expandNavBar} ></ImgButton>
            </nav>
        )}
        </>

    )
});

export default NavBar;
