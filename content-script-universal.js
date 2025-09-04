const keysPressed = new Set()
let originalText = null
let lastInsertedNode = null
let searchExecuted = false

window.lastOriginalText = null
window.lastTranslation = null

// keyboard events
document.addEventListener("keydown", (e) => {
    keysPressed.add(e.key)

    // logic to translate selection inline
    if (keysPressed.has("Shift") && (keysPressed.has("t") || keysPressed.has("T")) && !searchExecuted) {
        searchExecuted = true
        const selection = window.getSelection()
        if (!selection.rangeCount || selection.rangeCount > 500)
            return console.warn("select a text with a maximum of 500 characters")

        const range = selection.getRangeAt(0)
        const selectedText = range.toString()

        if (selectedText === window.lastOriginalText && window.lastTranslation) {
            //console.log("Tradução reutilizada: " + window.lastTranslation)
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


    //logic to get meaning of word
    if (keysPressed.has("Shift") && (keysPressed.has("d") || keysPressed.has("D")) && !searchExecuted) {
        const selection = window.getSelection()
        const searchWord = selection.getRangeAt(0).toString().trim()
        console.log(searchWord)
        if (!selection.rangeCount || searchWord.includes(" "))
            return console.warn("Select a only word")
        
        let lang = document.documentElement.lang
        chrome.runtime.sendMessage({ action: "get-current-lang" }, (response) => {
            lang = lang || response.currentLang
            chrome.runtime.sendMessage({
                action: "dictionary",
                sourceLang: lang
            }, (response) => {
                if (response.success && !selection.isCollapsed) {
                    console.log(response.html)
                } else {
                    console.error(response.error)
                }
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


