function extractMeetingDetails(model) {
  console.log('GPT -> called extractMeetingDetails function');
  let modelString = String(model);

  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g; // Matches dates in MM/DD/YYYY format
  const timeRegex = /\b\d{1,2}:\d{2}\s*(?:AM|PM)\b/i; // Matches times in HH:MM AM/PM format
  const topicRegex = /topic: (.+)/i; // Assumes 'topic:' prefix for the topic in the speech

  // Extract details using regex
  const attendeesEmailAddresses = modelString.match(emailRegex) || [];
  const date = (modelString.match(dateRegex) || [])[0]; // Assumes only one date is mentioned
  const time = (modelString.match(timeRegex) || [])[0]; // Assumes only one time is mentioned
  const topicMatch = modelString.match(topicRegex);
  const topic = topicMatch ? topicMatch[1] : '';

  return JSON.stringify({
    attendees_email_address: attendeesEmailAddresses,
    date: date,
    time: time,
    topic: topic
  });
}

module.exports = extractMeetingDetails;