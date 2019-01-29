import * as React from 'react';

import { IPreferenceMutable, preferenceUpdate } from '../api';

export interface IUpdatingPreference extends IPreferenceMutable {
  expressed_at?: string;
}

export interface IChildProps {
  preference: IUpdatingPreference;

  update: (newFields: { [x: string]: any }) => void;

  submit: () => void;

  isSubmitting: boolean;

  lastSubmittedAt?: Date;
}

export interface IProps {
  children?: (props: IChildProps) => React.ReactNode;

  initialPreference?: IUpdatingPreference;
};

export interface IState {
  preference: IUpdatingPreference;

  isSubmitting: boolean;

  lastSubmittedAt?: Date;
};

export class UpdatePreference extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      preference: {
        allow_capture: true, request_hold: false,
        ...props.initialPreference
      },

      isSubmitting: false,
    };
  }

  public update = (newFields: { [x: string]: any }) => this.setState({
    preference: { ...this.state.preference, ...newFields }
  });

  public submit = () => {
    this.setState({ isSubmitting: true });
    return preferenceUpdate(this.state.preference)
      .then(preference => { this.setState({
        isSubmitting: false,
        lastSubmittedAt: new Date(),
        preference,
      }) });
  }

  public render() {
    const { lastSubmittedAt, preference, isSubmitting } = this.state;
    const childProps = {
      isSubmitting,
      lastSubmittedAt,
      preference,
      submit: this.submit,
      update: this.update,
    };
    return this.props.children ? this.props.children(childProps) : null;
  }
}

export default UpdatePreference;
