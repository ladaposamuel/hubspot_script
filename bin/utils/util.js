const validateUserItems = (users) => {
  const validUsers = [];
  users.forEach((user) => {
    const validatedUser = validateUser(user);
    if (validatedUser) {
      validUsers.push(validatedUser);
    }
  });
  return validUsers;
};

const validateUser = (user) => {
  const {
    id,
    uuid,
    name,
    email,
    email_verified_at,
    created_at,
    updated_at,
    ...otherProps
  } = user;

  // Validate the 'id' and 'uuid' properties (assuming they should be numbers and strings)
  if (typeof id !== 'number' || typeof uuid !== 'string') {
    return null; // Invalid user, skip this user
  }

  // Validate the 'name' property as a string
  if (typeof name !== 'string') {
    return null; // Invalid user, skip this user
  }

  // Validate the 'email' property as a valid email address
  if (!isValidEmail(email)) {
    return null; // Invalid user, skip this user
  }

  // Validate other properties as numbers or strings
  for (const key in otherProps) {
    const value = otherProps[key];
    if (typeof value !== 'string' && typeof value !== 'number') {
      return null; // Invalid user, skip this user
    }
  }

  // If all validations pass, return the validated user
  return user;
};

// SOURCE = https://github.com/manishsaraan/email-validator/blob/master/index.js
const isValidEmail = (email) => {
  var emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;

  if (email.length > 254) return false;

  var valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  var parts = email.split('@');
  if (parts[0].length > 64) return false;

  var domainParts = parts[1].split('.');
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

const formatErrorMessage = (error) => {
  if (error?.body && error?.status === 'error') {
    const message = error.message.replace(
      'Property values were not valid: ',
      ''
    );
    try {
      const validationErrors = JSON.parse(message);
      const formattedErrors = validationErrors.map((errorItem) => {
        return `${errorItem.name}: ${errorItem.localizedErrorMessage}`;
      });

      return `Validation errors: ${formattedErrors.join(', ')}`;
    } catch (e) {
      return 'Failed to parse validation errors.';
    }
  }

  return error ? error.message : error;
};

function splitName(name) {
  const [firstname, ...lastname] = name.split(' ');
  const lastnameStr = lastname.join(' ');
  return {
    firstname,
    lastname: lastnameStr,
  };
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const formatUsersForHubSpot = (
  users,
  updateAction = false,
  contacts = null
) => {
  const usersToCreate = {
    inputs: users.map((user) => {
      const properties = {};
      const watch_history = [];

      let id;
      if (contacts) {
        const contact = contacts.find(
          (contact) => contact.properties.email === user.email
        );
        id = contact ? contact.id : null;
      }

      for (const key in user) {
        if (key !== 'id' && key !== 'uuid') {
          if (user[key] === 1) {
            watch_history.push(key);
          } else if (
            ![
              'connect_portal',
              'create_page',
              'create_layout',
              'create_page_from_layout',
              'install_custom_global_module',
              'upgrade_custom_module',
              'generate_theme_preview',
              'generate_sr_badge',
            ].includes(key)
          ) {
            switch (key) {
              case 'created_at':
                delete properties.createdate;
                break;
              case 'updated_at':
                properties.last_guide_video_sync = formatDate(user[key]);
                break;
              case 'name':
                const { firstname, lastname } = splitName(user[key]);
                properties.firstname = firstname;
                properties.lastname = lastname;
                break;
              case 'is_complete':
                properties.completed_getting_started_guide =
                  user[key] === 0 ? 'No' : 'Yes';
                break;
              default:
                properties[key] = user[key];
                break;
            }
          }
        }
      }

      if (watch_history.length > 0) {
        properties.watch_history = watch_history.join('; ');
      }

      return updateAction ? { id, properties } : { properties };
    }),
  };

  return { usersToCreate };
};

module.exports = {
  validateUserItems,
  formatErrorMessage,
  formatUsersForHubSpot,
};
