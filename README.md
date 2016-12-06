# webtask-sendgrid

A simple webtask service that sends email using the SendGrid API.

## Installing

Clone or fork this repo and `cd` into it, and follow the getting started guide on [webtask.io](https://webtask.io/), which can be summed up as follows:

```
$ npm install wt-cli -g
$ wt init email@example.com
$ wt create mailer.js --secret YOUR_SENDGRID_API_KEY
```

Make sure that you enable the automatic body parsing of the request when you `POST` to this webtask.

## Using

Usage is pretty straightforward. Just send a `POST` request to the webtask with the right body parameters. For instance, if you want to send a plain text email, pass the following parameters as body of your request:

```
{
  type: 'contact',
  fromEmail: your_email,
  fromName: your_name,
  toEmail: contact_email,
  toName: contact_name,
  subject: email_subject,
  content: email_body
}
```
The `type` used here is arbitrary, you can pretty much set them to suit your front-end business/UX logic.
