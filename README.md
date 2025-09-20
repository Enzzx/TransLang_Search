# TransLang Search - CS50 Final Project  

TransLang Search is a Chrome extension that provides translation and dictionary lookups directly inside any web page, helping users overcome language barriers while browsing.  

## Overview  
TransLang Search is my CS50 final project, that integrates three main features: Google search translation with customizable buttons, inline text translation with temporary replacement, and instant dictionary lookups. It uses the MyMemory Translation API and the Wiktionary API to get the required translations.  

The extension’s translation feature doesn’t switch text permanently; instead, it temporarily replaces the selected text, which reverts once it is deselected. Similarly, the dictionary lookup feature creates a popup box that is only visible while the word remains selected. This approach preserves the original content of webpages by ensuring all changes are reversible.  

The project improved and demonstrated my JavaScript skills, particularly in handling multiple APIs, implementing verification processes, and modifying webpage UIs.


## Core Functionality  

### Google Search Translation  
When users visit Google.com, the extension adds language buttons below the search bar. Queries typed in any language are detected with Franc, translated with MyMemory, and the page reloads with translated results. The users can configure which language buttons appear through the extension popup.  

### Inline Text Translation  
Users can select up to 500 characters on any webpage and press `Shift+T` (or use the context menu) to temporarily translate the text into the pre-selected language. The original content is restored when focus is lost. This preserves the webpage’s integrity while providing user-friendly instant translations.

### Dictionary Definitions  
By selecting a word and pressing `Shift+D` (or using the context menu), the extension translates it to the pre-selected language, queries Wiktionary, cleans the HTML, and displays the definition in a floating window at the top-right corner of the screen.  

## Implementation and Structure  

The extension follows Chrome Manifest V3 with a service worker architecture:  

- **manifest.json**: defines permissions and content scripts.  
- **background.js**: acts as the service worker, managing API requests, Chrome storage, context menus, and routing between components.  
- **popup.html / popup.js**: provide the interface for customizing language buttons and selecting default translation languages. They manage local storage for user preferences and populate dropdowns using helper files in `utils/`.  
- **content-script-search.js / css**: handle modifications on Google search, injecting styled buttons and processing query translations.  
- **content-script-universal.js / css**: implement keyboard shortcuts, text replacements, and dictionary popups across all websites.  
- **utils/**: contains `iso-map.js` for converting Franc codes to ISO standards and `languagetags.js` for dictionaries used in dropdowns.  

## Key Design Decisions  

- **Translation API**: I chose MyMemory instead of Google Translate because of its free tier and simpler usage, which fit my project well. Although it has limitations, it provides sufficiently reliable translations.
- **Dictionary Source**: Wiktionary was selected for being free, comprehensive, and offering multilingual word definitions.
- **Temporary Replacement**: Instead of modifying webpage content permanently, translations are temporary and revert with user interaction. This required careful event handling but results in a more polished user experience.  
- **Storage Strategy**: Session storage tracks current language state during browsing, while local storage keeps user preferences across sessions.  
- **Modular Scripts**: Google-specific functionality is separated from universal features, improving maintainability and performance while making it easier to expand.  
- **Error Handling**: Clear console warnings guide users if they exceed the 500-character limit or attempt dictionary lookups on multiple words.  

## Technical Challenges and Solutions  

- **Managing Temporary Replacements**: Restoring original text required tracking selections and user interactions. I solved this with selection change listeners and keyup events.  
- **Parsing Wiktionary HTML**: Definitions came with unnecessary attributes. The extension strips them while preserving structure, ensuring clean display.  
- **Language Detection**: Franc returns codes that differ from ISO standards, so I built conversion utilities to handle mappings, edge cases, and fallbacks.  

## Conclusion  

TransLang Search demonstrates end-to-end web development skills: Chrome Extension API usage, external API integration, DOM manipulation, and responsive UI design. It provides a practical solution to language barriers with a modular and maintainable architecture that balances functionality and user experience.  

The project highlights problem-solving through clean design choices: non-intrusive translations, careful storage management, and reliable integration with free APIs. By combining translation, inline interaction, and dictionary definitions, the extension creates a smooth multilingual browsing experience.  

While built as a student project, the structure leaves room for future improvements such as additional APIs, offline caching, or broader language support. **TransLang Search** ultimately reflects the core CS50 values of creativity, rigor, and real-world application.  

Link: [Project presentation video](https://youtube.com)
