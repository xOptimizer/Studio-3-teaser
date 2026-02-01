# Google Sheets Integration Setup Guide

Follow these steps to connect the registration form to Google Sheets:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Studio 3 Registrations" (or any name you prefer)
4. In Row 1, add these column headers (in this exact order):
   - **Column A**: `Name`
   - **Column B**: `Email`
   - **Column C**: `Phone`
   - **Column D**: `Creative Practice`
   - **Column E**: `Collector Interests`
   - **Column F**: `Enthusiast Interests`
   - **Column G**: `City`
   - **Column H**: `Role`
   - **Column I**: `Ambassador Info`
   - **Column J**: `Timestamp`

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
    
    // Handle enthusiastInterests array - join with semicolons if it's an array
    let enthusiastInterests = '';
    if (data.enthusiastInterests && Array.isArray(data.enthusiastInterests)) {
      enthusiastInterests = data.enthusiastInterests.join('; ');
    } else if (data.enthusiastInterests) {
      enthusiastInterests = data.enthusiastInterests;
    }
    
    // Map data to columns in exact order matching your sheet:
    // Name | Email | Phone | Creative Practice | Collector Interests | Enthusiast Interests | City | Role | Ambassador Info | Timestamp
    const rowData = [
      data.name || '',                    // Column A: Name
      data.email || '',                   // Column B: Email
      data.phone || '',                   // Column C: Phone
      data.creativePractice || '',        // Column D: Creative Practice
      data.collectorInterests || '',      // Column E: Collector Interests
      enthusiastInterests,                // Column F: Enthusiast Interests
      data.city || '',                    // Column G: City
      data.role || '',                    // Column H: Role
      data.ambassadorInfo ? 'Yes' : 'No', // Column I: Ambassador Info
      timestamp                           // Column J: Timestamp
    ];
    
    sheet.appendRow(rowData);
    
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
2. Find this line (around line 91):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbymzzAV-kE29HFAEMJMn6sLLfEqDJRHvaRgfskvP56MhlW3qi416XrGGpNjBxkNVGO7iQ/exec';
   ```
3. If you're using your own Google Sheet, replace the URL with your Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
4. Save the file

## Important: If You Already Have a Google Sheet Set Up

If you've already created a Google Sheet with the old column structure, you need to:

1. **Update your Google Sheet columns** - Add the missing column headers in Row 1. Your current columns are:
   - Name, Email, Phone, Creative Practice, City, Role, Ambassador Info, Timestamp
   
   You need to **add these two new columns**:
   - **Column E**: `Collector Interests` (insert after "Creative Practice")
   - **Column F**: `Enthusiast Interests` (insert after "Collector Interests")
   
   Final column order should be:
   - Name | Email | Phone | Creative Practice | **Collector Interests** | **Enthusiast Interests** | City | Role | Ambassador Info | Timestamp
2. **Update your Apps Script code** - Replace the old `doPost` function with the new one above that handles all the new fields
3. **Redeploy your Web App** - After updating the script:
   - Click **Deploy** → **Manage deployments**
   - Click the pencil icon (✏️) next to your deployment
   - Click **Deploy** again (you may need to update the version number)
   - The URL should remain the same, but make sure to test it

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

### Data Mismatch / Wrong Columns

If data is appearing in the wrong columns, verify your Google Sheet has **exactly** these columns in **this exact order** (Row 1):

1. **Column A**: `Name`
2. **Column B**: `Email`
3. **Column C**: `Phone`
4. **Column D**: `Creative Practice`
5. **Column E**: `Collector Interests` ⚠️ **Make sure this column exists!**
6. **Column F**: `Enthusiast Interests` ⚠️ **Make sure this column exists!**
7. **Column G**: `City`
8. **Column H**: `Role`
9. **Column I**: `Ambassador Info`
10. **Column J**: `Timestamp`

**Important**: If you're missing columns E and F (Collector Interests and Enthusiast Interests), the data will shift and appear in the wrong columns. Make sure to insert these two columns after "Creative Practice" and before "City".

**To fix column order:**
1. Right-click on the column header where you want to insert
2. Select "Insert 1 column left" or "Insert 1 column right"
3. Add the missing column headers
4. Make sure all columns are in the exact order listed above

## Security Note

Since the Web App is set to "Anyone" access, anyone with the URL can submit data. This is fine for a public registration form, but be aware that you may receive spam submissions. You can add additional validation in the Apps Script if needed.

