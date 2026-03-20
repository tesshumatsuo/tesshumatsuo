const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'z79nhht7',
  dataset: 'production',
  apiVersion: '2022-06-01',
  useCdn: false,
});

async function run() {
  const post = await client.fetch(`*[_type == "post" && slug.current == "learning-ai-world"][0] { body }`);
  console.log(JSON.stringify(post.body.slice(0, 10), null, 2));
}

run().catch(console.error);
