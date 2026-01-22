# **App Name**: QRU Prioridade

## Core Features:

- Occurrence Selection: Allow users to quickly select a type of occurrence from a grid of options.
- Search Field: Implement a search field to filter occurrences by name, code, or PR. This functionality is used like a tool for reasoning in the application.
- Occurrence Cards: Display each occurrence as a card with an icon, background color, and text. Implement the `onTap` functionality to show a SnackBar when a card is tapped. Integrate click/tap functionality to call the relavant report in Firestore.
- Bottom Navigation: Implement a fixed bottom navigation bar with icons for Home, Códigos, Ocorrências, Notas, and Ajustes.
- Firebase Initialization: Initialize Firebase in `main.dart` using `Firebase.initializeApp()` and prepare the structure for future integration with Firestore, Firebase Auth, and Firebase Storage.
- Placeholder Screens: Implement placeholder screens for each tab in the bottom navigation (Códigos, Ocorrências, Notas, Ajustes).

## Style Guidelines:

- Primary background color: Dark background (#0E0F14) for a modern dark mode aesthetic.
- Card background color: Slightly lighter dark color (#151823) to differentiate cards from the main background.
- Primary text color: White (#FFFFFF) for main text elements to ensure readability against the dark background.
- Secondary text color: Light gray (#D3D3D3) for subtitles and less important text.
- Font: 'Inter' (sans-serif) for both headlines and body text, providing a modern and clean look. Note: currently only Google Fonts are supported.
- Use white icons on the occurrence cards with a circular background of a vibrant color specific to each type of occurrence.
- Implement a grid layout for the occurrence cards with 4 columns, rounded borders (16px), and uniform spacing.
- Ensure the search field has a light background, a magnifying glass icon, and a placeholder text 'Buscar por ocorrência, código ou PR...'