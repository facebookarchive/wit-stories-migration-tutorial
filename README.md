# Stories Migration Tutorial

As you may have heard on the [Wit.ai blog](https://wit.ai/blog/2017/07/27/sunsetting-stories), we don't support Stories and /converse anymore to focus on a more reliable, scaled, and integrated NLP experience.

If you were using Stories, this means two things:

1. `/converse` API, alongside `wit.runActions()` are no longer supported since February 13, 2018 10am PST.
2.  In the majority of use cases, you can still use /message and code on your side to manage the conversation.

# The Tutorial

This tutorial will show you how you can go about converting a stories app to one that uses `/message`.

## Let's start with an App

For this tutorial, we will assume that you had an appointment-bot Wit app built on top of stories. You would have had two basic stories: `apptMake`, and `apptShow`.

![example story](/example-images/appt_show.png)

In our code, we would:

- implement our `actions`: the `send` function and `showAppointments` function
- we would manage context, and invoke `wit.runActions` every time we receive a message

Here is how that would have looked like:

```javascript
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
```

## Using `/message` instead

Conceptually, Stories is simply using `/message` itself, and choosing a different path to take, based on what entities we extract.

We could do this ourselves, by:
- running `/message` on the user text, to extract entities
- decide what to do next, based on our user data, and the extracted entities.

Here's how that could look like:


```javascript
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
```

### And that's it!

With the `/message` use case, you can build your own stories. You can both simplify the code, *and* add more rich features.

For example:
- What if there are no intents?
  - You could use the [`N-best`](https://github.com/wit-ai/wit-api-only-tutorial#manage-uncertainty) feature to get multiple options for entity values, and let the user clarify
- What if you want to dynamically change your bot's answers?
  - You can use a datastore and add [dynamic answers](https://github.com/wit-ai/wit-api-only-tutorial#dynamic-answers)
- what if you want to use Messenger?
  - With [Messenger Built-in NLP](https://developers.facebook.com/docs/messenger-platform/built-in-nlp) you can get your entities directly in the Send/Receive API so you don't even have to make a call to the Wit.ai server. 

You can learn more about leveraging wit features on the [wit-api-only-tutorial](https://github.com/wit-ai/wit-api-only-tutorial).

Thank you for being with us on this journey. We learned so much from you over the years, and we look forward to focusing in, creating the best NLP experience, and continue to serve you further.
