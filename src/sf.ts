import { Connection } from "jsforce";
import { env } from "./env.ts";

const { sf: { instanceUrl, token } } = env

const con = new Connection({
    instanceUrl,
    sessionId: token
})
export default con
