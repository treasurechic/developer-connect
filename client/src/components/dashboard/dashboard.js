import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import PropTypes from "prop-types";
import Spinner from "../layout/spinner";
import { Link } from "react-router-dom";
import { DashboardActions } from "./dashboardAction";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
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
        <>
        <DashboardActions/>
        <Experience experience={profile.experience}/>
        <Education education={profile.education}/>
        <div className="my-2">
          <button className="btn btn-danger" onClick={()=> deleteAccount()}>
            <i className="fas fa-user-minus"></i> Delete my account
          </button>
        </div>
        </>
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
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
