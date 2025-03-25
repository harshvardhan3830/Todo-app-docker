import { createTodo, deleteTodo, getTodos, updateTodo } from "./todos.ctr.js";

export const todoRoutes = (router) => {
  router.get("/", getTodos);
  router.post("/", createTodo);
  router.put("/:id", updateTodo);
  router.delete("/:id", deleteTodo);
  return router;
};
