const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const { generateVideo } = require('./services/clipcat');
const { updateSubscriber, removeTag } = require('./services/kit');

const app = express();
app.use(bodyParser.json());

app.post('/webhook/generate-video', async (req, res) => {
  res.status(200).json({ message: 'Accepted' }); // place here to avoid re-triggering the webhook
  const subscriber = req.body.subscriber;
  const subscriberName = subscriber.first_name;
  const subscriberId = subscriber.id;
  const subscriberEmail = subscriber.email_address;

  console.log(`Received webhook for subscriber: ${subscriberName}, ${subscriberId}, ${subscriberEmail}`);

  try {
    // Generate video via Clipcat
    const { videoUrl, thumbnailUrl } = await generateVideo(subscriberName);
    console.log('Video URL: ' + videoUrl);
    console.log('Thumbnail URL: ' + thumbnailUrl);

    // Update subscriber in ConvertKit
    await updateSubscriber(subscriberId, subscriberEmail, videoUrl, thumbnailUrl);
    await removeTag(subscriberId, process.env.KIT_TAG_ID);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
