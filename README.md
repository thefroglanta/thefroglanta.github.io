# The Frog Wine Bar and Restaurant "Grodan"

Static website for The Frog Wine Bar and Restaurant "Grodan" in Saladan Village, Koh Lanta.

## Project Files

- `index.html` - Main website content
- `styles.css` - Website styling and responsive layout
- `script.js` - Hero slideshow, food slideshow, and booking form behavior
- `assets/` - Images, logo, menu pages, and restaurant photos
- `FORM_NOTIFICATIONS.md` - Google Apps Script setup for email and Telegram booking alerts

## GitHub Pages

Repository name:

```text
thefroglanta.github.io
```

Upload the contents of this folder to the root of the repository:

```text
index.html
styles.css
script.js
assets/
.gitignore
README.md
FORM_NOTIFICATIONS.md
```

Do not upload the parent folder itself.

Live website URL:

```text
https://thefroglanta.github.io/
```

## Update Notes

- The hero heading is split into two lines:
  - `The Frog`
  - `Wine Bar and Restaurant "Grodan"`
- The hero and section headings were reduced in size to avoid a crowded layout.
- The food gallery is an automatic horizontal slideshow.
- A YouTube atmosphere video is embedded after the wine and dine section.
- The booking form can be connected to Google Apps Script for email and Telegram alerts.
- The booking form guest field is a number input from 1 to 10. Larger groups should add details in the note.
- Booking form inputs have length limits, client-side sanitization, and server-side validation guidance for Apps Script.
- Menu images are shown in their natural landscape ratio and are not cropped.
- Unused image assets were removed from the project folder.
