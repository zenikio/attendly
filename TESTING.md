# Manual test checklist

Run through these one by one on a real Android device (`npx expo start`, open in a dev build or Expo Go). Tick each box as you go.

## 1. Startup and themes
- [ ] Fresh install / cleared data: app opens without a red error screen
- [ ] Onboarding shows, finishing it lands on the home screen
- [ ] Settings > Appearance: System, Light and Dark each change colours and status bar
- [ ] Close and reopen the app: the chosen theme is remembered
- [ ] With System selected, change the phone's dark mode: app follows

## 2. Adding subjects
- [ ] Add a subject with no counts (Skip): it appears grey at 0 / 0, no red
- [ ] Add a subject with starting counts (e.g. 8 attended of 10)
- [ ] Add a subject in Fixed Total Mode with total 40 and 10 attended
- [ ] Empty name shows the "Subject Required" toast

## 3. Swiping
- [ ] Swipe right: green "Present" panel appears, attended and total go up by 1
- [ ] Swipe left: red "Absent" panel appears, only total goes up by 1
- [ ] Panel colours look right in both light and dark themes
- [ ] Two quick swipes in a row both count
- [ ] Fixed Total Mode: Present raises attended only, total stays, never exceeds total
- [ ] Fixed Total Mode: Absent changes no numbers

## 4. Home screen numbers
- [ ] Overall percentage matches the weighted average
- [ ] Hero card has rounded corners
- [ ] Each card shows "Can miss N", "Attend N more" or "On track" correctly
- [ ] Returning from another screen refreshes the list without a spinner flash

## 5. Target percentage (Settings > Attendance)
- [ ] Change target to 60: colours, advice text, Hero message and What If update
- [ ] Change target to 90: same, in the other direction
- [ ] Target survives closing and reopening the app

## 6. Show absent count (Settings)
- [ ] Toggle on: cards show absent count with "absent" label
- [ ] Fixed Total subjects still show attended / total
- [ ] Toggle off: back to attended / total

## 7. Subject detail
- [ ] Tap a subject: detail opens with the right numbers and advice
- [ ] Lower "Classes Held" below "Classes Attended": attended follows down, no stuck buttons
- [ ] Raise held, then raise attended: both work
- [ ] Edit the name, Save Changes: list updates
- [ ] Back with unsaved changes: warning modal appears
- [ ] Toggle Fixed Total Mode and save: card behaviour switches
- [ ] Delete Subject: confirm modal, subject disappears, its history is gone

## 8. History
- [ ] History tab shows today's swipes; the date picker shows other days
- [ ] Detail > Recent History lists entries newest first
- [ ] Tap the x on a Present entry: dialog explains attended and total go down by 1; confirm and check the numbers
- [ ] Remove an Absent entry: dialog says total goes down by 1; check the numbers
- [ ] Fixed Total subject: dialog wording matches the fixed-mode rules
- [ ] Trying to remove an entry with unsaved edits shows "Save or discard" message

## 9. What If
- [ ] Screen opens without an error
- [ ] Increase "Classes to Miss": the After Missing percentage and total change
- [ ] "Safe to skip" text matches the target

## 10. Other
- [ ] Modals open and close quickly
- [ ] FAQ opens and reads correctly (target, undo-by-mistake entry)
- [ ] Settings > Open Source: GitHub, Report an Issue and Support links open
- [ ] Rate on Play Store opens
- [ ] Background the app for a while and reopen: no crash
