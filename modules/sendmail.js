const SibApiV3Sdk = require("sib-api-v3-sdk");

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // use xkeysib-... value

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = {
  sender: { email: "support@harshiteyecare.com", name: "Harshit Eye Care and Opticals" },
  to: [{ email: receiver, name: r_name }],
  subject: "Hello from Brevo HTTP API",
  textContent: "This email was sent without SMTP!",
};

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log("✅ Email sent:", data);
  },
  function (error) {
    console.error("❌ Error:", error);
  }
);
