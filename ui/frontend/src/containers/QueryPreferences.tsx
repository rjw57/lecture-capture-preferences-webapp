import * as React from 'react';

import { IPreference, IPreferenceListQuery, preferenceList } from '../api';

export interface IProps {
  children?: (props: { results: IPreference[], isLoading: boolean }) => React.ReactNode;

  query?: IPreferenceListQuery;
}

export interface IState {
  results: IPreference[],

  isLoading: boolean;
}

export class QueryPreferences extends React.Component<IProps, IState> {
  public state = {
    results: [],

    isLoading: false,
  }

  public componentDidMount() {
    this.fetchList();
  }

  public componentDidUpdate(prevProps: IProps) {
    if(prevProps.query !== this.props.query) {
      this.fetchList();
    }
  }

  public render() {
    const { results, isLoading } = this.state;
    return this.props.children ? this.props.children({ results, isLoading }) : null;
  }

  private fetchList() {
    const { query } = this.props;
    this.setState({ results: [], isLoading: true });

    const fetchNextPage = (
      currentResults: IPreference[], endpointUrl?: string
    ): Promise<IPreference[]> => (
      preferenceList(query, endpointUrl)
      .then(({ next, results }) => {
        const mergedResults = currentResults.concat(results);
        if(next && next !== '') {
          return fetchNextPage(mergedResults, next);
        } else {
          return mergedResults;
        }
      })
    );

    return fetchNextPage([]).then(
      results => this.setState({ results, isLoading: false }));
  }
}

export default QueryPreferences;
