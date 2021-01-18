// Tôi làm được mọi việc nhờ Đấng ban thêm sức cho tôi!
const express = require("express");
const request = require("request"); // is it needed? 
const client = require("@mailchimp/mailchimp_marketing");
const bodyParser = require("body-parser");
const https = require("https"); //is it needed?
const md5 = require("md5");  // newly added
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
client.setConfig({
    apiKey: "19e6d5004e449a9a4c9709df724ceed2-us15",
    server: "us15"
  });
app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }
  const run = async () => {
    try {
      const response = await client.lists.addListMember("1712e348ad", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
        
      });

      console.log(response);
      res.sendFile(__dirname + "/success.html");

    } catch (e){
      res.sendFile(__dirname + "/failure.html"); 
    }
  };
    run();
});
app.post("/failure", function(req, res){
  res.redirect("/");
});
app.listen(process.env.PORT|| 3000, function() {
  console.log("Server is running on port 3000.");
});

// const subscriberHash = md5(email.toLowerCase());
// try {
//   const response = await client.lists.getListMember(
//     "1712e348ad",
//     subscriberHash
//   );
//   res.send(`This user's subscription status is ${response.status}.`);
// } catch (e) {
//   if (e.status === 404) {
//     res.send(`This email is not subscribed to this list`, e);
//   }

// }