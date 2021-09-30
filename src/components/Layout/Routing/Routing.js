import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../../Pages/Home/Home";
import Categories from "../../Pages/Categories/Categories"
import Tables from "../../Pages/Tables/Tables";
import Persons from "../../Pages/Persons/Persons";
function Routing(props) {
    return (
        <Switch>
            <Route exact path={`/`} component={Home} />
            <Route exact path={`/categories`} component={Categories} />
            <Route exact path={`/tables`} component={Tables} />
            <Route exact path={`/persons`} component={Persons} />
            <Redirect to="/" />
            <Route path="/">
                <p className="flex all-center h-100vh">Not found</p>
            </Route>
        </Switch>
    );
}


export default Routing;
