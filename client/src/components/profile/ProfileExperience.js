import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: {company, title, location, current, to, from, description},
}) => {
  return (
    <Fragment>
      <div>
        <h3 class="text-dark">{company}</h3>
        <p>
            <Moment format='DD-MM-YYY'>{from}</Moment> - {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
            Oct 2011 - Current</p>
        <p>
          <strong>Position: </strong>{title}
        </p>
        <p>
          <strong>Description: </strong>{description}
        </p>
      </div>
    </Fragment>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
