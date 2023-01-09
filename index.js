import express from "express";

const app = express();

app.use(express.json()); // Read Json from POST REQUEST

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.post("/auth/login", (request, response) => {
  console.log(request.body);
  response.json({
    sucess: true,
  });
});

app.listen("4444", (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Loaded...");
});
