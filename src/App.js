import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import AppHome from "./AppComponents/AppHome";

function App() {
  
    return (
      //App to be wrapped in order to use Link from react-router-dom 
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* <Route exact path='/' element={<Home />} ></Route> */}
            <Route exact path='/' element={<AppHome />} ></Route>
            <Route exact path='*' element={'Pagenotfound'} ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
  
  export default App;
  