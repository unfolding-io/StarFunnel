/* THIS IS JUST A PLACEHOLDER FUNCTION TO GET YOU STARTED */
export default async (request, context) => {
  const { email, password, type } = await request.json();

  if (!email || email === "") return Response.json({ error: "Missing email" });

  if (type === "sign_in") {
    console.log("SIGN IN", email, password);
  }

  if (type === "sign_up") {
    console.log("SIGN IN", email, password);
  }

  if (type === "recover_password") {
    console.log("RECOVER PASSWORD");
    console.log("SIGN IN", email);
  }
};
