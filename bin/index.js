#!/usr/bin/env node

const {
  getallContacts,
  batchCreateContact,
  batchUpdateContact,
} = require('./services/hubspot');
const User = require('./models/user.model');
const {
  UserProvisionRequest,
} = require('@hubspot/api-client/lib/codegen/settings/users');
const {
  validateUserItems,
  formatErrorMessage,
  formatUsersForHubSpot,
} = require('./utils/util');

const syncContacts = async () => {
  console.log('[sync-contact] Process started');

  try {
    let users;
    users = await User.findAll(true);
    console.log(`[sync-contact] Found ${users.length} users in the database`);

    let contacts = await getallContacts();
    console.log(
      `[sync-contact] Found ${contacts.results.length} contacts in HubSpot`
    );

    const contactsByEmail = {};
    contacts = JSON.parse(JSON.stringify(contacts, null, 2));
    contacts.results.forEach((contact) => {
      contactsByEmail[contact.properties.email] = contact;
    });

    const contactsToCreate = [];
    const contactsToUpdate = [];
    const contactsToSkip = [];
    let contactsCreated = 0;
    let contactsUpdated = 0;
    let contactsSkipped = 0;
    let contactsCreatedOrUpdated = 0;

    users = validateUserItems(users);

    users.forEach((user) => {
      const contact = contactsByEmail[user.email];
      if (contact) {
        if (contact.properties.completed_getting_started_guide === 'Yes') {
          contactsToSkip.push(contact);
          contactsSkipped++;
        } else {
          contactsToUpdate.push(user);
          contactsCreatedOrUpdated++;
          contactsUpdated++;
        }
      } else {
        contactsToCreate.push(user);
        contactsCreatedOrUpdated++;
        contactsCreated++;
      }
    });

    if (contactsToSkip.length > 0) {
      console.log(
        `[sync-contact] Found ${contactsToSkip.length} contacts in DB to skip`
      );
      console.log(
        `[sync-contact] Skipped ${contactsToSkip.length} contacts in HubSpot`
      );
    }

    if (contactsToCreate.length > 0) {
      console.log(
        `[sync-contact] Found ${contactsToCreate.length} contacts to create`
      );
      const saveUser = formatUsersForHubSpot(contactsToCreate);
      const res = await batchCreateContact(saveUser);
      console.log(
        `[sync-contact] Synced new ${res.results.length} contacts to HubSpot`
      );
    }

    if (contactsToUpdate.length > 0) {
      console.log(
        `[sync-contact] Found ${contactsToUpdate.length} contacts to update`
      );

      let updateUser = formatUsersForHubSpot(
        contactsToUpdate,
        true,
        contacts.results
      );
      const res = await batchUpdateContact(updateUser['usersToCreate']);

      console.log('[sync-contact]  🚀 ~', res);

      console.log(
        `[sync-contact] Synced ${res.results.length} contacts updates to HubSpot`
      );
    }
  } catch (err) {
    console.log(
      '🚀 ~ file: index.js:89 ~ syncContacts ~ err:',
      formatErrorMessage(err)
    );
  }

  console.log('[sync-contact] Exiting process... Good Bye!');
  process.exit();
};

const testHubSpotConnection = () => {
  const userDetails = getallContacts();
  userDetails
    .then((response) => {
      console.log(JSON.stringify(response, null, 2));
    })
    .catch((err) => {
      console.log(err);
    });
};

syncContacts();
// testHubSpotConnection();
