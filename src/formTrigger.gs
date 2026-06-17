// GITHUB_TOKEN defined as project property
const GITHUB_TOK = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
const GITHUB_REPO = 'ASBTEC/qr-generator';
const WORKFLOW_FILE = 'build_send_qr.yml';
const GITHUB_REF = 'master';

/**
 * Sheet-bound form submissions put file-upload answers as Drive URLs,
 * e.g. "https://drive.google.com/open?id=FILE_ID".
 * This helper extracts the bare file ID so the workflow can download it.
 */
function extractDriveFileId(raw) {
  if (!raw) return null;
  // https://drive.google.com/open?id=FILE_ID  or  ?id=FILE_ID&...
  var m = raw.match(/[?&]id=([\w-]+)/);
  if (m) return m[1];
  // https://drive.google.com/file/d/FILE_ID/view
  m = raw.match(/\/d\/([\w-]+)/);
  if (m) return m[1];
  // Already a bare file ID
  if (/^[\w-]{25,}$/.test(raw.trim())) return raw.trim();
  return null;
}

function onFormSubmit(e) {
  const values = e.values;
  console.log('[qr-gen] values length:', values.length);
  console.log('[qr-gen] values:', JSON.stringify(values));

  // Column order: Timestamp | URL | Email | (empty) | Logo (optional file upload)
  const url      = values[1];
  const email    = values[2];
  const logoRaw  = values[4] || '';
  console.log('[qr-gen] logoRaw (values[4]):', logoRaw);

  const logo_file_url  = extractDriveFileId(logoRaw) || '';
  console.log('[qr-gen] extracted logo_file_url:', logo_file_url);

  const endpoint = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`;

  const inputs = { url, email, logo_file_url };

  const payload = {
    ref: GITHUB_REF,
    inputs
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${GITHUB_TOK}`,
      Accept: 'application/vnd.github+json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(endpoint, options);
  Logger.log(response.getContentText());
}

// Simulates a form submission without a logo (original behaviour)
function testDispatch() {
  const fakeEvent = {
    values: [
      "2025-04-17 12:34:00",
      "https://linkedin.com/in/creilla",
      "amarine@asbtec.cat",
      "",  // empty column (index 3)
      ""   // no logo
    ]
  };
  onFormSubmit(fakeEvent);
}

// Simulates a form submission with a logo uploaded to Drive
function testDispatchWithLogo() {
  const fakeEvent = {
    values: [
      "2025-04-17 12:34:00",
      "https://linkedin.com/in/creilla",
      "amarine@asbtec.cat",
      "",  // empty column (index 3)
      "https://drive.google.com/open?id=1WpgQsJa88OOoJ4oSQUUxDpOd2Pxosi3E"
    ]
  };
  onFormSubmit(fakeEvent);
}
