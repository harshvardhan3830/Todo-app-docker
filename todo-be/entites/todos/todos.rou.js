import {
  createTodo,
  deleteTodo,
  getDueTodos,
  getTodoById,
  getTodoByStatusAndDate,
  getTodos,
  getUpcommingTodos,
  updateTodo,
  getTodosByTaskGroup,
  getTodoGroupCount,
} from "./todos.ctr.js";

export const todoRoutes = (router) => {
  // Get endpounts
  router.get("/get-tasks/:user", getTodos);
  router.get("/due-todos/:user", getDueTodos);
  router.get("/status-date/:user", getTodoByStatusAndDate);
  router.get("/upcomming-todos/:user", getUpcommingTodos);
  router.get("/:id", getTodoById);
  router.get("/task-group/:user", getTodosByTaskGroup);
  router.get("/task-group-count/:user", getTodoGroupCount);
  // Post endpoints
  router.post("/create/:user", createTodo);

  // Put endpoints
  router.put("/:id", updateTodo);

  // Delete endpoints
  router.delete("/:id", deleteTodo);
  return router;
};
