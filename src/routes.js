import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import Home   from './pages/home';
import Search from './pages/search'
import Watch from './pages/watch';
import Video from './pages/video';
import CineWatch from './pages/cineWatch';
import CineWatchVideo from './pages/cineWatch-video';
import Profile from './pages/profile';
import Login from './pages/login';
import SignUp from './pages/sign-up';


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/search/" element={<Home />} />
                <Route path="/search/:content" element={<Search />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/watch-play/:id" element={<Video />} />
                <Route path="/cinewatch/:id" element={<CineWatch />} />
                <Route path="/cinewatch-play/:id" element={<CineWatchVideo />} />
                <Route path="/profile/" element={<Profile />} />
                <Route path="/login/" element={<Login />} />
                <Route path="/sign-up/" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    )
}