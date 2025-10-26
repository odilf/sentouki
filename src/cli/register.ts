import { register } from "$lib/server/auth";
import { input, password } from "@inquirer/prompts";

const username = await input({ message: "Username" });
const psw = await password({ message: "Password" });

console.log("registering...");
try {
  console.log(await register(username, psw));
} catch (err) {
  console.error(err);
}
