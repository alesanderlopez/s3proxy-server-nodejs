
const maybeJSON = (text) => {
  try {
    let response = JSON.parse(text);
    if (response && response.Body) {
      response.Body = new Buffer(response.Body.data);
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