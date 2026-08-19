require('dotenv').config();
const nodemailer = require('nodemailer');

// Initialize Transporter using Gmail SMTP
let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const emailUser = (process.env.EMAIL || process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim();

  if (emailUser && emailPass) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log(`📧 Configured SMTP Gmail Transporter for: ${emailUser}`);
  } else {
    transporter = nodemailer.createTransport({
      jsonTransport: true
    });
  }

  return transporter;
}

/**
 * Sends an official Shri Mahakal E-Ticket / E-Pass to the user's email address
 */
async function sendETicketEmail({ toEmail, ticketType, ticketDetails }) {
  if (!toEmail || !toEmail.includes('@')) {
    console.log(`ℹ️ Email skipped: No valid recipient email provided (${toEmail}).`);
    return false;
  }

  try {
    const transport = getTransporter();

    const {
      passId,
      primaryName,
      contactPhone,
      bookingDate,
      timeSlot,
      gateName,
      gateNumber,
      numberOfPersons,
      aartiName,
      totalAmount,
      hotelName,
      roomType,
    } = ticketDetails;

    const refCode = passId || ticketDetails._id || `MAHAKAL-${Math.floor(100000 + Math.random() * 900000)}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Official E-Ticket - Shri Mahakaleshwar Temple Ujjain</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #141414; border: 1px solid #d97706; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        
        <!-- HEADER -->
        <div style="background: linear-gradient(135deg, #7c2d12 0%, #b45309 50%, #7c2d12 100%); text-align: center; padding: 25px 20px; border-bottom: 2px solid #fbbf24;">
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 1px;">
            🕉️ SHRI MAHAKALESHWAR TEMPLE
          </h1>
          <p style="margin: 5px 0 0 0; color: #fef08a; font-size: 13px; text-transform: uppercase; font-weight: 600;">
            Ujjain, Madhya Pradesh • Official E-Ticket & Pass
          </p>
        </div>

        <!-- TICKET SUMMARY BADGE -->
        <div style="padding: 20px 25px; text-align: center; background-color: #1a1a1a; border-bottom: 1px solid #333333;">
          <span style="background-color: #fbbf24; color: #000000; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
            ${ticketType || 'CONFIRMED DARSHAN PASS'}
          </span>
          <h2 style="margin: 15px 0 5px 0; color: #fbbf24; font-size: 24px; font-family: monospace; letter-spacing: 2px;">
            ${refCode}
          </h2>
          <p style="margin: 0; color: #9ca3af; font-size: 13px;">
            Primary Devotee: <strong style="color: #ffffff;">${primaryName || 'Devotee'}</strong>
          </p>
        </div>

        <!-- DETAILS GRID -->
        <div style="padding: 25px;">
          <table style="width: 100%; border-collapse: collapse; color: #e5e7eb; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; color: #9ca3af;">Booking Date:</td>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; text-align: right; font-weight: bold; color: #fbbf24;">
                ${bookingDate || new Date().toISOString().substring(0, 10)}
              </td>
            </tr>
            ${timeSlot || aartiName ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; color: #9ca3af;">Time Slot / Ceremony:</td>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; text-align: right; font-weight: bold; color: #ffffff;">
                ${timeSlot || aartiName}
              </td>
            </tr>
            ` : ''}
            ${gateName ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; color: #9ca3af;">Entry Gate:</td>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; text-align: right; font-weight: bold; color: #ffffff;">
                ${gateName} ${gateNumber ? `(Gate #${gateNumber})` : ''}
              </td>
            </tr>
            ` : ''}
            ${hotelName ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; color: #9ca3af;">Hotel Property:</td>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; text-align: right; font-weight: bold; color: #ffffff;">
                ${hotelName} (${roomType || 'Standard Room'})
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; color: #9ca3af;">No. of Devotees / Passes:</td>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; text-align: right; font-weight: bold; color: #ffffff;">
                ${numberOfPersons || 1} Person(s)
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; color: #9ca3af;">Contact Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px dashed #333333; text-align: right; font-weight: bold; color: #ffffff;">
                ${contactPhone || 'Registered Mobile'}
              </td>
            </tr>
            ${totalAmount ? `
            <tr>
              <td style="padding: 10px 0; color: #9ca3af;">Total Amount Paid:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #34d399; font-size: 16px;">
                ₹${totalAmount}
              </td>
            </tr>
            ` : ''}
          </table>

          <!-- QR SCANNER VISUAL BOX -->
          <div style="margin-top: 25px; background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; color: #000000;">
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #4b5563;">
              Official Verification Barcode & QR Code
            </p>
            <div style="background-color: #000000; color: #ffffff; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 4px; display: inline-block;">
              ||| |||| | |||||| || | ${refCode} |||
            </div>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #6b7280;">
              Show this digital pass at the temple entry scanner turnstiles.
            </p>
          </div>

          <!-- GUIDELINES -->
          <div style="margin-top: 25px; padding: 15px; background-color: #1a1a1a; border-left: 3px solid #fbbf24; border-radius: 4px; font-size: 12px; color: #d1d5db; line-height: 1.6;">
            <strong style="color: #fbbf24; display: block; margin-bottom: 4px;">📌 Important Temple Instructions:</strong>
            • Please report 30 minutes prior to your allocated time slot.<br>
            • Carry a valid Government Photo ID proof (Aadhaar / Passport / Voter ID).<br>
            • Mobile phones and leather items are restricted inside the inner sanctum.
          </div>
        </div>

        <!-- FOOTER -->
        <div style="background-color: #0a0a0a; text-align: center; padding: 15px 20px; border-top: 1px solid #262626; color: #6b7280; font-size: 11px;">
          Jai Shri Mahakal 🕉️ • Official Mahakal Smart Yatra Portal<br>
          Shri Mahakaleshwar Temple Management Committee, Ujjain (M.P.)
        </div>

      </div>
    </body>
    </html>
    `;

    const senderEmail = (process.env.EMAIL || process.env.EMAIL_USER || 'tnitish440@gmail.com').trim();

    const mailOptions = {
      from: `"Shri Mahakal Smart Yatra" <${senderEmail}>`,
      to: toEmail,
      subject: `🕉️ Official E-Ticket (${refCode}) - Shri Mahakaleshwar Temple Ujjain`,
      html: htmlContent,
    };

    const info = await transport.sendMail(mailOptions);
    const testUrl = nodemailer.getTestMessageUrl(info);
    if (testUrl) {
      console.log(`📧 E-Ticket Live Email Preview URL: ${testUrl}`);
    }
    console.log(`📧 E-Ticket Email successfully dispatched to ${toEmail}! MessageId: ${info.messageId || 'OK'}`);
    return true;
  } catch (err) {
    console.error(`⚠️ Email dispatch note for ${toEmail}:`, err.message);
    return false;
  }
}

module.exports = { sendETicketEmail };
