import * as React from 'react';

import Paper from '@material-ui/core/Paper';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    ...theme.mixins.gutters(),

    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,

    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      boxShadow: 'none',
    },
  },
});

export interface IProps extends WithStyles<typeof styles> {
  showLoadingIndicator?: boolean;

  [x: string]: any;
};

export const PagePaper = withStyles(styles)(
  ({ classes, showLoadingIndicator, ...otherProps } : IProps) =>
  <Paper classes={{ root: classes.root }} {...otherProps} />
);

PagePaper.defaultProps = {
  showLoadingIndicator: false,
};

export default PagePaper;
