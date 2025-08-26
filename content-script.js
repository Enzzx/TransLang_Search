const searchForm = document.querySelector("#searchform")
const firstNode = searchForm.firstElementChild
const lastNode = searchForm.lastElementChild

searchForm.style.top = "5px"
firstNode.style.height = "100px"

const toolsBar = document.querySelector("[data-sd-cp]")
toolsBar.firstElementChild.style.marginTop = "20px"


const extensionDiv = document.createElement("div")
extensionDiv.className = 'extension-div'

chrome.storage.local.get({"lang-buttons": []}, (result) => {
    const langs = result["lang-buttons"]

    langs.forEach(lang => {
        let etiquet = document.createElement("span")
        etiquet.textContent = lang

        etiquet.addEventListener("click", () => {
            //add api call and re-search
        })

        extensionDiv.appendChild(etiquet)
        console.log(`língua ${lang} adicionada`)
    })
})


searchForm.appendChild(extensionDiv)
console.log("adicionado extensionDiv")