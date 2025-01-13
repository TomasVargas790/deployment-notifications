import jsforce from "jsforce";
import { env } from "./env";

const { sf: { user, pass } } = env

const conn = new jsforce.Connection();
await conn.login(user, pass)

export default conn
