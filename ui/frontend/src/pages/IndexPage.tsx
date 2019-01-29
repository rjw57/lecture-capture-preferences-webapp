import * as React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PagePaper from '../components/PagePaper';
import Spacer from '../components/Spacer';

import Page from './Page';

/**
 * The index page for the web application. Upon mount, it fetches a list of the latest media items
 * and shows them to the user.
 */
const IndexPage = () => (
  <Page>
    <PagePaper>
      <Typography variant="h4" gutterBottom={true}>
        Lecture Capture Preferences
      </Typography>
      <Typography variant="body1" gutterBottom={true}>
        This site allows those giving lectures in the University of Cambridge to
        opt-in to having their lectures be captured for the benefit of students.
      </Typography>
      <Typography variant="caption" gutterBottom={true}>
        Captured lectures are normally only available to students enrolled on the
        appropriate course.
      </Typography>
      <Spacer />
      <Grid container={true} spacing={16} justify="flex-end">
        <Grid item={true} xs={12} sm={4}>
          <Button
            component="a" href="/preferences/new" fullWidth={true}
            color="primary" size="large" variant="outlined"
          >
            Proceed
          </Button>
        </Grid>
      </Grid>
    </PagePaper>
  </Page>
);

export default IndexPage;
