exports.handler = async function (event, context) {
    const className = event.queryStringParameters.name;
    if (!className) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Class name is required' })
        };
    }

    const searchUrl = `https://search.maven.org/solrsearch/select?q=fc:%22${className}%22&rows=20&wt=json`;

    try {
        const response = await fetch(searchUrl);
        const json = await response.json();
        const docs = json.response.docs.map(doc => ({
            groupId: doc.g,
            artifactId: doc.a,
            latestVersion: doc.latestVersion,
            jarLink: `https://repo1.maven.org/maven2/${doc.g.replace(/\./g, '/')}/${doc.a}/${doc.latestVersion}/${doc.a}-${doc.latestVersion}.jar`
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(docs)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch from Maven Central', details: error.message })
        };
    }
};
