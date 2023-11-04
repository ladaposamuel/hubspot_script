const hubspot = require('@hubspot/api-client');
require('dotenv').config();

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

const createContact = async (contact) => {
  try {
    const res = await hubspotClient.crm.contacts.basicApi.create(contact);
    return res;
  } catch (err) {
    throw err;
  }
};

const batchCreateContact = async (contacts) => {
  try {
    const res = await hubspotClient.crm.contacts.batchApi.create(contacts);
    return res;
  } catch (err) {
    throw err;
  }
};

const batchUpdateContact = async (contacts) => {
  try {
    const res = await hubspotClient.crm.contacts.batchApi.update(contacts);
    return res;
  } catch (err) {
    throw err;
  }
};

const getContactByEmail = async (email) => {
  try {
    const res = await hubspotClient.crm.contacts.basicApi.getByEmail(email, [
      'email',
      'firstname',
      'lastname',
    ]);
    return res;
  } catch (err) {
    throw err;
  }
};

const getallContacts = async () => {
  try {
    const limit = 100;
    const after = undefined;
    const properties = [
      'email',
      'firstname',
      'lastname',
      'phone',
      'watch_history',
      'completed_getting_started_guide',
    ];
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;
    const res = await hubspotClient.crm.contacts.basicApi.getPage(
      limit,
      after,
      properties,
      propertiesWithHistory,
      associations,
      archived
    );
    return res;
  } catch (err) {
    throw err;
  }
};

const updateContact = async (contact) => {
  try {
    const res = await hubspotClient.crm.contacts.basicApi.update(
      contact.id,
      contact
    );
    return res;
  } catch (err) {
    throw err;
  }
};

const batchCreateOrUpdateContacts = async (contacts) => {
  try {
    const res = await hubspotClient.crm.contacts.batchApi.createOrUpdate(
      contacts
    );
    return res;
  } catch (err) {
    throw err;
  }
};

const createOrUpdateContact = async (contact) => {
  try {
    const existingContact = await getContactByEmail(contact.properties.email);
    if (existingContact) {
      contact.id = existingContact.id;
      return await updateContact(contact);
    } else {
      return await createContact(contact);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createContact,
  getContactByEmail,
  updateContact,
  createOrUpdateContact,
  getallContacts,
  batchCreateContact,
  batchUpdateContact,
};
