'use latest';
const sendgrid = require('sendgrid@4.7.0');

// Webtask function
module.exports = (context, req, res) => {

  // Parameters to send email
  const type = context.body.type;
  const template_id = context.body.templateId;
  const content = {
    'subject': context.body.subject,
    'body': context.body.content
  };
  const from = {
    'email': context.body.fromEmail,
    'name': context.body.fromName
  };
  const to = {
    'email': context.body.toEmail,
    'name': context.body.toName
  };

  // Use with all emails that have a pre-defined SendGrid template
  function template_email(from, to, template_id) {
    return {
      "personalizations": [
        {
          "to": [{
            "email": to.email
          }],
          "subject": content.subject,
          "substitutions": {
            "-firstName-": to.name
          }
        }
      ],
      "from": {
        "email": from.email,
        "name": from.name
      },
      "reply_to": {
        "email": from.email,
        "name": from.name
      },
      "template_id": template_id
    };
  }

  // Use with emails sent from an online contact form
  function contact_email(from, to, content) {
    return {
      "personalizations": [
        {
          "to": [{
            "email": to.email
          }],
          "subject": content.subject
        }
      ],
      "from": {
        "email": from.email,
        "name": from.name
      },
      "reply_to": {
        "email": from.email,
        "name": from.name
      },
      "content": [
        {
          "type": "text/plain",
          "value": content.body
        }
      ]
    };
  }

  // Send only one kind of email at a time
  var mail;
  switch (type) {
    case 'welcome':
      mail = template_email(from, to, template_id);
    break;
    case 'contact':
      mail = contact_email(from, to, content);
    break;
    default:
      mail = undefined;
      console.log('Email type not registered');
  }

  function successHandler(response) {
    console.log('Success: ' + JSON.stringify(response, null, 2));
  }
  function errorHandler(error) {
    console.log('Error: ' + error.message);
  }

  const sg = sendgrid(context.secrets.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail
  });
  sg.API(request)
    .then(successHandler, errorHandler)
    .then(() => res.end('Done.'));
};
