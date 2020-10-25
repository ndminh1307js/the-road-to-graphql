import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Profile from '../Profile';
import Organization from '../Organization';

import * as routes from '../contants/routes';

import './style.css';

export default class App extends Component {
  state = {
    organizationName: 'the-road-to-learn-react'
  }

  onOrganizationSearch = (value) => {
    this.setState({ organizationName: value })
  }

  render() {
    const { organizationName } = this.state;

    return <Router>
      <div className='app'>
        <Navigation
          organizationName={organizationName}
          onOrganizationSearch={this.onOrganizationSearch}
        />

        <div className='app__main'>
          <Route
            exact={true}
            path={routes.ORGANIZATION}
            component={() => (
              <div className='app__large-header'>
                <Organization
                  organizationName={organizationName}
                />
              </div>
            )}
          />
          <Route
            exact={true}
            path={routes.PROFILE}
            component={() => (
              <div className='app__small-header'>
                <Profile />
              </div>
            )}
          />
        </div>
      </div>
    </Router>
  }
}