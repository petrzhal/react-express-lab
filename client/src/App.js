import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ExhibitionList from './components/ExhibitionList';
import ExhibitList from './components/ExhibitList';
import HallList from './components/HallList';
import EditExhibition from './components/EditExhibition';
import EditExhibit from './components/EditExhibit';
import EditHall from './components/EditHall';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exhibits" element={<ExhibitList />} />
          <Route path="/halls" element={<HallList />} />
          <Route path="/exhibitions" element={<ExhibitionList />} />
          <Route path="/exhibitions/add" element={<EditExhibition />} />
          <Route path="/exhibitions/edit/:id" element={<EditExhibition />} />
          <Route path="/exhibitions/:id" element={<EditExhibition />} />
          <Route path="/exhibits/edit/:id" element={<EditExhibit />} />
          <Route path="/exhibits/add" element={<EditExhibit />} />
          <Route path="/exhibits/:id" element={<EditExhibit />} />
          <Route path="/halls/edit/:id" element={<EditHall />} />
          <Route path="/halls/add" element={<EditHall />} />
          <Route path="/halls/:id" element={<EditHall />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
