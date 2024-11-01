import { outro, password, text } from "@clack/prompts";
import { register } from "../src/lib/server/auth/register";

const username = await text({
    message: "Username",
    placeholder: "NinaGaming69",
});

const email = await text({
    message: "Email",
    placeholder: "nina.gamer@gaming.com",
});

const pass = await password({
    message: "Password",
});

register(username.toString(), email.toString(), pass.toString());

outro("User added successfully!");
