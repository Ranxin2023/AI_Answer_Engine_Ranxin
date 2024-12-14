const parseBody = async (body: string) => {
    // Use a regular expression to extract the URL
    // const body = await req.text(); 
    console.log("body string is", body)
    // Use a regular expression to extract the URL
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const urlMatch = body.match(urlRegex);
    let url = null; // Default to null if no URL is found
    let query = body.trim(); // Default query is the full body content

    if (urlMatch) {
        url = urlMatch[0]; // Extract the matched URL
        query = body.replace(url, "").trim(); // Remove the URL from the query
    } else {
        console.warn("No URL found in the body. Proceeding with the full body as query.");
    }

  return { url, query }; // Return both URL (or null) and query
  };

export default parseBody;