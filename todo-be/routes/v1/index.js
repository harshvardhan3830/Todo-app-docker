import { Router } from "express";
import { todoRoutes } from "../../entites/todos/todos.rou.js";

const routes = (router) => {
  router.use("/todo", todoRoutes(Router()));
  return router;
};

export default routes;
