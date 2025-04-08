import { createUser, deleteUser, updateUser, loginUser } from "./users.ctr.js";

export const usersRoutes = (router) => {
  router.post("/register", createUser);
  router.post("/login", loginUser);
  router.put("/:id", updateUser);
  router.delete("/:id", deleteUser);
  return router;
};
