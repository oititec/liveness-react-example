import React from 'react';
import InsertAppKey from './insert-appkey';
import NavMenu from './nav-menu';

const Home = () => {
  return window.localStorage.getItem('appkey') ? <NavMenu /> : <InsertAppKey />;
};

export default Home;
