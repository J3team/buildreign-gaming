# Discord Webhook Setup Guide

## Overview
The BuildReign Gaming support ticket system now includes Discord webhook integration. When customers submit tickets or reply to existing tickets, you'll receive beautiful formatted notifications in your Discord channel.

## Features
- 🎫 New ticket notifications with full details
- 💬 Customer reply notifications
- 🎨 Color-coded embeds based on ticket type
- ⚡ Priority level indicators
- 📁 Department categorization
- 📊 All ticket details in one message

## Setup Instructions

### Step 1: Create a Discord Webhook

1. Open your Discord server
2. Go to **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook** (or **Create Webhook**)
4. Name it something like "BuildReign Support"
5. Select the channel where you want to receive notifications
6. Click **Copy Webhook URL**

### Step 2: Configure the Webhook

1. Open `discord-webhook.js` in your code editor
2. Find this line at the top of the file:
   ```javascript
   const DISCORD_WEBHOOK_URL = ''; // Paste your Discord webhook URL here
   ```
3. Paste your webhook URL between the quotes:
   ```javascript
   const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1234567890/AbCdEfGhIjKlMnOpQrStUvWxYz';
   ```
4. Save the file

### Step 3: Test the Integration

1. Go to your support page
2. Submit a test ticket
3. Check your Discord channel - you should see a notification!

## Notification Types

The webhook sends different colored embeds for different events:

- **🟢 Green** - New tickets submitted
- **🔵 Blue** - Customer replies to tickets
- **🟡 Yellow** - Ticket status updates
- **⚫ Gray** - Closed tickets

## Notification Details

Each Discord notification includes:
- Ticket ID
- Customer name and email
- Department and priority
- Order number (if provided)
- Subject and message preview
- Timestamp

## Troubleshooting

### Notifications not appearing?
1. Check that you copied the webhook URL correctly
2. Make sure the URL is between quotes in `discord-webhook.js`
3. Check your browser's console for error messages (F12)
4. Verify the webhook is enabled in Discord

### Webhook URL not working?
- Make sure you copied the **entire** URL
- The URL should start with `https://discord.com/api/webhooks/`
- Check that the webhook wasn't deleted in Discord

### Still having issues?
- Open your browser console (F12)
- Look for messages starting with "✅" or "❌"
- These will tell you if the webhook is working

## Security Note

⚠️ **IMPORTANT**: Your webhook URL is like a password. Anyone with this URL can send messages to your Discord channel.

- Don't share the URL publicly
- Don't commit it to public GitHub repositories
- If compromised, delete the webhook in Discord and create a new one

## Disabling Discord Notifications

To temporarily disable Discord notifications without removing the code:

1. Open `discord-webhook.js`
2. Change the webhook URL to an empty string:
   ```javascript
   const DISCORD_WEBHOOK_URL = '';
   ```
3. Save the file

The system will continue working normally, but won't send Discord notifications.

## Example Notification

Here's what a new ticket notification looks like in Discord:

```
🎫 New Support Ticket
A new support ticket has been submitted.

🆔 Ticket ID: BR834512
📧 Customer: John Doe | john@example.com
📁 Department: 🔧 Technical Support
⚡ Priority: 🟡 MEDIUM
📦 Order Number: BR-2025-12345
🏷️ Status: OPEN

📝 Subject: Chair armrest is loose
💭 Message: I just assembled my BuildReign Pro Elite chair...

🤖 BuildReign Gaming Support System
```

---

**Need help?** Check the console logs in your browser (F12) for detailed debugging information.
