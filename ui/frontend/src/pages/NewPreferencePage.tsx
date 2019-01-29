import * as React from 'react';

import * as dateFormat from 'dateformat';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { IPreference, IProfile } from '../api';

import { ProfileConsumer } from '../providers/ProfileProvider';

import QueryPreferences from '../containers/QueryPreferences';
import UpdatePreference from '../containers/UpdatePreference';

import PagePaper from '../components/PagePaper';
import Spacer from '../components/Spacer';

import Page from './Page';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

const LoadingIndicator = () => <div style={{ width: '100%', textAlign: 'center' }}>
  <CircularProgress />
</div>;

/**
 * The index page for the web application. Upon mount, it fetches a list of the latest media items
 * and shows them to the user
 */
const NewPreferencePage = () => (
  <Page>
    <PagePaper>
      <ProfileConsumer>{
        profile => !profile ? <LoadingIndicator /> : <QueryPreferences query={{ user: profile.username }}>{
          ({ results, isLoading }) => isLoading ? <LoadingIndicator /> : <PageContent
            profile={ profile }
            existingPreference={ (results && (results.length === 1)) ? results[0] : undefined }
          />
        }</QueryPreferences>
      }</ProfileConsumer>
    </PagePaper>
  </Page>
);

interface IPageContentProps {
  profile: IProfile;

  existingPreference?: IPreference;
};

const PageContent = ({ profile, existingPreference }: IPageContentProps) => (
  /* tslint:disable jsx-no-lambda */
  <UpdatePreference initialPreference={ existingPreference }>{
    ({ preference, isSubmitting, update, submit, lastSubmittedAt }) =>
      lastSubmittedAt
      ?
      <>
        <Typography variant="h4" gutterBottom={true}>
          Thank you, { profile.display_name }
        </Typography>
        <Typography variant="body1">
          Your preferences have been recorded.
        </Typography>
        <Spacer />
        <Typography variant="body1">
          <ul>
            <li>
              You <strong>{ preference.allow_capture ? " DO " : " DO NOT " }</strong>
              agree to having your lectures recorded.
            </li>
            <li>
              You <strong>{ preference.request_hold ? " DO " : " DO NOT " }</strong>
              wish to hold recordings for trimming.
            </li>
          </ul>
        </Typography>
        <Spacer />
        <Typography variant="body1">
          You may check your preference at any point by visiting your <a
          href={ `/preferences/user/${profile.username}/` }>preferences page</a> or
          you may <a href="/preferences/new">change them</a>.
        </Typography>
      </>
      :
      <>
        <Typography variant="h4" gutterBottom={true}>
          Welcome, { profile.display_name }
        </Typography>
        <Typography variant="caption" gutterBottom={true}>
          Not you? Please <a href="/accounts/logout?next=/">sign out</a>.
        </Typography>
        <Spacer />
        <Typography variant="body1">
          {
            preference.expressed_at
            ? `You last expressed a preference at ${dateFormat(new Date(preference.expressed_at))}.`
            : "You have not previously expressed a preference."
          }
        </Typography>
        <Spacer />
        <Grid container={true} justify="center">
          <Grid item={true} xs={12} sm={10}>
            <FormGroup>
              <FormControlLabel
                checked={ preference.allow_capture }
                disabled={ isSubmitting }
                onChange={ (event, checked) => update({ allow_capture: checked }) }
                control={ <Checkbox /> }
                label="I agree that my lectures may be captured"
              />
              <FormControlLabel
                checked={ preference.request_hold }
                disabled={ isSubmitting }
                control={ <Checkbox /> }
                onChange={ (event, checked) => update({ request_hold: checked }) }
                label="I wish to have the option of trimming recordings before they are published"
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Spacer />
        <Typography variant="caption">
          Opt-ins are for the current Academic year and will renew each year
          automatically unless the option is deselected. Recordings held for
          trimming will automatically be published at 7pm on the day of
          recording if not yet trimmed. Your lecture capture preference is public
          information.
        </Typography>
        <Spacer />
        <Grid container={true} spacing={16} justify="flex-end">
          <Grid item={true} xs={12} sm={4}>
            <Button
              fullWidth={true} variant="outlined" color="primary" onClick={ submit }
              disabled={ isSubmitting }
            >
              Express preference
            </Button>
          </Grid>
        </Grid>
      </>
  }</UpdatePreference>
);

export default NewPreferencePage;
