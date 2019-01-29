import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route } from 'react-router-dom'

import { ProfileProvider } from './providers/ProfileProvider';

import IndexPage from './pages/IndexPage';
import NewPreferencePage from './pages/NewPreferencePage';
import UserPreferencePage from './pages/UserPreferencePage';

import theme from './theme';

ReactDOM.render(
  <ProfileProvider>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        { /* A default title for the page which can be overridden by specific pages. */ }
        <Helmet><title>Lecture Capture Preferences</title></Helmet>
        <CssBaseline />
        <Route exact={true} path="/" component={IndexPage} />
        <Route exact={true} path="/preferences/new" component={NewPreferencePage} />
        <Route exact={true} path="/preferences/user/:user" component={UserPreferencePage} />
      </MuiThemeProvider>
    </BrowserRouter>
  </ProfileProvider>,
  document.getElementById('app')
);
