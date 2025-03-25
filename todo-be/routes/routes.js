import express, { Router } from "express";
import routes from "./v1/index.js";

const Route = (router) => {
  router.use(printRoutes);
  router.use(modifyHeaders);
  router.use("/", routes(Router()));

  return router;
};

/** @description prints route to the console */
function printRoutes(req, res, next) {
  console.log(
    `\n========================= NEW REQUEST -> ${req.method} ${req.originalUrl}`
  );
  console.log(req.body);
  console.log(`\n=========================`);
  next();
}

/** @description modifies the headers for controllers */
function modifyHeaders(req, res, next) {
  next();
}

export default Route;
