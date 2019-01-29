import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
    root: {
      minHeight: '100vh',

      display: 'flex',
      flexDirection: 'column',
    },

    backgroundBanner: {
      backgroundColor: theme.palette.primary.main,
      height: '40vh',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100vw',
      zIndex: -1,  // to make sure it's behind the content
    },

    appBarRoot: {
      [theme.breakpoints.up('sm')]: {
        boxShadow: 'none',
      },
    },

    container: {
      flexGrow: 1,

      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
      },
    },

    content: {
      backgroundColor: theme.palette.background.paper,
      minHeight: '100%',
      width: '100%',

      [theme.breakpoints.up('sm')]: {
        backgroundColor: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing.unit * 5,
        maxWidth: theme.spacing.unit * 100,
        minHeight: 0,
      },
    },
})

interface IProps extends WithStyles<typeof styles> {
  /** child elements */
  children?: React.ReactNode;

  showLoadingIndicator?: boolean;
}

export const Page = withStyles(styles)(
  ({ children, classes, showLoadingIndicator } : IProps) =>
  <div className={ classes.root }>
    <div className={ classes.backgroundBanner } />
    <AppBar color="primary" position="static" classes={{ root: classes.appBarRoot }}>
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Lecture Capture Preferences
        </Typography>
      </Toolbar>
    </AppBar>
    <div className={ classes.container }>
      <div className={ classes.content }>
        { children }
      </div>
    </div>
  </div>
);

Page.defaultProps = {
  showLoadingIndicator: false,
};

export default Page;
