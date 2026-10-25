# Attendly

A simple, ad-free attendance tracker. Swipe to mark present or absent, see how many classes you can skip, and simulate absences with "What If".

## Features
- Overall and per-subject attendance
- Swipe right for present, left for absent
- "What If" calculator for planned absences
- Day-wise history log
- Edit or delete subjects and counts
- Fixed-total mode for courses with a set number of classes
- Light and dark themes, all data stored on-device

## Getting started
```bash
npm install
npx expo start
```
Requires Node 20+ and the Expo Go app or an Android emulator. Android builds use [EAS](https://docs.expo.dev/build/introduction/); set your own `extra.eas.projectId` and Android package in `app.json`.

## Tech
Expo (expo-router), React Native, NativeWind, Zustand, expo-sqlite.

## Contributing
Issues and PRs are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Support
Attendly is free. If it helps you, you can [star the repo](https://github.com/zenikio/attendly) or [chip in](https://razorpay.me/@zenik).

## License
[GPL-3.0](LICENSE). You can use and modify Attendly, but any distributed version (including modified ones) must also be open source under the same license.
