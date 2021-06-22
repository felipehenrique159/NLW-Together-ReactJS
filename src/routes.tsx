import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewRoom from './pages/NewRoom'
import { AuthContextProvider } from './contexts/AuthContext'


export default function Routes() {

    return (
        <BrowserRouter>
            <AuthContextProvider>
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/roons/new" component={NewRoom} exact />
                </Switch>
            </AuthContextProvider>
        </BrowserRouter>
    )
}