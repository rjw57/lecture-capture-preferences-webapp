import * as React from 'react';

import { RouteComponentProps } from 'react-router-dom'

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { IPreference } from '../api';

import QueryPreferences from '../containers/QueryPreferences';

import PagePaper from '../components/PagePaper';

import Page from './Page';

const LoadingIndicator = () => <div style={{ width: '100%', textAlign: 'center' }}>
  <CircularProgress />
</div>;

interface IParams {
  user: string;
}

const UserPreferencePage = ({ match }: RouteComponentProps<IParams>) => (
  <Page>
    <PagePaper>
      <QueryPreferences query={{ user: match.params.user }}>{
        ({ results, isLoading }) => isLoading ? <LoadingIndicator /> : <PageContent
          preference={ (results && (results.length === 1)) ? results[0] : undefined }
          username={ match.params.user }
        />
      }</QueryPreferences>
    </PagePaper>
  </Page>
);

interface IPageContentProps {
  preference?: IPreference;

  username: string
};

const PageContent = ({ username, preference }: IPageContentProps) => (
  preference
  ?
  <>
    <Typography variant="h4" gutterBottom={true}>
      Preferences for { preference.user.display_name }
    </Typography>
    <Typography variant="body1">
      <ul>
        <li>
          <strong>{ preference.allow_capture ? "DOES " : "DOES NOT " }</strong>
          agree to having lectures recorded.
        </li>
        <li>
          <strong>{ preference.request_hold ? "DOES " : "DOES NOT " }</strong>
          wish to hold recordings for trimming.
        </li>
      </ul>
    </Typography>
  </>
  :
  <Typography variant="body1">
    There is no preference recorded for { username }.
  </Typography>
);

export default UserPreferencePage;

