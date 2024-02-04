const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const Email = require('../models/email.model');
const generateSecureCode = require('../controllers/generateSecureCode');

require('dotenv').config();

// creating temporary storage for saving OTP
const otpStorage = new Map();

// Function to send email with attachments
const sendEmail = async (req, res) => {
    try {
        const userEmail = req.body.from;
        const recipientEmail = req.body.to;
        const emailSubject = req.body.subject;
        const emailBody = req.body.message;
        const appPassword = req.body.appPassword;
        const cc = req.body.cc;
        const bcc = req.body.bcc;
        const [fileUrl, fileName, fileType] = req.body.attachment;

        let attachments = [];

        if (fileUrl) {
            const response = await fetch(fileUrl);
            const fileBuffer = Buffer.from(await response.arrayBuffer());

            attachments = [
                {
                    filename: `${fileName}.${fileType}`,
                    content: fileBuffer,
                }
            ];
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: userEmail,
                pass: appPassword
            }
        });

        const mailOptions = {
            from: userEmail,
            to: recipientEmail,
            cc: cc,
            bcc: bcc,
            subject: emailSubject,
            text: emailBody,
            attachments: attachments,
        };

        // const emailData = {
        //     from: userEmail,
        //     to: recipientEmail,
        //     cc: cc,
        //     bcc: bcc,
        //     subject: emailSubject,
        //     message: emailBody,
        //     attachments: fileUrl,
        // };

        // const user = await User.findOneAndUpdate(
        //     { email: userEmail },
        // );

        // const newEmail = await Email.create(emailData);
        // user.emails.push(newEmail._id);
        // await user.save();
        // await newEmail.save();

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info.response);
        res.send("Email sent successfully");
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send("Internal Server Error");
    }
};




// function to send confirmation email
const sendConfirmationEmail = async (req, res) => {
    try {
        const userEmail = req.body.email;
        const confirmationCode = await generateSecureCode(6);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_HOST,
                pass: process.env.SMTP_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.SMTP_HOST,
            to: userEmail,
            subject: 'Account Confirmation for Email-Microservice',
            html: `<p>Thank you for signing up! Your confirmation code is: ${confirmationCode}</p>`
        };

        await transporter.sendMail(mailOptions);
        otpStorage.set(userEmail, confirmationCode);
        res.status(201).json({"code" : confirmationCode});
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).send("Internal Server Error");
    }
};


// function to verify the confirmation code
const verifyConfirmationCode = async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userCode = req.body.otp;
        const storedCode = otpStorage.get(userEmail);
        // console.log(userCode, storedCode);

        if (userCode == storedCode) {
            otpStorage.delete(userEmail);
            res.status(200).send("Code verified successfully");
        } else {
            res.status(400).send("Invalid code. Please try again.");
        }
    } catch (error) {
        console.error('Error verifying confirmation code:', error);
        res.status(500).send("Internal Server Error");
    }
};


    
module.exports = {
    sendEmail,
    sendConfirmationEmail,
    verifyConfirmationCode,
};


