generate();

let pmxButton = document.querySelector("#showPMX");
let orderButton = document.querySelector("#showOrder");
let cycleButton = document.querySelector("#showCycle");
let generateButton = document.querySelector("#generate");

generateButton.addEventListener("click", generate);
pmxButton.addEventListener("click", (e) => showHide(e, "PMX"));
orderButton.addEventListener("click", (e) => showHide(e, "Order"));
cycleButton.addEventListener("click", (e) => showHide(e, "Cycle"));

function generate() {
    let count = document.querySelector("#numElementsInput").value;
    let parent1 = [];
    let parent2 = [];
    for (let i = 0; i < count; i++) {
        parent1.push(String.fromCharCode(i + "A".charCodeAt(0)));
        parent2.push(String.fromCharCode(i + "A".charCodeAt(0)));
    }
    shuffleArray(parent1);
    shuffleArray(parent2);
    let sequenceLength = Math.floor(count / 2);
    let sequenceStart = Math.floor(Math.random() * count / 2);
    let childPMX = calculatePMX(parent1, parent2, sequenceStart, sequenceLength);
    let childOrder = calculateOrder(parent1, parent2, sequenceStart, sequenceLength);
    let childCycle = calculateCycle(parent1, parent2);
    hide("PMX");
    hide("Order");
    hide("Cycle");

    document.querySelector("#p1Text").innerHTML =
        getSequenceHTML(parent1, sequenceStart, sequenceLength);
    document.querySelector("#p2Text").innerHTML =
        getSequenceHTML(parent2);
    document.querySelector("#pmxStatus").innerHTML = childPMX;
    document.querySelector("#orderStatus").innerHTML = childOrder;
    document.querySelector("#cycleStatus").innerHTML = childCycle;

}

function showHide(e, which) {
    let btn = e.target;
    let area = document.querySelector("#" + which);
    if (area.style.display == "" || area.style.display == "none") {
        area.style.display = "block"
        btn.innerText = "Hide " + btn.innerText.substring(5);
    } else {
        area.style.display = "none";
        btn.innerText = "Show " + btn.innerText.substring(5);
    }

}

function hide(which) {
    let btn = document.querySelector("#show" + which);
    let area = document.querySelector("#" + which);

    area.style.display = "none";
    btn.innerText = "Show " + btn.innerText.substring(5);
}

function calculatePMX(p1, p2, start, length) {

    let child = (new Array(p1.length)).fill("_");
    let lettersToFill = p1.slice(); // make a copy
    let statusHTML = "<hr><h3>Worked Solution</h3>";
    statusHTML += "<p>Start by copying the subsequence from p1 into child:</p>";
    //copy sequence down to the child
    for (let i = start; i < start + length; i++) {
        child[i] = p1[i];
    }
    statusHTML += "<p><strong class='cityText'>F1: </strong>" + getSequenceHTML(child) + "</p>";
    lettersToFill.splice(start, length);

    statusHTML += "<p>We need to figure out where to put these letters: ";
    statusHTML += getSequenceHTML(lettersToFill) + "</p>";

    for (let i = 0; i < lettersToFill.length; i++) {
        statusHTML += "<hr>";
        statusHTML += "<p>Let's figure out where to put <strong class='cityText'>"
            + lettersToFill[i] + "</strong> by searching P2 for it.<br><br>";
        let p2location = p2.indexOf(lettersToFill[i]);
        let oldLetter = lettersToFill[i];
        let mapString = lettersToFill[i];
        while (child[p2location] !== "_") {
            statusHTML += "<strong class='cityText'>P1: </strong>";
            statusHTML += getSequenceHTML(p1, p2location, 1) + "<br>"
            statusHTML += "<strong class='cityText'>P2: </strong>";
            statusHTML += getSequenceHTML(p2, p2location, 1) + "<br><br>";
            statusHTML += "<strong class='cityText'>F1: </strong>";
            statusHTML += getSequenceHTML(child, p2location, 1) + "<br></br>";
            statusHTML += "Since the spot is unavailable, we use the map shown above to map to ";

            mappedLetter = p1[p2location];
            mapString += "⇨" + mappedLetter;
            statusHTML += "<strong class='cityText'>" + mappedLetter + "</strong>, creating a map <i>so far</i> of <span class='cityText'>" + mapString + "</span></p>";
            p2location = p2.indexOf(mappedLetter);
        }
        statusHTML += "<strong class='cityText'>P1: </strong>";
        statusHTML += getSequenceHTML(p1) + "<br>"
        statusHTML += "<strong class='cityText'>P2: </strong>";
        statusHTML += getSequenceHTML(p2, p2location, 1) + "<br><br>";
        statusHTML += "<strong class='cityText'>F1: </strong>";
        statusHTML += getSequenceHTML(child, p2location, 1) + "<br></br>";
        statusHTML += "This spot is available so we can put our original letter <strong class='cityText'>"
            + lettersToFill[i]
            + " </strong>there!<br><br>";
        child[p2location] = lettersToFill[i];
        statusHTML += "<strong class='cityText'>F1: </strong>"
        statusHTML += getSequenceHTML(child, p2location, 1);
    }
    statusHTML = "<p><strong class='cityText'>F1: </strong>"
        + getSequenceHTML(child) + "</p>"
        + statusHTML

    return statusHTML;
}

function calculateOrder(p1, p2, start, length) {
    let child = (new Array(p1.length)).fill("_");
    let statusHTML = "<hr><h3>Worked Solution</h3>";
    let p2Copy = p2.slice();
    statusHTML += "<p>Start by copying the subsequence from p1 into child:</p>";
    //copy sequence down to the child
    for (let i = start; i < start + length; i++) {
        child[i] = p1[i];
        p2Copy[p2.indexOf(p1[i])] = "-";
    }
    statusHTML += "<p><strong class='cityText'>F1: </strong>" + getSequenceHTML(child) + "</p>";
    let sequence = p1.slice(start, start + length);

    statusHTML += "<p>To fill in the rest, start with P2, crossing out all the letters that are already included.</p>"

    statusHTML += "<p>Start by crossing out the already included letters from P2: </p>";

    statusHTML += "<p><strong class='cityText'>P2: </strong>";
    statusHTML += getSequenceHTML(p2Copy) + "<br><br>";
    statusHTML += "<strong class='cityText'>F1: </strong>";
    statusHTML += getSequenceHTML(child) + "</p>";

    statusHTML += "<p>Then, starting at the position AFTER the subsequence, fill the letters in from P2 in the same order:</p>";

    let p2Pos = start + length;
    if (p2Pos >= p2.length) p2Pos = 0;
    let f1Pos = start + length;
    if (f1Pos >= p2.length) f1Pos = 0;
    for (let i = 0; i < p2.length - length; i++) {
        while (p2Copy[p2Pos] == "-") {
            p2Pos++;
            if (p2Pos >= p2.length) p2Pos = 0;
        }
        //at this point have found the p2Pos;
        statusHTML += "<p><strong class='cityText'>P2: </strong>";
        statusHTML += getSequenceHTML(p2Copy, p2Pos, 1) + "<br><br>";
        child[f1Pos] = p2Copy[p2Pos];
        statusHTML += "<strong class='cityText'>F1: </strong>";
        statusHTML += getSequenceHTML(child, f1Pos, 1) + "</p><br>";
        f1Pos++;
        p2Pos++;
        if (p2Pos >= p2.length) p2Pos = 0;
        if (f1Pos >= p2.length) f1Pos = 0;
    }
    statusHTML = "<p><strong class='cityText'>F1: </strong>"
        + getSequenceHTML(child) + "</p>"
        + statusHTML

    return statusHTML;
}


function calculateCycle(p1, p2) {
    let child = (new Array(p1.length)).fill("_");
    let statusHTML = "<hr><h3>Worked Solution</h3>";
    statusHTML += "<p>First copy the first city from P1 into F1:</p>";
    child[0] = p1[0];
    statusHTML += "<strong class='cityText'>P1: </strong>";
    statusHTML += getSequenceHTML(p1, 0, 1) + "<br>"
    statusHTML += "<strong class='cityText'>P2: </strong>";
    statusHTML += getSequenceHTML(p2) + "<br><br>";
    statusHTML += "<strong class='cityText'>F1: </strong>";
    statusHTML += getSequenceHTML(child, 0, 1) + "<br></br>";

    statusHTML += "<p>Then the cycle begins. </p>"
    p2Position = 0;
    while (true) {
        p1Position = p1.indexOf(p2[p2Position]);
        statusHTML += "<strong class='cityText'>P1: </strong>";
        statusHTML += getSequenceHTML(p1, p1Position, 1) + "<br>"
        statusHTML += "<strong class='cityText'>P2: </strong>";
        statusHTML += getSequenceHTML(p2, p2Position, 1) + "<br><br>";

        if (child[p1Position] == "_") {
            child[p1Position] = p1[p1Position];
            p2Position = p1Position;

            statusHTML += "<strong class='cityText'>F1: </strong>";
            statusHTML += getSequenceHTML(child, p1Position, 1) + "<br></br><hr>";
        } else {
            statusHTML += "<strong class='cityText'>F1: </strong>";
            statusHTML += getSequenceHTML(child, p1Position, 1) + "<br></br><hr>";
            break;
        }
        


    }
    statusHTML += "<p>The cycle is now over, the remaining elements can be copied from P2.</p>";
    let p2HTML = "<strong class='cityText'>P2: </strong><span class='cityText'>";
    let f1HTML = "<strong class='cityText'>F1: </strong><span class='cityText'>";
    for (let i = 0; i < child.length; i++) {
        if (child[i]=="_") {
            child[i]=p2[i];
            p2HTML += "<span class='selection'>"+p2[i]+"</span> "
            f1HTML += "<span class='selection'>"+child[i]+"</span> "
        }else{
            p2HTML += p2[i] + " ";
            f1HTML += child[i] + " ";
        }
    }
    statusHTML += "<strong class='cityText'>P1: </strong>" + getSequenceHTML(p1) + "<br>" + p2HTML + "<br><br>" + f1HTML;
    statusHTML = "<p><strong class='cityText'>F1: </strong>"
    + getSequenceHTML(child) + "</p>"
    + statusHTML
    return statusHTML;
}

function getSequenceHTML(code, start = 0, length = 0) {
    let html = "<span class='cityText'>";
    if (length == 0) {
        for (let i = 0; i < code.length; i++) {
            html += code[i] + " ";
        }
        html = html.trim();
    } else {
        for (let i = 0; i < start; i++) {
            html += code[i] + " ";
        }
        html += '<span class="selection">';
        for (let i = start; i < start + length; i++) {
            html += code[i] + " ";
        }
        html = html.trim();
        html += "</span> ";
        for (let i = start + length; i < code.length; i++) {
            html += code[i] + " ";
        }
    }
    html += "</span>"
    return html;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    console.log(arr);
}