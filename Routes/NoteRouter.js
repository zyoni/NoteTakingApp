const express = require("express");

class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  router() {
    let router = express.Router();
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));
    return router;
  }

  get(request, response) {
    console.log("Get Route");
    return this.noteService
      .list(request.auth.user)
      .then((notes) => {
        console.log(notes);
        response.json(notes);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  post(request, response) {
    console.log("Post Route");
    let note = request.body.note;
    console.log("Note", note);
    let user = request.auth.user;
    console.log("User", user);
    return this.noteService
      .add(note, user)
      .then(() => {
        this.noteService.list(user);
      })
      .then((notes) => {
        response.json(notes);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  put(request, response) {
    console.log("Put Route");
    let index = request.params.id;
    let note = request.body.note;
    let user = request.auth.user;
    return this.noteService
      .update(index, note, user)
      .then(() => {
        this.noteService.list(user);
      })
      .then((notes) => {
        response.json(notes);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
  
  delete(request, response) {
    let index = request.params.id;
    let user = request.auth.user;
    return this.noteService
      .remove(index, user)
      .then(() => {
        this.noteService.list(user);
      })
      .then((notes) => {
        response.json(notes);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
}

module.exports = NoteRouter;
