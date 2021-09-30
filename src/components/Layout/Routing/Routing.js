import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../../Pages/Home/Home";
import Common from "../../Pages/Common/Common";
import {routes} from "../../../services/api-routes";

function Routing(props) {

    return (
        <Switch>
            <Route exact path={`/`} component={Home} />
            {routes.admin.map((r, i)=> (
                <Route key={i} exact path={`/${r.url}`} >
                    <Common url={r.url} name={r.name} label={r.label}/>
                </Route>
            ))}
            <Redirect to="/" />
            <Route path="/">
                <p className="flex all-center h-100vh">Not found</p>
            </Route>
        </Switch>
    );
}


export default Routing;
