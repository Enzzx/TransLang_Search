const keysPressed = new Set()
let originalText = null
let lastInsertedNode = null
let searchExecuted = false

window.lastOriginalText = null
window.lastTranslation = null

document.addEventListener("keydown", (e) => {
    keysPressed.add(e.key)

    if (keysPressed.has("Shift") && (keysPressed.has("t") || keysPressed.has("T")) && !searchExecuted) {
        searchExecuted = true
        const selection = window.getSelection()
        if (!selection.rangeCount || selection.rangeCount > 500)
            return console.warn("Selecione um texto com no máximo 500 caracteres")

        const range = selection.getRangeAt(0)
        const selectedText = range.toString()

        if (selectedText === window.lastOriginalText && window.lastTranslation) {
            console.log("Tradução reutilizada: " + window.lastTranslation)
            range.deleteContents()
            lastInsertedNode = document.createTextNode(window.lastTranslation)
            range.insertNode(lastInsertedNode)
            return
        }

        originalText = selectedText
        let lang = document.documentElement.lang

        chrome.runtime.sendMessage({ action: "get-current-lang" }, (response) => {
            lang = lang || response.currentLang
            chrome.storage.local.get({ "translate-lang": "pt-BR" }, (result) => {
                chrome.runtime.sendMessage({
                    action: "translate",
                    query: originalText,
                    sourceLang: lang,
                    targetLang: result["translate-lang"]
                }, (response) => {
                    if (response.success && !selection.isCollapsed) {
                        range.deleteContents()
                        lastInsertedNode = document.createTextNode(response.translatedText)
                        range.insertNode(lastInsertedNode)

                        window.lastOriginalText = originalText
                        window.lastTranslation = response.translatedText
                    } else {
                        console.error(response.error)
                    }
                })
            })
        })
    }
})

document.addEventListener("keyup", (e) => {
    keysPressed.delete(e.key)

    if ((e.key === "Shift" || e.key.toLowerCase() === "t") && lastInsertedNode && originalText) {
        lastInsertedNode.textContent = originalText
    }

    searchExecuted = false
})
