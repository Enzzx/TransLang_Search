chrome.storage.session.setAccessLevel({
  accessLevel: chrome.storage.AccessLevel.TRUSTED_CONTEXTS
})

// RUNTIME LISTENERS
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // get current language
  if (message.action === "get-current-lang") {
    chrome.storage.session.get({ "current-lang": "pt-BR" }, (result) => {
      sendResponse({ currentLang: result["current-lang"] })
    })
    return true
  }

  // set new current language
  if (message.action === "set-current-lang") {
    chrome.storage.session.set({ "current-lang": message.lang }, () => {
      sendResponse({ success: true })
    })
    return true
  }

  // call translate function and send to content script
  if (message.action === "translate") {
    translateAPI(message.query, message.sourceLang, message.targetLang, (err, text) => {
      if (err) {
        sendResponse({ success: false, error: err })
      } else {
        sendResponse({ success: true, translatedText: text })
      }
    })
    return true
  }

  // call dictionary function and send to content script
  if (message.action === "dictionary") {
    dictionaryAPI(message.word, message.sourceLang, (err, text) => {
      if (err) {
        sendResponse({ success: false, error: err })
      } else {
        sendResponse({ success: true, html: text })
      }
    })
    return true
  }
})


// CONTEXT MENU OPTION LISTENER
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateselectionection",
    title: "Translate the selectionected text",
    contexts: ["selectionection"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateselectionection") {
    // verification for out of range selectionection (0 < text <= 500)
    if (!info.selectionectionText || info.selectionectionText.length === 0 || info.selectionectionText.length > 500) {
      return console.warn("select a text with a maximum of 500 characters")
    }

    // get current lang from session, compare with the one from html page then get the translate lang from local storage, so send to runtime listener to translate and execute script in page to show
    chrome.storage.session.get({ "current-lang": "pt-BR" }, (GCLresponse) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.lang
      }, (results) => {
        const pageLang = results[0].result || GCLresponse["current-lang"]

        chrome.storage.local.get({ "translate-lang": "pt-BR" }, (result) => {
          translateAPI(info.selectionectionText, pageLang, result["translate-lang"], (err, text) => {
            if (!err) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (newText) => {
                  const selection = window.getSelection()

                  const range = selection.getRangeAt(0)
                  const originalText = range.toString()

                  range.deleteContents()
                  const newNode = document.createTextNode(newText)
                  range.insertNode(newNode)

                  let lastReplacedNode = newNode
                  const onSelectionChange = () => {
                    const selectionNow = window.getSelection();
                    if (selectionNow.isCollapsed && lastReplacedNode) {
                      lastReplacedNode.textContent = originalText;
                      lastReplacedNode = null;
                      document.removeEventListener('selectionchange', onSelectionChange);
                    }
                  };
                  document.addEventListener('selectionchange', onSelectionChange);
                },
                args: [text]
              })

            } else {
              console.error("Translation error: " + err)
            }
          })
        })
      })
    })
  }
})


// TRANSLATE FUNCTION AND SEND BACK AS CALLBACK
async function translateAPI(query, sourceLang, targetLang, callback) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${sourceLang}|${targetLang}`
    const req = await fetch(url)
    const res = await req.json()
    if (res.responseStatus != "200") {
      callback(res.responseData.translatedText)
    } else {
      callback(null, res.responseData.translatedText)
    }

  } catch (e) {
    throw e
  }
}

// DICTIONARY SEARCH FUNCTION AND SEND BACK AS CALLBACK
function dictionaryAPI(word, sourceLang, callback) {
  translateAPI(word, sourceLang, "pt-br", async (err, translatedWord) => {
    if (!err) {
      try {
        const url = `https://pt.wiktionary.org/api/rest_v1/page/html/${encodeURIComponent(translatedWord)}`
        const req = await fetch(url)
        const contentType = req.headers.get("content-type") || ""
        
        if (contentType.includes("json")) {
          const res = await req.json()
          callback(res.messageTranslations[0])
        } else{
          const res = await req.text()
          callback(null, res)
        }

      } catch (e) {
        throw e
      }
    } else {
      return err
    }
  })
}