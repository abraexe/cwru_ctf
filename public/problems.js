async function main() {

}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// #region TypeIt
async function TypeElement(s, time, element, indentation, delay) {
    lines = s.split('\n');
    function finish(element) {
        styleCode(element, true);
        // element.remove();
        // const element2 = document.getElementById("loading");
        // element2.style.display = "flex";
    }

    function styleCode(element, final=false) {
        const styles = {
            keyword: 'color: blue;',
            string: 'color: green;',
            comment: 'color: grey;',
            function: 'color: purple;',
            number: 'color: orange;',
            punctuation: 'color: black;',
            block: getComputedStyle(document.querySelector(':root')).getPropertyValue('--silver-lake-blue-light')
        };
    
        const patterns = {
            // comment: /#.*$/gm,
            // string: /('.*?'|\".*?\")/g,
            // number: /\b\d+(\.\d+)?\b/g,
            // keyword: /\b(def|class|import|from|as|if|elif|else|while|for|in|return|try|except|raise|with|assert|pass|break|continue|lambda|not|or|and|is|True|False|None)\b/g,
            // function: /\b\w+(?=\()/g
            block: /(&lt;.*?&gt;)/g
        };
        
        let text = element.innerText;
        if (final && false) { //* unused, might be useful later
            text = text
                .replace(/((?<!<br>)\n)/g, '&nbsp;&nbsp;&nbsp;&nbsp;&lt;br&gt;<br>')
                .replace(/(<(?!br>))/g, '&lt;')
                .replace(/((?<!<br)>)/g, '&gt;')
                .replace(patterns.block, `<span style="color:${styles.block}">$&</span>`)
                // .replace(/&lt;br&gt;/g,"&nbsp;&nbsp;&nbsp;&nbsp;&lt;br&gt;");
        } else {
            text = text
                .replace(/((?<!<.*>)\n)/g, '&lt;br&gt;<br>')
                .replace(/((?<!<br>)\n)/g, '<br>')
                .replace(/(<(?!br>))/g, '&lt;')
                .replace(/((?<!<br)>)/g, '&gt;')
                .replace(patterns.block, `<span style="color:${styles.block}">$&</span>`);
                // .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length))
                // .replace(patterns.string, `<span style="${styles.string}">$&</span>`)
                // .replace(patterns.comment, `<span style="${styles.comment}">$&</span>`)
                // .replace(patterns.number, `<span style="${styles.number}">$&</span>`)
                // .replace(patterns.keyword, `<span style="${styles.keyword}">$&</span>`)
                // .replace(patterns.function, `<span style="${styles.function}">$&</span>`);
        }
        element.innerHTML = text;
    }

    async function Type(str, speed, output) {
        if (speed == 0) {
            output.innerText += str;
            // await styleCode(output);
            return;
        }
        let i = 0;
        let increment = 1;
        if (speed < 3) {
            increment = Math.ceil(3/speed);
            speed = 1;
        }
        while (i < str.length) {
            await wait(speed);
            output.innerHTML += str.slice(i,i+increment);
            i += increment;
        }
        styleCode(output); //* why does putting this in work
        return;
    }

    await wait(delay);
    time = Math.max(time-10*lines.length,0);
    if (time == 0) {
        element.innerText = s;
        finish(element);
        return;
    }
    for (index=0; index<lines.length; index++) {
        if (index > 0)
            element.innerText += "\n";
        styleCode(element);
        await wait(10);
        if (indentation != null)
            element.innerHTML += indentation[index];
        await Type(lines[index], time/s.length, element);
    }
    finish(element);
}

// #endregion

// #region category

// global lol
var openCategory = null;
var openProblem = null;
var closingProblem = false;

function clickedCategory(element) {
    if (element.hasAttribute("problemOpen") && element.getAttribute("problemOpen")=="true")
        return;
    element.setAttribute("problemOpen",false);
    // console.info(!(openCategory != null && openCategory != element));
    if (openCategory != null && openCategory != element) {
        clickedCategory(openCategory);
    }
    if (openCategory != element && !element.classList.contains('reverseOpen') && element.classList.contains('paused')) {
        openCategory = element;
        problemAppear(element);
        if (!element.hasAttribute('data-rightbound')) {
            element.setAttribute('data-rightbound',getComputedStyle(element.querySelector('.code2')).left);
            element.setAttribute('data-leftbound',getComputedStyle(element.querySelector('.code1')).left);
            element.setAttribute('data-upbound',getComputedStyle(element).height);
        }
    } else if (openCategory != element && !element.classList.contains('reverseOpen') && !element.classList.contains('paused')) {
        openCategory = element;
        problemAppear(element);
        element.querySelector('.problem-container').classList.add('problem-appear');
    } else { //* openCategory == element
        openCategory = null;
        problemDissappear(element);
    }
    const speed = parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--category-speed'),10)*1000/2;
    const intClRev = openCategory != element && element.classList.contains('reverseClose');
    if (element.classList.contains('paused')) {
        unpause(element);
    } else if ((!element.classList.contains('reverseOpen') && openCategory!=element) || 
               (intClRev)) {
        element.style.height = getComputedStyle(element).height;
        var c = element.querySelector('.code2');
        var leftBound = parseInt(element.getAttribute('data-leftbound'),10);
        var rightBound = parseInt(element.getAttribute('data-rightbound'),10);
        c.style.left = getComputedStyle(c).left;
        if (intClRev) {
            const tmpHeight = getComputedStyle(element).height;
            const tmpLeft = getComputedStyle(c).left;
            element.classList.remove('reverseClose');
            c.classList.remove('reverseCloseTail');
            element.style = "";
            c.style = "";
            element.style.height = tmpHeight;
            c.style.left = tmpLeft;
        }
        element.classList.add('reverseOpen');
        c.classList.add('reverseOpenTail');
        c.style.animationDuration = `${Math.round(speed-(parseInt(getComputedStyle(c).left,10)-leftBound)/
                                    (rightBound-leftBound)*speed)}ms`;
        element.style.animationDelay = `${Math.round(speed-(parseInt(getComputedStyle(c).left,10)-leftBound)/
                                    (rightBound-leftBound)*speed)}ms`;
        element.addEventListener("animationend", reset);
        c.addEventListener("animationend", reset);
    } else if (!element.classList.contains('reverseClose') && openCategory==element) {
        element.style.height = getComputedStyle(element).height;
        var c = element.querySelector('.code2');
        var upBound = parseInt(element.getAttribute('data-upbound'),10);
        var lowBound = parseInt(element.getAttribute('data-lowbound'),10);
        element.style.height = getComputedStyle(element).height;
        element.classList.add('reverseClose');
        c.classList.add('reverseCloseTail');
        c.style.animationDelay = `${Math.round((parseInt(element.style.height,10)-lowBound)/
                                    (upBound-lowBound)*speed)}ms`;
        element.style.animationDuration = `${Math.round((parseInt(element.style.height,10)-lowBound)/
                                    (upBound-lowBound)*speed)}ms`;
    }
}

function unpause(element) {
    element.classList.remove('paused');
    element.querySelector('.code2').classList.remove('paused');
    element.querySelector('.code2').addEventListener("animationiteration", pause);
    element.addEventListener("animationiteration", pause);
}

function reset(event) {
    if (event.target == event.currentTarget) {
        event.currentTarget.classList.add('paused');
        event.currentTarget.classList.remove('reverseOpen');
        event.currentTarget.classList.remove('reverseOpenTail');
        event.currentTarget.classList.remove('reverseClose');
        event.currentTarget.classList.remove('reverseCloseTail');
        event.currentTarget.style = "";
    }
}

function manualReset(element) {
        element.classList.add('paused');
        element.classList.remove('reverseOpen');
        element.classList.remove('reverseOpenTail');
        element.style = "";
}

function pause(event) {
    if (event.target == event.currentTarget)
        event.currentTarget.classList.add('paused');
        if (event.currentTarget.classList.contains('category') && 
            !event.currentTarget.hasAttribute('data-lowbound'))
                event.currentTarget.setAttribute('data-lowbound',getComputedStyle(event.currentTarget).height);
}

// #endregion

function problemDissappear(element) {
    element.querySelector('.problem-container').classList.remove('problem-appear');
}

function problemAppear(element) {
    element.querySelector('.problem-container').classList.add('problem-appear');
}

function clickedProblem(element) {
    if (openCategory != element.parentElement.parentElement)
        return;
    const inner = document.getElementById("problem-inner");
    if (element.parentElement.parentElement.getAttribute("problemOpen")!="true" && 
        !inner.classList.contains('problem-inner-expand')) {
            const expand = inner;
            expand.style.left = `${element.getBoundingClientRect().left}px`;
            expand.style.top = `${element.getBoundingClientRect().top}px`;
            /*
            ! ok so this is really weird but for some reason running that log
            ! call below prevents the box from appearing in teh wrong place :/
            */
            inner.classList.add('problem-inner-expand');
            inner.innerHTML = element.innerHTML;
            element.style.opacity = 0;
            element.children[0].style.opacity = 0;
            element.parentElement.parentElement.setAttribute("problemOpen","true");
            openProblem = element;
            document.getElementById("cover").classList.add('coverShown');
            const s = trimTab(inner.getElementsByClassName("problem-description")[0].innerHTML.toString());
            inner.getElementsByClassName("problem-description")[0].innerHTML = "";
            inner.getElementsByClassName("code4")[0].classList.add('code4A');
            inner.getElementsByClassName("code34")[0].classList.add('code34A');
            const delay = parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--problem-speed'),10);
            
            asyncStuff(element, inner, delay, s);
    }
}


//* using globals to control threads is going to cause issues...
async function exitProblem(cover) {
    if (openProblem == null || closingProblem)
        return;
    closingProblem = true;
    const speed = parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--problem-speed'),10);
    const inner = document.getElementById("problem-inner");
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            inner.classList.add("problem-inner-collapse");
        });
    });
    let anim = inner.getAnimations(); //! this bit shouldn't be necessary, and there's flicker
    console.log(anim[0].currentTime,anim[1].currentTime,anim[2].currentTime);
    console.log(speed);
    anim[0].currentTime = speed - anim[0].currentTime;
    anim[1].currentTime = speed*2 - anim[1].currentTime;
    anim[2].currentTime = speed*3 - anim[2].currentTime;
    console.log(anim[0].currentTime,anim[1].currentTime,anim[2].currentTime);

    openProblem.style.opacity = 1;
    openProblem.children[0].style = "";
    openProblem.children[0].classList.add("return");
    const IRember = openProblem;
    setTimeout(() => {
        IRember.children[0].classList.remove("return");
    }, speed*4.5);
    await wait(speed*3.5);
    cover.style.visibility = "visible";
    cover.classList.remove('coverShown');
    await wait(speed);
    cover.style = "";
    openProblem.parentElement.parentElement.setAttribute("problemOpen","false");
    openProblem = null; // IForgor
    inner.classList.remove('problem-inner-expand');
    inner.style = "";
    inner.classList.remove('problem-inner-collapse');
    inner.innerHTML = "";
    closingProblem = false;
}

async function asyncStuff(element, inner, delay, s) {
    let fileList = inner.getElementsByClassName("files")[0];
    let fileListDummy = element.getElementsByClassName("files")[0];
    fileList.innerHTML = "";
    let details = inner.getElementsByClassName("problem-details-inner")[0].children[0];
    let detailsString = details.innerHTML;
    details.innerHTML = "";
    await TypeElement(s, 1000, inner.getElementsByClassName("problem-description")[0], getTabData(s), 2.2*delay);
    for (let i = 0; i < fileListDummy.children.length; i++) {
        await fileList.appendChild(document.createElement("li"));
        await TypeElement(fileListDummy.children[i].innerText, 100, fileList.children[i], null, 0);
    }
    await TypeElement(detailsString, 1000, details, null, 0);
}

function subtractString(str1, str2) {
    // return str1.split('').filter(char => !str2.includes(char)).join('');
    const match = str1.match(/^\s*/);
    return match ? match[0] : '';
}

function trimTab(str) {
    const lines = str.split('\n');
    let out = "";
    const sub = subtractString(lines[1],lines[1].trim()); //* topmost element
    lines.forEach(line => {
        out += line.replace(new RegExp(sub),'') + '\n';
    });
    return out.trim();
}
2
function getTabData(str) {
    let lines = str.trim().split('\n');
    for (let i = 0; i < lines.length; i++)
        lines[i] = subtractString(lines[i],lines[i].trim()).replace(/\s/g,"&nbsp;");
    return lines;
}

function repr(str) {
    return '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';//.replace(/[ ]/g,'\\s') + '"';
}

function run() {
    try {
        main();
    }
    catch(error) {
        console.error(error);
    }
}
