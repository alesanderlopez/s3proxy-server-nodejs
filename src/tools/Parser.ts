
const maybeJSON = (text) => {
  try {
    const response = JSON.parse(text);
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
}