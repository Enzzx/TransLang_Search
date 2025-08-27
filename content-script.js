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

        etiquet.addEventListener("click", () => {
            console.log("clicou")
            let query = document.querySelector("textarea").value
            const head = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }

            chrome.storage.local.get({ "translate-lang": "pt-br" }, async (result) => {
                try {
                    const req = await fetch(`https://api.mymemory.translated.net/get?q=${query}&langpair=en|${result["translate-lang"]}`, head)
                    const res = await req.json()
                    console.log(res)
                    const translatedQuery = res.responseData.translatedText
                    let restOfSearch = window.location.search
                    restOfSearch = restOfSearch.substring(restOfSearch.indexOf('&sca_esv='))

                    window.location.href = `${window.location}/search?q=${translatedQuery}${restOfSearch}`
                } catch (e) {
                    throw e
                }
            })
        })

        extensionDiv.appendChild(etiquet)
        console.log(`língua ${lang} adicionada`)
    })
})


searchForm.appendChild(extensionDiv)
console.log("adicionado extensionDiv")