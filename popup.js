const addLangForm = document.querySelector("#ad-lang")
const translateLangForm = document.querySelector("#translate-lang")
langButtons()
defaultLang()

addLangForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const langBtn = document.querySelector("#ad-lang-button").value

   chrome.storage.local.get({"lang-buttons": []}, (result) => {
        const langs = result["lang-buttons"]
        if (!langs.some(l => l == langBtn)) {
            langs.push(langBtn)
        }

        chrome.storage.local.set({"lang-buttons": langs}, () => {
            langButtons()
        })
    })
})

translateLangForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const translationLang = document.querySelector("#translation-lang").value

    chrome.storage.local.set({"translate-lang": translationLang}, () => {
        console.log(`língua de tradução mudada para ${translationLang}`)
    })
})


function langButtons() {
    const btnSection = document.querySelector("section")
    btnSection.innerHTML = ''

    chrome.storage.local.get({ "lang-buttons": [] }, (result) => {
        const langs = result["lang-buttons"]

        langs.forEach(lang => {
            let etiquet = document.createElement("div")
            etiquet.className = "clear-lang"
            etiquet.textContent = lang

            let remove = document.createElement("span")
            remove.textContent = "×"

            remove.addEventListener("click", () => {
                const updated = langs.filter(l => l !== lang)
                chrome.storage.local.set({ "lang-buttons": updated }, langButtons)
            })

            etiquet.appendChild(remove)
            btnSection.appendChild(etiquet)
        })
    })
}

function defaultLang() {
    chrome.storage.local.get({"translate-lang": "pt-br"}, (result) => {
        const select = document.querySelector("#translation-lang")
        select.value = result["translate-lang"]
    })
}
