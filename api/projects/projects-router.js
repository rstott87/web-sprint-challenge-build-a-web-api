// Write your "projects" router here!

const express = require("express");

const router = express.Router();

const Projects = require("./projects-model");

router.get("/", (req, res) => {
  Projects.get()
    .then((projects) => {
      res.json(projects);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get projects" });
      err.message;
    });
});

//- [ ] `[GET] /api/projects/:id`
// - Returns a project with the given `id` as the body of the response.

router.get("/:id", async (req, res) => {
  try {
    const project = await Projects.get(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
    } else {
      res.status(200).json(project);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get project", err: err.message });
  }
});

router.post("/", (req, res) => {
  const projectData = req.body;
  Projects.insert(projectData)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed to create new project" });
      err.message;
    });
});

// - [ ] `[PUT] /api/projects/:id`
//   - Returns the updated project as the body of the response.
//   - If there is no project with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const changes = req.body;

  if (!name || !description) {
    res.status(400)
      .json({ message: "Please provide title and contents for the project." });
  } 
  else {
      Projects.update(id, changes)
      .then((project) => {
        if (!project) {
          res
            .status(404)
            .json({ message: "Could not find project with given id" });
        } else {
          res.json(project);
        }
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Failed to update project", err: err.message });
      });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Projects.remove(id).then((deleted) => {
    if (deleted) {
      res.json({ removed: deleted });
    } else {
      res.status(404).json({ message: "Could not find project with given id" });
    }
  });
});

router.get("/:id/actions", (req, res) => {
  const { id } = req.params;

  Projects.getProjectActions(id)
    .then((actions) => {
      if (actions) {
        res.json(actions);
      } else {
        res
          .status(404)
          .json({ message: "Could not find actions for given project" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed to get actions" });
      err.message;
    });
});

module.exports = router;
