

# 🧩 Cortts Frontend UI Checklist

## ✅ Global Components

- [x] Button Variants
  - [x] Primary (solid)
  - [x] Secondary (outline)
  - [x] Tertiary (ghost)
  - [x] Disabled state
  - [x] Loading state
  - [x] Icons in buttons (left & right)
  - [x] Icon only

  - [ ] File Upload Input (for document signing)
  - [ ] Date Picker

- [ ] Text Variants
  - [ ] Headings (h1, h2, h3)
  - [ ] Paragraph
  - [ ] Caption
  - [ ] Emphasis / muted
  - [ ] Links

- [ ] Form Input Variants
  - [ ] Text input (default)
  - [ ] Password input (toggle visibility)
  - [ ] Number input
  - [ ] Select dropdown
  - [x] Checkbox
  - [ ] Radio button
  - [ ] Toggle switch
  - [ ] Error & validation states
  - [ ] Disabled state
  - [ ] Currency
  - [ ] URL

- [ ] Toast Notifications
  - [ ] Success toast
  - [ ] Error toast
  - [ ] Info toast
  - [ ] Custom icons / close behavior

## 📱 Screens (by role)

### Client
- [ ] Home screen
- [ ] Project list & details
- [ ] Unit list & details
- [ ] Document viewer
- [ ] Settings
- [ ] Profile
- [ ] Notifications or Updates feed (optional)

### Agent
- [ ] Dashboard
- [ ] Projects & Units (view-only)
- [ ] Client Management (create, update)
- [ ] Document handling (view/download)
- [ ] Profile & settings
- [ ] Assigned Units View (if applicable)

### Admin
- [ ] Admin Dashboard
- [ ] Project CRUD
- [ ] Unit CRUD
- [ ] Client Management (view-only)
- [ ] Agent Management
- [ ] Document Templates
- [ ] Signed Document Viewer
- [ ] Payment Overview
- [ ] Settings
- [ ] Notifications Log or System Logs
- [ ] Audit Log Viewer (based on backend discussion)

## 🎨 Theming
- [x] Light & dark theme support
- [x] Theme tokens for spacing, color, typography
- [x] Responsive font sizing
- [ ] Custom Theme Toggle Component
- [ ] Custom `useTheme` hook integration for styled components
- [ ] Context-aware color usage in reusable components (e.g., buttons, cards)
- [ ] Color palette documentation or Storybook showcase

## 🧪 Testing
- [ ] Component snapshot tests
- [ ] Form validation tests
- [ ] Navigation flow tests

## ⚙️ Utilities
- [x] `useClientOnlyValue` hook finalized
- [ ] Auth context and guard wrappers
- [ ] Query loading & error UI components
- [ ] Responsive `useResponsive` hook
- [ ] Secure Storage (hybrid with SecureStore and AsyncStorage)
- [ ] Global `axiosInstance` and interceptors
- [ ] React Query `queryFn` and `mutationFn` helpers