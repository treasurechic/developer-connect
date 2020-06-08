import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import PropTypes from "prop-types";
import Spinner from "../layout/spinner";
import { Link } from "react-router-dom";
import { DashboardActions } from "./dashboardAction";

const Dashboard = ({
  getCurrentProfile,
  auth: {user},
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? <Spinner /> : <>
       <h1 className="large text-primary">
        Dashboard
      </h1>
      <p className="lead"><i className="fa fa-user"></i> Welcome {user && user.name}</p>
      {profile != null ? (
        <DashboardActions/>
       ) : (<>
        <p>You have not yet set up a Profile, please add some info</p>
        <Link to='/create-profile' className='btn btn-primary'>Create Profile</Link>
      </>)}
  </>;
};

Dashboard.prototype = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
