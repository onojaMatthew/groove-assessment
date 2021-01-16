const sgMail = require('@sendgrid/mail');

export const mailer = (data, res) => {
  sgMail.setApiKey("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");

  const msg = {
    to: data.to,
    from: "matthew.onoja@ojirehprime.com",
    subject: data.subject,
    text: data.text,
    html: data.html,
  };
  //ES6
  sgMail
    .send(msg)
    .then(() => { 
      return res.json({ message: "Email sent" });
    })
    .catch( error => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
    });
}
