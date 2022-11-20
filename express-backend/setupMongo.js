const mongoose = require("mongoose");

// NEVER DO THIS
// store the secrets (username, password, etc) in an environment variable instead
const uri =
  "mongodb+srv://eddie:csc4361secure@cluster0.jg3dbs8.mongodb.net/?retryWrites=true&w=majority";

function connect() {
  const options = { useNewUrlParser: true };
  mongoose.connect(uri, options).then(
    () => {
      console.log("Database connection established!");
    },
    (err) => {
      console.log("Error connecting Database instance due to: ", err);
    }
  );
}
module.exports = connect;
