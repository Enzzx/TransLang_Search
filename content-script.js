const searchForm = document.querySelector("#searchform")
const firstNode = searchForm.firstElementChild
const lastNode = searchForm.lastElementChild

searchForm.style.top = "5px"
firstNode.style.height = "110px"

const toolsBar = document.querySelector("[data-sd-cp]")
toolsBar.firstElementChild.style.marginTop = "20px"

const extensionDiv = document.createElement("div")
extensionDiv.className = 'extension-div'

chrome.storage.local.get({ "lang-buttons": [] }, (result) => {
    const langs = result["lang-buttons"]

    langs.forEach(lang => {
        let etiquet = document.createElement("span")
        etiquet.textContent = lang

        etiquet.addEventListener("click", async () => {
            console.log("clicou")
            let query = document.querySelector("textarea").value
            try {
                chrome.runtime.sendMessage({
                    action: "translate",
                    query: query,
                    targetLang: lang
                }, (response) => {
                    if (response.success) {
                        const translatedQuery = response.translatedText
                        let restOfSearch = window.location.search
                        restOfSearch = restOfSearch.substring(restOfSearch.indexOf('&'))

                        window.location.href = `search?q=${translatedQuery}${restOfSearch}`
                    } else {
                        console.error('Erro na tradução:', response.error)
                    }
                })
            } catch (e) {
                console.error('Erro:', e)
            }
        })

        extensionDiv.appendChild(etiquet)
    })
})

searchForm.appendChild(extensionDiv)
console.log("adicionado extensionDiv")