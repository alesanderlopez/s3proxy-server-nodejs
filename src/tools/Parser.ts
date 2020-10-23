
const maybeJSON = (text) => {
  try {
    let response = JSON.parse(text);
    if (response && response.Body) {
      response.Body = Buffer.from(response.Body.data).toString('base64');;
    }
    return response;
  } catch (e) {
    return text;
  }
}

const maybeToJSON = (text) => {
  try {
    const response = JSON.stringify(text);
    return response;
  } catch (e) {
    return text;
  }
}

export {
  maybeJSON,
  maybeToJSON,
};
