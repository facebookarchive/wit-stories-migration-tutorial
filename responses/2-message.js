const {firstEntity, WIT_TOKEN} = require('../shared');
const Wit = require('node-wit/lib/wit');

const wit = new Wit({accessToken: WIT_TOKEN});
function handleMessage(question) {
  return wit.message(question).then(({entities}) => {
    const intent = firstEntity(entities, 'intent');
    if (!intent) {
      // use app data, or a previous context to decide how to fallback
      return;
    }
    switch (intent.value) {
      case 'appt_make':
        console.log('🤖 > Okay, making an appointment');
        break;
      case 'appt_show':
        console.log('🤖 > Okay, showing appointments');
        break;
      default:
        console.log(`🤖  ${intent.value}`);
        break;
    }
  });
}

// test
handleMessage('make an appointment');
