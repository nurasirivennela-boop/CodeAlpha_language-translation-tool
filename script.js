// Get HTML elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const swapButton = document.getElementById("swapButton");

const copyButton = document.getElementById("copyButton");
const speakButton = document.getElementById("speakButton");
const clearButton = document.getElementById("clearButton");

const status = document.getElementById("status");


// ===============================
// TRANSLATE TEXT
// ===============================

translateButton.addEventListener("click", translateText);

async function translateText() {

    const text = inputText.value.trim();
    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    // Check empty input
    if (text === "") {
        status.textContent = "Please enter some text first.";
        return;
    }

    // Check same languages
    if (source === target) {
        outputText.value = text;
        status.textContent = "Source and target languages are the same.";
        return;
    }

    status.textContent = "Translating...";
    translateButton.disabled = true;

    try {

        const apiUrl =
            "https://api.mymemory.translated.net/get?q=" +
            encodeURIComponent(text) +
            "&langpair=" +
            encodeURIComponent(source) +
            "|" +
            encodeURIComponent(target);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Network response failed.");
        }

        const data = await response.json();

        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            throw new Error("Translation not available.");
        }

        outputText.value = data.responseData.translatedText;

        status.textContent = "Translation completed successfully.";

    } catch (error) {

        console.error("Translation Error:", error);

        outputText.value = "";

        status.textContent =
            "Translation failed. Please check your internet connection and try again.";

    } finally {

        translateButton.disabled = false;

    }
}


// ===============================
// SWAP LANGUAGES
// ===============================

swapButton.addEventListener("click", function () {

    const oldSource = sourceLanguage.value;
    const oldTarget = targetLanguage.value;

    sourceLanguage.value = oldTarget;
    targetLanguage.value = oldSource;

    const oldInput = inputText.value;

    inputText.value = outputText.value;
    outputText.value = oldInput;

    status.textContent = "Languages swapped.";

});


// ===============================
// COPY TRANSLATION
// ===============================

copyButton.addEventListener("click", async function () {

    const text = outputText.value.trim();

    if (text === "") {
        status.textContent = "There is no translation to copy.";
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        status.textContent =
            "Translation copied to clipboard.";

    } catch (error) {

        // Fallback for browsers where clipboard API is unavailable
        outputText.select();
        document.execCommand("copy");

        status.textContent =
            "Translation copied to clipboard.";

    }

});


// ===============================
// CLEAR TEXT
// ===============================

clearButton.addEventListener("click", function () {

    inputText.value = "";
    outputText.value = "";

    status.textContent = "";

});


// ===============================
// TEXT TO SPEECH
// ===============================

speakButton.addEventListener("click", function () {

    const text = inputText.value.trim();

    if (text === "") {
        status.textContent = "Enter some text to hear it.";
        return;
    }

    if (!("speechSynthesis" in window)) {

        status.textContent =
            "Text-to-speech is not supported in this browser.";

        return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = getSpeechLanguage(sourceLanguage.value);

    window.speechSynthesis.speak(speech);

});


// ===============================
// SPEECH LANGUAGE
// ===============================

function getSpeechLanguage(language) {

    const languages = {

        en: "en-US",
        hi: "hi-IN",
        te: "te-IN",
        ta: "ta-IN",
        kn: "kn-IN",
        ml: "ml-IN",
        fr: "fr-FR",
        de: "de-DE",
        es: "es-ES",
        it: "it-IT",
        ja: "ja-JP",
        ko: "ko-KR"

    };

    return languages[language] || "en-US";
                             }
