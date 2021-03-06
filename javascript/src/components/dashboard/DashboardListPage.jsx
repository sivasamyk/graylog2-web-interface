import React from 'react';
import Immutable from 'immutable';

import DashboardList from './DashboardList';
import EditDashboardModalTrigger from './EditDashboardModalTrigger';
import DashboardStore from '../../stores/dashboard/DashboardStore';

import Spinner from '../common/Spinner';
import SupportLink from '../support/SupportLink';
import DocsHelper from '../../util/DocsHelper';
import DocumentationLink from '../support/DocumentationLink';
import PermissionsMixin from '../../util/PermissionsMixin';

const DashboardListPage = React.createClass({
  propTypes: {
    permissions: React.PropTypes.arrayOf(React.PropTypes.string),
  },
  mixins: [PermissionsMixin],
  getInitialState() {
    return {
      dashboardsLoaded: false,
      dashboards: DashboardStore.dashboards,
      filteredDashboards: Immutable.List(),
    };
  },
  componentDidMount() {
    DashboardStore.addOnDashboardsChangedCallback(this._onDashboardsChange);
    DashboardStore.updateDashboards();
  },
  render() {
    let createDashboardButton;

    if (this.isPermitted(this.props.permissions, ['dashboards:create'])) {
      createDashboardButton = (
        <div style={{marginTop: 20}}>
          <EditDashboardModalTrigger action="create" buttonClass="btn-success btn-lg"/>
        </div>
      );
    }

    const pageHeader = (
      <div className="row content content-head">
        <div className="col-md-10">
          <h1>Dashboards</h1>

          <p className="description">
            Use dashboards to create specific views on your messages. Create a new dashboard here and add
            any graph or chart you create in other parts of Graylog with one click.
          </p>

          <SupportLink>
            Take a look at the
            {' '}<DocumentationLink page={DocsHelper.PAGES.DASHBOARDS} text="dashboard tutorial"/>{' '}
            for lots of other useful tips.
          </SupportLink>
        </div>

        <div className="col-md-2">
          {createDashboardButton}
        </div>
      </div>
    );

    if (!this.state.dashboardsLoaded) {
      return (
        <div>
          {pageHeader}

          <div className="row content">
            <div style={{marginLeft: 10}}><Spinner/></div>
          </div>
        </div>
      );
    }

    let dashboardList;

    if (this.state.dashboards.count() > 0 && this.state.filteredDashboards.isEmpty()) {
      dashboardList = <div>No dashboards matched your filter criteria.</div>;
    } else {
      dashboardList = (
        <DashboardList dashboards={this.state.filteredDashboards}
                       onDashboardAdd={this._onDashboardAdd}
                       permissions={this.props.permissions}/>
      );
    }

    return (
      <div>
        {pageHeader}

        <div className="row content">
          <div className="col-md-12">
            {dashboardList}
          </div>
        </div>
      </div>
    );
  },
  _onDashboardsChange(dashboards) {
    this.setState({dashboards: dashboards, filteredDashboards: dashboards, dashboardsLoaded: true});
  },
});

export default DashboardListPage;
