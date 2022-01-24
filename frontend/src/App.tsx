import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/Home";
import MedRecord from "./components/MecRec";
import NavBar from './components/Navbar';
import SignIn from "./components/SignIn";
import CreateMecRecord from "./components/CreateMecRec";

function App() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setToken(getToken);
    }
  }, []);

  if (!token) {
    return <SignIn />
  }

  return (
    <Router>
      <div>
        {token && (
          <Fragment>
            <NavBar />
            <Switch>
              <Route exact path="/Home"component={Home} />
              <Route exact path="/MedRecord"component={MedRecord} />
              <Route exact path="/CreateMecRecord"component={CreateMecRecord} />
            </Switch>
          </Fragment>
        )}
      </div>
    </Router>
  );
}

export default App;