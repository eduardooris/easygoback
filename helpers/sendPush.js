exports.sendPush = async (token, title, body) => {
  const message = {
    to: token,
    sound: "default",
    title,
    body,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
    });
};
