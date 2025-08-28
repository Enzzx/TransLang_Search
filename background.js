chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "translate") {
        (async () => {
            try {
                const originalLang = message.targetLang == "pt-br" ? "en" : "pt-br"
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(message.query)}&langpair=${originalLang}|${message.targetLang}`
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