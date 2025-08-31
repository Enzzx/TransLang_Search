const searchForm = document.querySelector("#searchform")
const firstNode = searchForm.firstElementChild
//const lastNode = searchForm.lastElementChild

// DOM styling
searchForm.style.top = "5px"
firstNode.style.height = "110px"

const toolsBar = document.querySelector("[data-sd-cp]")
toolsBar.firstElementChild.style.marginTop = "20px"

const extensionDiv = document.createElement("div")
extensionDiv.className = 'extension-div'


// create buttons below search-bar
chrome.storage.local.get({ "lang-buttons": [] }, (result) => {
    const langs = result["lang-buttons"]

    langs.forEach(lang => {
        let etiquet = document.createElement("span")
        etiquet.textContent = lang
        let query = document.querySelector("textarea").value

        // reload page with search query translated to button language 
        etiquet.addEventListener("click", async () => {
            /* alert(franc(query))
            if (franc(query) == "por") {
                chrome.runtime.sendMessage({ action: "set-current-lang", lang: "pt-BR" })
                alert("detectada pesquisa em poretugues")
            } */
            chrome.runtime.sendMessage({ action: "get-current-lang" }, (response) => {
                const currentLang = response.currentLang || "pt-BR"

                try {
                    chrome.runtime.sendMessage({
                        action: "translate",
                        query: query,
                        sourceLang: currentLang,
                        targetLang: lang
                    }, (response) => {
                        if (response.success) {
                            const translatedQuery = response.translatedText
                            let restOfSearch = window.location.search
                            restOfSearch = restOfSearch.substring(restOfSearch.indexOf('&'))

                            chrome.runtime.sendMessage({ action: "set-current-lang", lang })
                            window.location.href = `search?q=${translatedQuery}${restOfSearch}`

                        } else {
                            alert('Erro na tradução:', response.error)
                        }
                    })
                } catch (e) {
                    console.error('Erro:', e)
                }
            })
        })

        extensionDiv.appendChild(etiquet)
    })
})

searchForm.appendChild(extensionDiv)
console.log("adicionado extensionDiv")

// shift hold translate text selection
