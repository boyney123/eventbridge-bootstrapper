require('dotenv').config();
import path from 'path';
import fs from 'fs';
import { EventBridge } from '@aws-sdk/client-eventbridge';

const client = new EventBridge({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const buildEvent = ({ Detail, DetailType, EventBusName, Resources, Source }) => {
  return {
    Detail: JSON.stringify(Detail),
    DetailType,
    EventBusName,
    Resources,
    Source,
  };
};

const run = async () => {
  const pathToEvents = path.join(__dirname, '../events');

  const allEvents = fs.readdirSync(pathToEvents);

  const parsedEvents = allEvents.map((eventName) => {
    const rawFile = fs.readFileSync(path.join(pathToEvents, eventName), 'utf-8');
    const data = JSON.parse(rawFile);
    return { ...data, Detail: JSON.stringify(data.Detail) };
  });

  const response = await client.putEvents({
    Entries: parsedEvents,
  });

  console.log(response);
};

run();
