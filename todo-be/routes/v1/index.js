import { Router } from "express";
import { todoRoutes } from "../../entites/todos/todos.rou.js";
import { usersRoutes } from "../../entites/users/users.rou.js";
const routes = (router) => {
  router.use("/todo", todoRoutes(Router()));
  router.use("/user", usersRoutes(Router()));
  return router;
};

export default routes;
