# Stories Migration Tutorial

As you have heard on the [Wit.ai blog](https://wit.ai/blog/2017/07/27/sunsetting-stories), the team will sunset Stories, to focus on a more reliable, scaled, and integrated NLP experience.

If you are a a current user of Stories, this means two things:

1. `/converse` API, alongside `wit.runActions()` will stop working on February 1, 2018.
2. This also means that you have much more powerful tools at your disposable, and they are getting better.
3. In the majority of use cases, you can replicate the flow from stories within your code, and improve upon it.

# The Tutorial

This tutorial will tackle **3**, and show you how you can go about converting a stories app, to one that uses `/message`.

## Let's start with an App

###  [stopa-staging/appointment-bot](https://wit.ai/stopa-staging/appointment-bot/entities)

For this tutorial, we will start with an [appointment-bot](https://wit.ai/stopa-staging/appointment-bot/entities) built on top of stories.

## Using Stories

To make an appointment-bot using stories, we would start with two basic stories: `apptMake`, and `apptShow`.

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

## Using `/message`

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

### Aand that's it!

With the `/message` use case, you no longer have to strictly follow the paradgim of stories. You can both simplify the code, *and* add more rich features.

For example:
- What if there are no intents?
  - You could use the [`N-best`](https://github.com/wit-ai/wit-api-only-tutorial#manage-uncertainty) feature to get multiple options for entity values, and let the user clarify
- What if you want to dynamically change your bot's answers?
  - You can use a datastore and add [dynamic answers](https://github.com/wit-ai/wit-api-only-tutorial#dynamic-answers)

You can learn more about leveraging wit features on the [wit-api-only-tutorial](https://github.com/wit-ai/wit-api-only-tutorial).

Thank you for being with us on this journey. We learned much from you over the years, and we look forward to focusing in, creating the best NLP experience, and continue to serve you further.
