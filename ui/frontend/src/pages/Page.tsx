import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
    root: { /* no default styles */ },

    backgroundBanner: {
      backgroundColor: theme.palette.primary.main,
      height: '40vh',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100vw',
    },
})

interface IProps extends WithStyles<typeof styles> {
  /** child elements */
  children?: React.ReactNode
}

export const Page = withStyles(styles)(
  ({ children, classes } : IProps) => <div className={ classes.root }>
    <div className={ classes.backgroundBanner } />
    <AppBar color="primary">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Lecture Capture Preferences
        </Typography>
      </Toolbar>
    </AppBar>
    { children }
  </div>
);

export default Page;
