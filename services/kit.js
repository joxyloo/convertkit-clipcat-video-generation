
require('dotenv').config();

async function updateSubscriber(id, email, videoUrl, thumbnailUrl) {
  var data = {
    email_address: email,
    fields: {
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
    },
  };

  await fetch(`https://api.kit.com/v4/subscribers/${id}`, {
    method: 'PUT',
    headers: { 'X-Kit-Api-Key': process.env.KIT_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function removeTag(subscriberId, tagId) {
  console.log(`Removing tag (${tagId}) from subscriber (${subscriberId}) ...`);

  const options = { method: 'DELETE', headers: { 'X-Kit-Api-Key': process.env.KIT_API_KEY } };

  const res = await fetch(`https://api.kit.com/v4/tags/${tagId}/subscribers/${subscriberId}`, options);
  if (!res.ok) {
    const errorText = await res.text(); // fallback in case there's no JSON
    throw new Error(`Failed to remove tag: ${res.status} - ${errorText}`);
  }
  console.log("Tag removed successfully");
}

module.exports = { updateSubscriber, removeTag };
