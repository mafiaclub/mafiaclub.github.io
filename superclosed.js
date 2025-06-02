init=()=>{
    main=document.getElementsByTagName('main')[0];
    currentRole=null;
    let l=document.getElementById('load');
    try {showOpenFilePicker;l.addEventListener('click',()=>showOpenFilePicker().then((handle)=>handle[0].getFile().then(read)))}
    catch {
        let i=document.createElement('input');
        i.setAttribute('type','file');
        l.innerText+=' from file: ';
        l.addEventListener('click',(e)=>{read(e.srcElement.nextSibling.files[0])});
        document.getElementsByTagName('header')[0].lastChild.outerHTML='<input type="file"><hr>'
    }
    (document.getElementById('lsConsent').checked=localStorage.getItem('consent'))&&setColors(localStorage.getItem('background'),localStorage.getItem('color'),localStorage.getItem('bad'),localStorage.getItem('good'),localStorage.getItem('neutral'))||loadGame(localStorage.getItem('0'));
};
setCurr=(c)=>{
    currentRole=c;
    let n;
    if (c) {
        let h1s=Array.from(c.children).filter(x=>x.tagName=='H1');
        n=h1s[0]||c.children[0];
    }
    document.getElementById('cur').value=(c&&n?n.innerText:'');
};
roleElem=()=>{
    let r=document.createElement('section');
    roleEventListener(r);
    return r;
};
addBlankRole=()=>{
    let p=roleElem();
    main.appendChild(p);
    return p;
};
roleEventListener=(r)=>r.addEventListener('focusin',(e)=>{setCurr(e.srcElement.parentElement)});
componentEventListeners=(t)=>{
    t.addEventListener('blur',(e)=>{
        if (e.srcElement.parentElement.textContent.trim()=='') {
            e.srcElement.parentElement.remove();setCurr(null);
        } else {
            e.srcElement.textContent==''&&e.srcElement.remove();
            setCurr(currentRole);
        }});
    t.addEventListener('dblclick',(e)=>{getSelection().isCollapsed&&toggleSide(e.srcElement)});
}
addPart=(parentRole,tagName,content,className)=>{
    let t=document.createElement(tagName);
    t.innerHTML=content;
    className&&(t.className=className);
    t.toggleAttribute('contenteditable');
    let par=parentRole||addBlankRole();
    componentEventListeners(t);
    if (par.lastElementChild&&par.lastElementChild.tagName=='BR') {
        par.lastElementChild.remove();
        par.appendChild(t);
        addBr(par);
    } else {
        par.appendChild(t);
    }
    setCurr(par);
    return par;
};
addName=(p)=>addPart(p,'h1','Name');
addSide=(p)=>addPart(p,'h2','Side');
addLore=(p)=>addPart(p,'p','Lore','flavor');
addDesc=(p)=>addPart(p,'p','Ability');
addBr=(p)=>{
    let t=document.createElement('br');
    t.addEventListener('dblclick',(e)=>e.srcElement.remove());
    (p||(p=roleElem(),main.appendChild(p),setCurr(p),p)).appendChild(t);
};
addBad=(p)=>addPart(addPart(p,'p','Attribute','bad attribute'),'p','Description','bad');
addGood=(p)=>addPart(addPart(p,'p','Attribute','good attribute'),'p','Description','good');
addNeutral=(p)=>addPart(addPart(p,'p','Attribute','neutral attribute'),'p','Description','neutral');
addRole=(copySrc)=>{
    let r=addBlankRole();
    if (copySrc) {
        r.innerHTML=copySrc.innerHTML;
        setCurr(r);
    }
    else {
        addName(r);
        addSide(r);
        addLore(r);
        addDesc(r);
        addBr(r);
    }
    jumpToCurr();
};
jumpToCurr=()=>currentRole.scrollIntoView({behavior:"smooth",block:"end"});
toggleSide=(t)=>{if (t.classList.contains('good')||t.classList.contains('bad')||t.classList.contains('neutral')) {
    t.classList.remove('neutral');
    t.classList.replace('bad','neutral');
    t.classList.replace('good','bad');
} else {
    t.classList.add('good');
}};
rgb=(...args)=>{
    let a='#';
    for (let c of args) {
        let q=c.toString(16);
        a+=q.length>1?q:'0'+q
    }
    return a;
};
getColors=()=>{
    return [document.body.style.background,document.body.style.color,Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.bad').style.color,Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.good').style.color,Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.neutral').style.color];
};
store=(k,v)=>localStorage.getItem('consent')&&localStorage.setItem(k,v);
setBodyCSS=(name,value)=>{
    document.body.style.setProperty(name,value);
    store(name,value);
}
setSideCol=(side,col)=>{
    Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.'+side).style.color=col;
    store(side,col);
}
setColors=(a,t,b,g,n)=>{
    a&&setBodyCSS('background',a);
    t&&setBodyCSS('color',t);
    b&&setSideCol('bad',b);
    g&&setSideCol('good',g);
    n&&setSideCol('neutral',n);
};
saveGame=()=>{
    let a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([main.innerHTML],{type:"text/csv"}));
    a.download=main.children[0].children[0].innerText+'_mafia.txt';
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
};
loadGame=(html)=>{
    (main.innerHTML=html)||addRole();
    for (let r of main.children) {
        roleEventListener(r);
        for (let t of r.children) {
            componentEventListeners(t);
        }
    }
    setCurr(main.children[0]);
}
read=(file)=>{
    if (file.type.startsWith('text')) {
        if (confirm('This will overwrite the current game. Sure?')) {
            let f=new FileReader();
            f.addEventListener('load',()=>loadGame(f.result));
            f.readAsText(file);
        }
    } else {alert('Text files only!')}
};
save=()=>{
    if (localStorage.getItem('consent')) {
        return 1;
    }
    let c=getColors().map(eval);
    for (let i = 0; i < 5; i++) {
        localStorage.setItem(['background','color','bad','good','neutral'][i],c[i])
    }
    c=main.innerHTML;
    localStorage.setItem('0',c);
}