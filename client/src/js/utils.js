// Example POST method implementation:
export async function postData(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

export async function getData(url) {
  const response = await fetch(url);
  return response;
}