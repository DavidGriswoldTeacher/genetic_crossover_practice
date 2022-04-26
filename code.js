generate();

let pmxButton = document.querySelector("#showPMX");
let orderButton = document.querySelector("#showOrder");
let cycleButton = document.querySelector("#showCycle");
let generateButton = document.querySelector("#generate");

generateButton.addEventListener("click", generate);
pmxButton.addEventListener("click", (e) =>showHide(e,"PMX")); 
orderButton.addEventListener("click", (e) => showHide(e,"Order"));
cycleButton.addEventListener("click", (e) => showHide(e,"Cycle"));

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


    document.querySelector("#p1Text").innerHTML = 
        getSequenceHTML(parent1, sequenceStart, sequenceLength);
    document.querySelector("#p2Text").innerHTML = 
        getSequenceHTML(parent2);
    document.querySelector("#pmxStatus").innerHTML = childPMX.statusHTML;
}

function showHide(e, which) {
    let btn = e.target;
    let area = document.querySelector("#"+which);
    if (area.style.display == "none") {
        area.style.display = "block"
        btn.innerText = "Hide " + btn.innerText.substring(5);
    }else{
        area.style.display = "none";
        btn.innerText = "Show "  + btn.innerText.substring(5);
    }
    
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
            while (child[p2location] !== "_") {
                statusHTML += "<strong class='cityText'>P1: </strong>";
                statusHTML += getSequenceHTML(p1,p2location,1) + "<br>"
                statusHTML += "<strong class='cityText'>P2: </strong>";
                statusHTML += getSequenceHTML(p2,p2location,1) + "<br><br>";
                statusHTML += "<strong class='cityText'>F1: </strong>";
                statusHTML += getSequenceHTML(child, p2location, 1) + "<br></br>";       
                statusHTML += "Since the spot is unavailable, we have to cycle to the next letter, ";
               
                mappedLetter = p1[p2location];
                statusHTML += "<span class='cityText'>"+ mappedLetter + "</span></p>"
                p2location = p2.indexOf(mappedLetter);
            }
            statusHTML += "<strong class='cityText'>P1: </strong>";
                statusHTML += getSequenceHTML(p1) + "<br>"
                statusHTML += "<strong class='cityText'>P2: </strong>";
                statusHTML += getSequenceHTML(p2,p2location,1) + "<br><br>";
                statusHTML += "<strong class='cityText'>F1: </strong>";
                statusHTML += getSequenceHTML(child, p2location, 1) + "<br></br>";     
            statusHTML += "This spot is available so we can put <strong class='cityText'>" 
                + lettersToFill[i] 
                + " </strong>there!<br><br>";
            child[p2location] = lettersToFill[i];
            statusHTML += "<strong class='cityText'>F1: </strong>"
            statusHTML += getSequenceHTML(child,p2location,1);
        }
        statusHTML = "<p><strong class='cityText'>F1: </strong>"
        + getSequenceHTML(child) + "</p>"
        + statusHTML

    return {child:child, statusHTML:statusHTML};
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