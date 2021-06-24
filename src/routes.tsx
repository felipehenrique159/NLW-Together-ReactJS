import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewRoom from './pages/NewRoom'
import Room from './pages/Room'
import AdminRoom from './pages/AdminRoom'

import { AuthContextProvider } from './contexts/AuthContext'


export default function Routes() {

    return (
        <BrowserRouter>
            <AuthContextProvider>
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/rooms/new" component={NewRoom} exact />
                    <Route path="/rooms/:id" component={Room} exact/>
                    <Route path="/admin/rooms/:id" component={AdminRoom} exact/>
                </Switch>
            </AuthContextProvider>
        </BrowserRouter>
    )
}