import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route } from 'react-router-dom'

import IndexPage from './pages/IndexPage';

import theme from './theme';

ReactDOM.render(
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      { /* A default title for the page which can be overridden by specific pages. */ }
      <Helmet><title>Lecture Capture Preferences</title></Helmet>
      <CssBaseline />
      <Route exact={true} path="/" component={IndexPage} />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('app')
);
