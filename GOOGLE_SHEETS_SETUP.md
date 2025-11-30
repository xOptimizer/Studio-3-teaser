# Google Sheets Integration Setup Guide

Follow these steps to connect the registration form to Google Sheets:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Studio 3 Registrations" (or any name you prefer)
4. In Row 1, add these column headers:
   - **Column A**: `Name`
   - **Column B**: `Email`
   - **Column C**: `Mobile`
   - **Column D**: `Timestamp`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const timestamp = new Date();
    sheet.appendRow([
      data.name || '',
      data.email || '',
      data.mobile || '',
      timestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (or press `Ctrl+S` / `Cmd+S`)
5. Give your project a name (e.g., "Studio 3 Form Handler")

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the settings:
   - **Description**: "Studio 3 Registration Form Handler" (optional)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (important!)
5. Click **Deploy**
6. **Authorize access** when prompted:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)" (if shown)
   - Click "Allow"
7. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Update the Code

1. Open `src/components/RegistrationModal.jsx`
2. Find this line (around line 40):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Save the file

## Step 5: Test the Form

1. Run your development server: `npm run dev`
2. Click the "Register Now" button
3. Fill out the form and submit
4. Check your Google Sheet - you should see the data appear!

## Troubleshooting

- **"Repository not found" error**: Make sure you deployed the script and copied the correct URL
- **Data not appearing**: Check that "Who has access" is set to "Anyone"
- **CORS errors**: The code uses `mode: 'no-cors'` which is correct for this setup
- **Authorization issues**: Make sure you authorized the script when deploying

## Security Note

Since the Web App is set to "Anyone" access, anyone with the URL can submit data. This is fine for a public registration form, but be aware that you may receive spam submissions. You can add additional validation in the Apps Script if needed.

