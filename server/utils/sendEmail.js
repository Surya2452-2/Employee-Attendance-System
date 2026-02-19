const { Resend } = require("resend");


const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "Employee Attendance <onboarding@resend.dev>", 
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully via Resend");
  } catch (error) {
    console.error("Resend email error:", error);
    throw error;
  }
};

module.exports = sendEmail;
