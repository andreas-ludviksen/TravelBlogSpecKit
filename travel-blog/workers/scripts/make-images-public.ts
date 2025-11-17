/**
 * Script to make all uploaded images publicly accessible
 * Run with: npx wrangler run scripts/make-images-public.ts
 */

const imageIds = [
  'b95ebe09-a108-4589-de84-f51a8db05c00',
  'a8a9fdab-422d-48e9-d7d8-7db3ef085600',
  'c30c0c17-fff8-4d26-b83c-704f6958c400',
  '0643970d-0a57-4605-36cb-6a433d91ff00',
  '904fb4fa-dfb2-42c6-eb6d-79be7c971000',
  '1b8c1362-e040-466c-3cfe-ee83d0572e00',
  '64b9b172-6e0e-4020-aec4-9ccad2b59c00',
  '7cd75920-90f1-4085-87ec-9384b9b76900',
];

const ACCOUNT_ID = '3896b7e6b3d880f51d59dba47dc47027';
const API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

async function updateImage(imageId: string) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1/${imageId}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requireSignedURLs: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to update ${imageId}:`, error);
    return false;
  }

  const data = await response.json() as any;
  console.log(`✓ Updated ${imageId} - requireSignedURLs: ${data.result.requireSignedURLs}`);
  return true;
}

async function main() {
  console.log('Making all images publicly accessible...\n');
  
  for (const imageId of imageIds) {
    await updateImage(imageId);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n✓ Done! All images should now be publicly accessible.');
}

main().catch(console.error);
