chrome.storage.session.setAccessLevel({
  accessLevel: chrome.storage.AccessLevel.TRUSTED_CONTEXTS
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action == "get-current-lang") {
    chrome.storage.session.get({"current-lang": "pt-BR"}, (result) => {
      sendResponse({ currentLang: result["current-lang"] })
    })
    return true
  }

  if (message.action == "set-current-lang") {
    chrome.storage.session.set({"current-lang": message.lang})
    return
  }

  if (message.action == "translate") {
    (async () => {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(message.query)}&langpair=${message.sourceLang}|${message.targetLang}`
        const req = await fetch(url)
        const res = await req.json()
        sendResponse({ success: true, translatedText: res.responseData.translatedText })
      } catch (e) {
        sendResponse({ success: false, error: e.message })
      }
    })()
    return true
  }
})