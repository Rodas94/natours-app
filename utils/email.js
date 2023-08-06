const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText1 = require('html-to-text');
const htmlToText = require('html-to-text2');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.form = `Rodas S <${process.env.EMAIL_FORM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    //1. Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2. Define email options
    const mailOptions = {
      from: this.form,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
      //html
    };

    //3. create a transport and email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('Welcome', 'Wellcome to the Natours family!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password rest token (valid for only 10 minutes)'
    );
  }
};

// const sendEmail = async (options) => {
//1. create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });
//2. Define the email option
// const mailOptions = {
//   from: 'Rod Sol <rodsolomon50@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   //html
// };
//3. Actually send the email
//   await transporter.sendMail(mailOptions);
// };
