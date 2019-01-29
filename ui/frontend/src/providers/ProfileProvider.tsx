import * as React from 'react';
import {IProfile, profileGet} from "../api";

/**
 * React context for the current user profile.
 */
export const ProfileContext = React.createContext<null | IProfile>(null);

/**
 * Consumer which takes a function as a child and renders its children whenever the fetched user
 * profile changes. The child should be a function which takes a single argument.
 *
 * When the application is first rendered, the profile will be "null"
 *
 * ```js
 * <ProfileConsumer>
 *   { profile => <div>
 *      Username: {(profile && !profile.is_anonymous) ? profile.username : 'unknown'}
 *   </div> }
 * </ProfileConsumer>
 * ```
 */
export const ProfileConsumer = ProfileContext.Consumer;

export interface IProfileProviderState {
  profile: null | IProfile;
}

/**
 * User profile provider.
 */
export class ProfileProvider extends React.Component<{}, IProfileProviderState> {
  public state = { profile: null };

  public componentDidMount() {
    profileGet().then(profile => this.setState({ profile }));
  }

  public render() {
    return <ProfileContext.Provider value={ this.state.profile }>
      { this.props.children }
    </ProfileContext.Provider>
  }
}
