// Write your "actions" router here!

const express = require("express");

const router = express.Router();

const Actions = require("./actions-model");

// - [ ] `[GET] /api/actions`
//   - Returns an array of actions (or an empty array) as the body of the response.

router.get("/", (req, res) => {
  Actions.get()
    .then((actions) => {
      res.json(actions);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get actions" });
      err.message;
    });
});

// - [ ] `[GET] /api/actions/:id`
//   - Returns an action with the given `id` as the body of the response.

router.get("/:id", async (req, res) => {
  try {
    const action = await Actions.get(req.params.id);
    if (!action) {
      res.status(404).json({ message: "Action not found" });
    } else {
      res.status(200).json(action);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to get action", err: err.message });
  }
});

//  `[POST] /api/actions`
//   - Returns the newly created action as the body of the response.

router.post("/", (req, res) => {
  const actionData = req.body;
  Actions.insert(actionData)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed to create new action" });
      err.message;
    });
});

// [ ] `[PUT] /api/actions/:id`
//   - Returns the updated action as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { notes, description, completed } = req.body;
    const changes = req.body;
    
    if (!notes || !description || !completed) {
        res.status(400).json({
        message: "Please provide notes, description, and completed for the action",
        });
    } else {
        Actions.update(id, changes)
        .then((action) => {
            if (action) {
            res.status(200).json(action);
            } else {
            res.status(404).json({ message: "Could not find action with given id" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Failed to update action" });
            err.message;
        });
    }    
})

// - [ ] `[DELETE] /api/actions/:id`
//   - Returns no response body.
//   - If there is no action with the given `id` it responds with a status code 404.

router.delete("/:id", (req, res) => {       
    Actions.remove(req.params.id)
    .then((count) => {
        if (count > 0) {
        res.status(200).json({ message: "The action has been nuked" });
        } else {
        res.status(404).json({ message: "Could not find action with given id" });
        }
    })
    .catch((err) => {
        res.status(500).json({ message: "Failed to delete action" });
        err.message;
    });
});

module.exports = router;
