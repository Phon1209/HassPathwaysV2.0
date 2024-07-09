const fs = require('fs');
const { JSDOM } = require('jsdom');

async function fetchData() {
    const url = "https://hass.rpi.edu/advising/hass-integrative-pathways";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
        const dom = new JSDOM(result);
        const document = dom.window.document;

        // Extract accordion-item divs
        const accordionItems = document.querySelectorAll('.accordion-item');
        let data = [];

        accordionItems.forEach((item) => {
            // questionAnswer is type array 
            // question will be index 0 of the array
            // answer will be index 1 of the array
            const questionAnswer = `${item.textContent.trim()}`.split("\n").filter(item => item.trim() !== "");

            console.log(questionAnswer);
            data.push({ question: questionAnswer[0].trim(), answer: questionAnswer[1].trim()});
        });

        fs.writeFile('accordionItems.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Data successfully written to accordionItems.json');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

fetchData();