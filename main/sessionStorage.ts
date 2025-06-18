import fs from "node:fs";
import { User } from "./types";

let user: User | undefined;

export const loadSession = () => {
  if (!fs.existsSync("./cache")) {
    fs.mkdirSync("./cache");
    fs.writeFileSync("./cache/session.json", JSON.stringify({}, null, 2));
  } else {
    user = JSON.parse(fs.readFileSync("./cache/session.json").toString());
    console.log("Logged in as " + user.name + ` (${user.uuid})`)
  }
};

export const setSession = (newUser: User) => {
    user = newUser;
    saveSession();
}

export const getCurrentSession = () :User | undefined => {
    return user;
}

const saveSession = () => {
    fs.writeFileSync("./cache/session.json", JSON.stringify(user))
    console.log("Session Saved !")
}