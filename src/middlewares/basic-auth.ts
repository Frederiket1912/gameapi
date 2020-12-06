var http = require("http");
var auth = require("basic-auth");
var compare = require("tsscmp");
import { Response } from "express";
import UserFacade from "../facades/userFacadeWithDB";
const debug = require("debug")("user-endpoint");

// Create server
var authMiddleware = async function (req: any, res: Response, next: Function) {
  //var credentials = auth(req);
  //debug(credentials);
  let credentials = true;
  let username = req.body.username;
  let password = req.body.password;

  try {
    if (credentials && (await UserFacade.checkUser(username, password))) {
      const user = await UserFacade.getUser(username);
      req.userName = user.userName;
      req.role = user.role;
      return next();
    }
  } catch (err) {
    console.log("UPS");
  }
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="example"');
  res.end("Access denied");
};
export default authMiddleware;
