# Publish to Expo Go via EAS Update

The goal: generate a permanent QR code / shareable link that opens this app
inside Expo Go. Takes ~3 minutes total.

## One-time setup (only needed the first time)

On your laptop, from `medellin-invest-mvp/`:

```bash
# 1. Install deps (skip native postinstalls you don't need)
npm install --ignore-scripts

# 2. Auth with your Expo token
export EXPO_TOKEN=<your-expo-token>

# 3. Link the project to your Expo account — this fills in the project ID
#    in app.json and creates the project on expo.dev
npx eas-cli init --non-interactive

# 4. Configure EAS Update (creates the update channels)
npx eas-cli update:configure --non-interactive
```

## Publish (every time you want to share a new build)

```bash
export EXPO_TOKEN=<your-expo-token>
npx eas-cli update --branch preview --message "Phase 1 MVP"
```

Output:

- A QR code printed in the terminal
- A permanent URL like:
  `https://expo.dev/accounts/<you>/projects/medellin-invest-mvp/updates/<id>`

## How a tester opens it

1. Install **Expo Go** from the App Store / Play Store.
2. On iOS, scan the QR with the Camera app → tap the banner → opens in Expo Go.
3. On Android, open Expo Go → "Scan QR code".

The QR keeps working forever (or until you delete the update). No laptop needs
to be running.

## Windows / no-export-var

If your shell is Windows PowerShell:

```powershell
$env:EXPO_TOKEN = "<your-expo-token>"
npx eas-cli update --branch preview --message "Phase 1 MVP"
```

Command Prompt:

```cmd
set EXPO_TOKEN=<your-expo-token>
npx eas-cli update --branch preview --message "Phase 1 MVP"
```
