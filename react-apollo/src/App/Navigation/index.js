import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as routes from '../../contants/routes';

import Button from '../../Button';
import Input from '../../Input';

import './style.css';

const Navigation = ({
  location: { pathname },
  organizationName,
  onOrganizationSearch
}) => (
    <header className='navigation'>
      <div className='navigation__link'>
        <Link to={routes.PROFILE}>Profile</Link>
      </div>
      <div className='navigation__link'>
        <Link to={routes.ORGANIZATION}>Organization</Link>
      </div>
      {pathname === routes.ORGANIZATION && (
        <OrganizationSearch
          organizationName={organizationName}
          onOrganizationSearch={onOrganizationSearch}
        />
      )}
    </header>
  )

class OrganizationSearch extends Component {
  state = {
    value: this.props.organizationName
  }

  onChange = (evt) => {
    this.setState({ value: evt.target.value });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    this.props.onOrganizationSearch(this.state.value);
  }

  render() {
    return (
      <div className='navigation__search'>
        <form onSubmit={this.onSubmit}>
          <Input
            name='value'
            value={this.state.value}
            onChange={this.onChange}
            placeholder='Search organization name...'
          />
          <Button
            className='navigation__search-btn'
            color='gray'
            type='submit'
          >
            Search
          </Button>
        </form>
      </div>
    )
  }
}

export default withRouter(Navigation);