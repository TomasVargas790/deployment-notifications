import { WebClient } from "@slack/web-api";
import { env } from "./env";

const { api: { slack_token } } = env
const conn = new WebClient(slack_token)

export default conn