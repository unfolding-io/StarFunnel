const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_LIST_ID } =
  Deno.env.toObject();

export default async (request, context) => {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID)
    return Response.json({
      error: "Missing MailChimp configuration, please check your .env file.",
    });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
  };

  const {
    email,
    list,
    first_name,
    last_name,
    include_main_list,
    status,
    tags,
  } = await request.json();

  if (!email || email === "") return Response.json({ error: "Missing email" });

  let lists = [];

  if (list) {
    lists = [
      ...lists,
      {
        url: `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${list}/members/${email.toLowerCase()}`,
        data: JSON.stringify({
          email_address: email,
          status_if_new: status,
          merge_fields: {
            FNAME: first_name,
            LNAME: last_name,
          },

          tags: tags,
        }),
      },
    ];
  }
  if (include_main_list || !list) {
    lists = [
      ...lists,
      {
        url: `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${email.toLowerCase()}`,
        data: JSON.stringify({
          email_address: email,
          merge_fields: {
            FNAME: first_name,
            LNAME: last_name,
          },
          status_if_new: "pending",
          tags: tags,
        }),
      },
    ];
  }

  try {
    const result = await Promise.all(
      lists.map(async (data) => {
        const resp = await fetch(data.url, {
          method: "PUT",
          headers: headers,
          body: data.data,
        });
        return resp.json();
      }),
    );

    if (result.length === 1) {
      const response = result[0];

      return Response.json({
        statusCode: 200,
        status: response.status,
      });
    }

    const allSubscribed = result.every(
      (response) =>
        response.status === "subscribed" || response.status === "pending",
    );

    return Response.json({
      statusCode: 200,
      status: allSubscribed ? "pending" : "error",
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return Response.json({
      error: "Mailchimp error",
    });
  }
};
