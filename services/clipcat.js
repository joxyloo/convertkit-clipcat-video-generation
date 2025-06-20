require('dotenv').config();

async function generateVideo(name) {
  console.log('Generating video...');
  var data = {
    template: process.env.CLIPCAT_TEMPLATE_ID,
    modifications: [
      {
        scene: 'Greetings',
        object: 'name',
        text: name,
      },
    ],
  };
  const res = await fetch('https://api.clipcat.com/v1/renders', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLIPCAT_API_KEY}`,
    },
  });
  const resData = await res.json();
  const videoId = resData.uid;

  let videoUrl, thumbnailUrl;

  while (!videoUrl && !thumbnailUrl) {
    console.log(`Polling the result for videoID: ${videoId}...`);
    const pollingRes = await fetch(`https://api.clipcat.com/v1/renders/${videoId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLIPCAT_API_KEY}`,
      },
    });
    const pollingData = await pollingRes.json();
    if (pollingData.status == 'completed') {
      videoUrl = pollingData.url;
      thumbnailUrl = pollingData.preview;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  return { videoUrl, thumbnailUrl };
}

module.exports = { generateVideo };
