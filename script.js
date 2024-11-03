async function main(time) {
    var colors = {
       "from import await return" : "pink",
       "async def class" : "red",
    }


    var s = 
    `from cwru.ccc.ctf import LoginManager, Session, Link, Info
    from cwru.ccc.WebKit import Click, Webpage
    from numpy import ndarray
    from Info import _InfoKey
    
    import Literal
    import overload
    
    def get_latest_key(name: Literal["ctf", "ruleset", "source"], /) -> _InfoKey: ...
    def ctf() -> float: ...
    def ruleset() -> ndarray[str, float]: ...
    def source() -> bytes: ...
    
    class Homepage(Webpage):
        info: Info.MD_Object
        session: Session.Certificate
    
        def __init__():
    
        @overload
        def __init__(*args, **kwargs):
    
        @staticmethod
        def about(info: Info.about.Versions.Latest):
    
    
        @classmethod
        def leaderboard(cls, cert: Session.c, rdr: Link.Redirect) -> Link.GoTo:
    
    
        @classmethod
        def get_started(cls, login: LoginManager.Login, cert: Session.c, *args, **kwargs) -> Link.Popup:
    
    
        def sign_up(self, login: LoginManager.NewLogin, cert: Session.c, rdr: Link.Redirect) -> Link.GoTo:
    
        def log_in(self,login: LoginManager.Login, cert: Session.c) -> Link.GoTo:
    
    
    async def main(*args) -> Link.Redirect:
        home = Homepage()
        mouse = Click.GetMouse(home)
        user_options = {
            "Log In"     : home.log_in(Click.from_header(home.log_in),                   *args),
            "Sign Up"    : home.sign_up(Click.from_header(home.sign_up),                 *args),
            "Get Started": home.get_started(Click.from_header(home.get_started),         *args),
            "About"      : Homepage.about(Click.from_header(Homepage.about),             *args),
            "Leaderboard": Homepage.leaderboard(Click.from_header(Homepage.leaderboard), *args),
        }
        clicked: str = await Click.UserInput(mouse)
        return user_options[clicked]
    
    
    if "__main__":
        main()`;

    const lines = s.split('\n');
    function finish() {
        const element = document.getElementById("typeit");
        stylePythonCode(element);
        // element.remove();
        // const element2 = document.getElementById("loading");
        // element2.style.display = "flex";
    }

    function stylePythonCode(element) {
        // color scheme
        const styles = {
            keyword: 'color: blue;',
            string: 'color: green;',
            comment: 'color: grey;',
            function: 'color: purple;',
            number: 'color: orange;',
            punctuation: 'color: black;'
        };
    
        const patterns = {
            comment: /#.*$/gm,
            string: /('.*?'|\".*?\")/g,
            number: /\b\d+(\.\d+)?\b/g,
            keyword: /\b(def|class|import|from|as|if|elif|else|while|for|in|return|try|except|raise|with|assert|pass|break|continue|lambda|not|or|and|is|True|False|None)\b/g,
            function: /\b\w+(?=\()/g
        };
    
        let text = element.innerText;
        text = text
            .replace(/(\r\n|\n|\r)/g, '<br>')
            .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length))
            .replace(patterns.string, `<span style="${styles.string}">$&</span>`)
            .replace(patterns.comment, `<span style="${styles.comment}">$&</span>`)
            .replace(patterns.number, `<span style="${styles.number}">$&</span>`)
            .replace(patterns.keyword, `<span style="${styles.keyword}">$&</span>`)
            .replace(patterns.function, `<span style="${styles.function}">$&</span>`);
            

        element.innerHTML = text;
    }

    async function Type(str, speed, output) {
        if (speed == 0) {
            output.innerText += str;
            // await stylePythonCode(output);
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
        // await stylePythonCode(output);
        return;
    }

    element = document.getElementById("typeit");
    time = Math.max(time-10*lines.length,0);
    if (time == 0) {
        element.innerText = s;
        finish();
        return;
    }
    for (index=0; index<lines.length; index++) {
        str = lines[index];
        if (index > 0) {
            // Type("<br>", 1, element);
            element.innerText += "\n";
        }
        stylePythonCode(element);
        await wait(10);
        await Type(str, time/s.length, element);
    }
    finish();
    await wait(1000);
    typeit.style.display = "none";
    
    //#region Canvas    

    function compareColor(r,g,b, color, tolerance) {
        return (Math.abs(r-color[0]) <= tolerance &&
            Math.abs(g-color[1]) <= tolerance &&
            Math.abs(b-color[2]) <= tolerance);
    }

    function replaceColor(canvas, oldColor, newColor, ctx, tolerance) {
        if (newColor == "") {
            return;
        }
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        oldColor = oldColor.match(/\d+/g);
        newColor = newColor.match(/\d+/g);
        
        for (let i = 0; i < data.length; i += 4) {
            if (compareColor(data[i],data[i+1],data[i+2], oldColor, tolerance)) {
                data[i] = newColor[0];       // Red
                data[i + 1] = newColor[1];   // Green
                data[i + 2] = newColor[2];   // Blue
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function drawCanvas(id, palette) {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = `assets/${id}.png`;
        
        image.style.display = "flex";
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width,canvas.height);
        
        for (const color of palette) {
            replaceColor(canvas, getComputedStyle(document.body).getPropertyValue(`--${id}-${color}`),
                        getComputedStyle(canvas).getPropertyValue(`--${color}`), ctx, 5);
        }
        console.log(`Drew ${id}`)
    }
    
    drawCanvas('chip', ["sticker", "font", "symbol", "top", "left", "bottom", "seam", "gold1", "gold2"]);
    drawCanvas('circuit', ["gold", "wire", "silver", "lime"]);
    drawCanvas('slotIMG', ["wire", "board", "border1", "border2", "border3"]);
    drawCanvas('border', ["wire", "board", "border1", "border2", "border3"]);
    //#endregion

    // document.body.style.backgroundImage = "url('assets/circuit.png')";
    draggable.style.display = "inline";
    document.body.style.backgroundColor = getComputedStyle(circuit).getPropertyValue("--board");
    slot.style.display = "inline"
    element.style.display = "none";
    fadeOut(cover);
    await wait(1000);
    cover.style.zIndex = 0;

    dragElement(document.getElementById("draggable"));
}

function fadeOut(element) {
    element.classList.add('fade-out');
    setTimeout(() => {
        element.style.display = 'none';
    }, 1000); // match #cover transition length
}

function fadeIn(element) {
    element.style.display = "flex";
    requestAnimationFrame(() => {
        // element.classList.remove('fade-out');
        element.classList.add('fade-in');
    });
}

function divClose(div1, div2, thresh) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    const centerX1 = rect1.left + rect1.width / 2;
    const centerY1 = rect1.top + rect1.height / 2;
    const centerX2 = rect2.left + rect2.width / 2;
    const centerY2 = rect2.top + rect2.height / 2;
    console.info(centerX1);
    console.info(centerY1);
    console.info(centerX2);
    console.info(centerY2);
    
    const distance = Math.sqrt((centerX2 - centerX1) ** 2 + (centerY2 - centerY1) ** 2);

    return Math.abs(rect1.left - rect2.left) < thresh && Math.abs(rect1.top - rect2.top) < thresh
    return distance < thresh;
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (draggable.dataset.flag == "true") {
        return 0;
    }
    elmnt.onmousedown = dragMouseDown;
  
    function dragMouseDown(e) {
      if (draggable.dataset.flag == "true") {
        return 0;
      }
      e = e || window.event;
      e.preventDefault();
      shadow.style.display = "inline";
      shadow.style.left -= 50;
      chip.style.width += 30
      chip.style.top = "-30px";
      chip.style.left = "30px";

      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      shadow.style.display = "none";
      chip.style.width -= 30;
      chip.style.top = "0px";
      chip.style.left = "0px";
      console.info(slot.style.bottom);
      if (divClose(draggable,slot,20)) {
        border.style.display = "inline";
        const rect2 = slot.getBoundingClientRect();
        draggable.style.left = `${rect2.left}px`;
        draggable.style.top = `${rect2.top}px`;
        chip.style.left = "2px";
        chip.style.top = "9px";
        draggable.dataset.flag = "true";
        document.body.style.backgroundImage = "url('assets/featheredCircuit.png')";
      }
    }
  }

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function run() {
    try {
        main(600);
    }
    catch(error) {
        console.error(error);
    }
}




