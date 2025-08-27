chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "translate") {
        (async () => {
            try {
                const site = "https://api.mymemory.translated.net";
                const url = `${site}/get?q=${encodeURIComponent(message.query)}&langpair=en|${message.targetLang}`;
                console.log(url)
                const res = await fetch(url);
                const data = await res.json();
                sendResponse({ success: true, translatedText: data.responseData.translatedText });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }
});
