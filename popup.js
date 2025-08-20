const addLangForm = document.querySelector("#add-lang")
const translateLangForm = document.querySelector("#translate-lang")

addLangForm.addEventListener("onsubmit", (e) => {
    e.preventDefault()
    const langBtn = document.querySelector("#add-lang-button").value

   chrome.storage.sync.get({"lang-buttons": []}, (result) => {
        const langs = result.chave
        langs.push(langBtn)

        chrome.storage.set({"lang-buttons": langs}, () => {
            console.log(`${langBtn} adicionado à lista`)
        })
    })
})

translateLangForm.addEventListener("onsubmit", (e) => {
    e.preventDefault()
    const translationLang = document.querySelector("#translation-lang").value

    chrome.storage.sync.set({"translate-lang": translationLang}, () => {
        console.log(`língua de tradução mudada para ${translationLang}`)
    })
})