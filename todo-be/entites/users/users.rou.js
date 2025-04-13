import {
  createUser,
  deleteUser,
  refreshToken,
  updateUser,
  loginUser,
} from "./users.ctr.js";
import { authenticate } from "../../middlewares/authenticate.js";
export const usersRoutes = (router) => {
  router.post("/register", createUser);
  router.post("/login", loginUser);
  router.put("/:id", authenticate, updateUser);
  router.delete("/:id", authenticate, deleteUser);
  router.post("/refresh-token", refreshToken);
  return router;
};
