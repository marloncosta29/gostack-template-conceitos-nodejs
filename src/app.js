const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isUuidValid(request, response, next){
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).json({message: 'invalid Id'})
  }
  return next()
}

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const id = uuid()
  repositories.push({ id, title, url, techs, likes: 0 })
  response.status(201).json({ id, title, url, techs, likes: 0 })
});

app.put("/repositories/:id", isUuidValid, (request, response) => {
  const { id } = request.params
  const { title, url, techs, likes } = request.body
  const index = repositories.findIndex(r => r.id === id)
  console.log(repositories[index])
  repositories[index] = {
    ...repositories[index],
    title, url, techs
  }
  if(likes){
    request.body.likes = 0
  }
  response.json({ id, ...request.body })
});

app.delete("/repositories/:id", isUuidValid, (request, response) => {
  const { id } = request.params
  const index = repositories.findIndex(r => r.id === id)
  const deleted = repositories[index]
  repositories.splice(index, 1)
  response.status(204).json({...deleted})
});

app.post("/repositories/:id/like", isUuidValid, (request, response) => {
  const { id } = request.params
  const index = repositories.findIndex(r => r.id === id)
  repositories[index].likes += 1
  response.json({ likes: repositories[index].likes })
});

module.exports = app;
