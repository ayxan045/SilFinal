import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../../Pages/Home/Home";
import Categories from "../../Pages/Categories/Categories"
function Routing(props) {
    return (
        <Switch>
            <Route exact path={`/`} component={Home} />
            <Route exact path={`/categories`} component={Categories} />
            <Redirect to="/" />
            <Route path="/">
                <p className="flex all-center h-100vh">Not found</p>
            </Route>
        </Switch>
    );
}


export default Routing;
