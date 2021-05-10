const fs = require("fs");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
const port = 3000;

const NoteService = require("./Service/NoteService");
const NoteRouter = require("./Routes/NoteRouter");

const noteFile = __dirname + "/database/notes.json";
const userFile = __dirname + "/database/users.json";
const noteService = new NoteService(noteFile);
const noteRouter = new NoteRouter(noteService);
const usersFile = JSON.parse(fs.readFileSync(userFile));
const app = express();

app.use(bodyParser.json());

app.use(
  basicAuth({
    challenge: true,
    authorizer: authorizer(usersFile),
    realm: "note taking app",
  })
);

function authorizer(users) {
  return (username, password) => {
    return (
      typeof users[username] !== "undefined" &&
      users[username] === password
    );
  };
}
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/", (request, response) => {
  noteService.list(request.auth.user).then((data) => {
    response.render("home", {
      user: request.auth.user,
      notes: data,
    });
  });
});

app.use("/api/notes", noteRouter.router());
app.listen(port, () => {
  console.log(`listening on port ${3000}`);
});
