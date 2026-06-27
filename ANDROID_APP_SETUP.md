# 9 BAR Android App - Private Distribution Setup

## Overview
The 9 BAR specialty coffee app has been converted to a private Android application that is:
- **Only accessible to: Owner and Website Manager**
- **Not discoverable on Play Store**
- **Authenticated via phone OTP + admin secret**
- **Packaged using Capacitor for cross-platform compatibility**

## Completed Setup ✅

### 1. **Brand Conversion**
- ✅ All "Brew4You" references converted to "9 BAR"
- ✅ Custom coffee-themed Tailwind palette applied
- ✅ Premium branding implemented across all pages

### 2. **Private Access Control**
- ✅ Phone-based OTP authentication system active
- ✅ Admin secret validation for restricted routes
- ✅ Session cookies (ninebar_admin) for admin access
- ✅ Role-based access control implemented

### 3. **Capacitor Mobile Wrapper**
- ✅ Capacitor installed and configured
- ✅ Android platform added to project
- ✅ Web assets synced to Android platform
- ✅ App ID: `com.nineBar.coffee`
- ✅ App Name: `9 BAR`

### 4. **Project Structure**
```
Brew4You/
├── android/                      # Android native project
│   ├── app/src/main/assets/     # Web app assets
│   └── build/                    # Build output
├── web/                          # Web app loader
│   └── index.html               # Boots and redirects to backend
├── .next/standalone/            # Production server build
├── capacitor.config.ts          # Capacitor configuration
└── next.config.mjs              # Next.js standalone build config
```

## Next Steps - APK Building

### Prerequisites (INSTALL FIRST)
1. **Java Development Kit (JDK) 11+**
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Or use: `choco install openjdk11` (if using Chocolatey)
   - Set JAVA_HOME environment variable

2. **Android SDK**
   - Download Android Studio: https://developer.android.com/studio
   - Or just the command-line tools
   - Run `sdkmanager` to install platform tools

3. **Set up environment variables**
   ```powershell
   # In PowerShell (run as Administrator):
   [Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11.0.x", "Machine")
   [Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\YourUsername\AppData\Local\Android\Sdk", "Machine")
   ```

### Build APK

Once Java and Android SDK are installed:

```bash
# Build debug APK (for testing)
cd C:\Users\mouhi\Desktop\Brew4You
npx cap build android --debug

# Or build release APK (for distribution)
npx cap build android --release
```

Output APK location: `android/app/build/outputs/apk/`

## Backend Configuration

### For Private Users (Owner/Manager)

1. **Login credentials required:**
   - Phone number (for OTP verification)
   - Admin secret (provided separately)

2. **API endpoints:**
   - OTP Send: `POST /api/auth/send-otp`
   - OTP Verify: `POST /api/auth/otp-verify`
   - Admin Login: `POST /api/admin/login`

3. **Environment variables needed:**
   ```
   TWILIO_ACCOUNT_SID=xxx
   TWILIO_AUTH_TOKEN=xxx
   TWILIO_PHONE_NUMBER=+1...
   
   ADMIN_SECRET=your_secret_here
   MONGODB_URI=your_mongodb_connection
   
   NEXT_PUBLIC_PHONE=+923000000000
   NEXT_PUBLIC_EMAIL=hello@9bar.coffee
   ```

## Development & Testing

### Run locally for testing:
```bash
# Terminal 1: Start backend server
cd Brew4You
npm run dev  # Runs on http://localhost:3000

# Terminal 2: Run app in Android emulator
npx cap run android
```

### Test in browser:
```bash
# Access at http://localhost:3000 on desktop
# Or open Capacitor app on device/emulator
```

## Distribution - Secure APK Sharing

### Method 1: Email Distribution
1. Build release APK
2. Sign APK with private key
3. Email signed APK only to authorized users

### Method 2: WhatsApp Distribution  
1. Sign APK with private key
2. Upload to encrypted cloud storage
3. Share link via WhatsApp only to owner/manager
4. Recipients scan QR code to download

### Method 3: Internal Dashboard
1. Create admin panel for APK version management
2. Host signed APK on private endpoint with authentication
3. Users can download through authenticated download link

## Key Security Features ✅

- ✅ **Private Package ID**: `com.nineBar.coffee` (not published)
- ✅ **Phone Authentication**: OTP-based login
- ✅ **Admin Verification**: Secret key validation
- ✅ **Session Management**: Secure HTTP-only cookies
- ✅ **Encrypted Communication**: HTTPS/TLS (when deployed)
- ✅ **Role-based Access**: Admin-only routes protected
- ✅ **MongoDB Auth**: User verification on backend

## Troubleshooting

### Build fails with "Cannot find java"
- Install JDK 11+ and set JAVA_HOME environment variable
- Restart terminal/IDE after setting environment variables

### Capacitor sync fails
- Ensure `web/index.html` exists
- Check `capacitor.config.ts` points to correct webDir
- Run: `npx cap sync android`

### App not loading
- Check backend is running (if using localhost)
- Verify authentication credentials
- Check browser console for CORS/API errors

## Deployment Checklist

- [ ] Java Development Kit installed
- [ ] Android SDK installed
- [ ] Build release APK
- [ ] Sign APK with private key
- [ ] Test on Android device/emulator
- [ ] Document distribution method
- [ ] Create user instructions
- [ ] Set up backup distribution channel (email)
- [ ] Monitor for app crashes/issues

---

**App Status**: Ready for APK building and private distribution
**Last Updated**: 2026-06-27
**Version**: 1.0.0
