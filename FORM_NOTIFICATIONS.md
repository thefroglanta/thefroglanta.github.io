# Booking Form Notifications

Use Google Apps Script as the secure middle layer between the website form, email, and Telegram.

## What You Need

1. Restaurant notification email
2. Telegram bot token
3. Telegram chat ID or group ID
4. Google Apps Script web app URL

Do not put the Telegram bot token in `index.html` or `script.js`.

## 1. Create A Telegram Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`.
3. Follow the steps and copy the bot token.
4. Send a message to your new bot.
5. To use a group, add the bot to the group and send one test message in the group.

To find the chat ID, open this URL in a browser after replacing the token:

```text
https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
```

Look for:

```text
"chat":{"id":123456789
```

For groups, the ID often starts with `-`.

## 2. Create Google Apps Script

1. Go to `https://script.google.com/`.
2. Create a new project.
3. Paste the code below into `Code.gs`.
4. Save the project.

```javascript
function cleanInput(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const emailTo = props.getProperty("EMAIL_TO");
  const telegramToken = props.getProperty("TELEGRAM_BOT_TOKEN");
  const telegramChatId = props.getProperty("TELEGRAM_CHAT_ID");

  const data = e.parameter || {};
  const now = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm:ss");

  const name = cleanInput(data.name, 80);
  const contact = cleanInput(data.contact, 120);
  const date = cleanInput(data.date, 10);
  const guests = Number(cleanInput(data.guests, 2));
  const message = cleanInput(data.message, 500);

  if (!name || !contact || !date || !message || !Number.isInteger(guests) || guests < 1 || guests > 10) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Invalid booking request" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const subject = `New booking request from ${name}`;
  const text =
    `New booking request - The Frog\n\n` +
    `Time received: ${now}\n` +
    `Name: ${name}\n` +
    `Contact: ${contact}\n` +
    `Date: ${date}\n` +
    `Guests: ${guests}\n` +
    `Message: ${message}`;

  if (emailTo) {
    MailApp.sendEmail({
      to: emailTo,
      subject: subject,
      body: text,
    });
  }

  if (telegramToken && telegramChatId) {
    UrlFetchApp.fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: telegramChatId,
        text: text,
      }),
      muteHttpExceptions: true,
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Add Script Properties

In Google Apps Script:

1. Open Project Settings.
2. Scroll to Script properties.
3. Add these properties:

```text
EMAIL_TO = restaurant@example.com
TELEGRAM_BOT_TOKEN = 123456:ABC...
TELEGRAM_CHAT_ID = 123456789
```

## 4. Deploy As Web App

1. Click Deploy.
2. Choose New deployment.
3. Select Web app.
4. Set Execute as: `Me`.
5. Set Who has access: `Anyone`.
6. Deploy.
7. Copy the Web app URL.

The URL usually starts with:

```text
https://script.google.com/macros/s/...
```

## 5. Connect The Website

Open `index.html` and find:

```html
<form class="booking-card" id="reserve" data-booking-endpoint="" aria-label="Table booking form">
```

Paste the Apps Script Web app URL:

```html
<form class="booking-card" id="reserve" data-booking-endpoint="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" aria-label="Table booking form">
```

Then upload these updated files to GitHub:

```text
index.html
script.js
FORM_NOTIFICATIONS.md
README.md
```

## Test

1. Open the live website.
2. Fill in the booking form.
3. Submit it.
4. Check email and Telegram.

If it does not send, check:

- Apps Script deployment access is set to `Anyone`.
- Script properties are spelled exactly.
- The Telegram bot has received at least one message or is inside the group.
- The Web app URL ends with `/exec`.
