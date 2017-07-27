const {firstEntity, WIT_TOKEN} = require('../shared');
const Wit = require('node-wit/lib/wit');

const actions = {
  send(request, response) {
    console.log(`🤖 > ${response.text}`);
    return Promise.resolve();
  },
  showAppointments(x) {
    // implement logic here to display a view of appointments
    console.log('🤖 > Okay, showing appointments');
  },
  makeAppointments({entities, context}) {
    // implement logic here to display a view for making appointments
    console.log('🤖 > Okay, making an appointment');
  },
};

// database for contexts
const contextsForSession = {};

function handleMessage(userText, sessionId) {
  const wit = new Wit({accessToken: WIT_TOKEN, actions});
  return wit.runActions(
    sessionId,
    userText,
    contextsForSession[sessionId] || {}
  ).then(context => {
    contextsForSession[sessionId] = context;
  });
}

// test
handleMessage('show my appointments', 'test-session');
