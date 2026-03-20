const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'z79nhht7',
  dataset: 'production',
  apiVersion: '2022-06-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
async function run() {
  const post = await client.fetch(`*[_type == "post" && slug.current == "learning-ai-world"][0] { _id, body }`);
  if (!post || !post.body) return console.log('Post not found');
  const body = post.body;
  const firstBlock = body[0];
  if (firstBlock.children && firstBlock.children[0].text.includes("どうも、てっしゅうです")) {
    if (!firstBlock.children[0].text.includes("[st-kaiwa1 r]")) {
      firstBlock.children[0].text = "[st-kaiwa1 r]" + firstBlock.children[0].text;
      const lastSpan = firstBlock.children[firstBlock.children.length - 1];
      lastSpan.text = lastSpan.text + "[/st-kaiwa1]";
      await client.patch(post._id).set({ body: body }).commit();
      console.log('Successfully patched the document with st-kaiwa tags!');
    } else {
      console.log('Already has tags.');
    }
  } else {
    console.log('First block is not the expected text: ', firstBlock.children[0].text);
  }
}
run().catch(console.error);
