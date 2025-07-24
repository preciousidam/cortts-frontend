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

- [x] Text Variants
  - [x] Headings (h1, h2, h3)
  - [x] Paragraph
  - [x] Caption
  - [ ] Emphasis / muted
  - [ ] Links

- [x] Form Input Variants
  - [x] Text input (default)
  - [x] Password input (toggle visibility)
  - [ ] Number input
  - [x] Select dropdown (single & multi-select)
  - [x] Checkbox
  - [ ] Radio button
  - [ ] Toggle switch
  - [x] Error & validation states
  - [x] Disabled state
  - [x] Currency
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
- [x] Custom `useTheme` hook integration for styled components
- [x] Context-aware color usage in reusable components (e.g., buttons, cards)
- [ ] Color palette documentation or Storybook showcase

## 🧪 Testing
- [ ] Component snapshot tests
- [ ] Form validation tests
- [ ] Navigation flow tests

## ⚙️ Utilities
- [x] `useClientOnlyValue` hook finalized
- [x] Auth context and guard wrappers
- [x] Query loading & error UI components
- [x] Responsive `useResponsive` hook
- [x] Secure Storage (hybrid with SecureStore and AsyncStorage)
- [x] Global `axiosInstance` and interceptors
- [x] React Query `queryFn` and `mutationFn` helpers

## 📦 Zustand Store
- [x] Auth token state
- [x] Selectors & actions
- [x] Hydration on app reload

## 📖 Storybook
- [x] Setup complete
- [x] Button stories
- [x] TextInput stories
- [x] Checkbox stories
- [x] Dropdown stories
- [x] Typography stories