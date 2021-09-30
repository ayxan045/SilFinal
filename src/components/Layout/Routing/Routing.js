import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../../Pages/Admin/Home/Home";

function Routing(props) {
    return (
        <Switch>
            <Route exact path={`/`} component={Home} />
            <Redirect to="/" />
            <Route path="/">
                <p className="flex all-center h-100vh">Not found</p>
            </Route>
        </Switch>
    );
}


export default Routing;
