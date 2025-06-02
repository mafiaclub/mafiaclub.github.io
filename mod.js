function addPlayer(n,r) {
    let p=document.createElement('div');
    p.innerHTML=`<label>Player: </label><input name="name" onblur="roster()" value="${n||''}"><br><label>Role: </label><input name="role" value="${r||''}"><br><label>Dead?</label><input type="checkbox" onclick="if (this.checked) {this.parentElement.style.opacity=0.5} else {this.parentElement.style.opacity=''}; roster();"><br><label>Nominations (2=on block):</label><input type="number" min="0" max="2"><br><label>Ability uses: </label><input type="number"><br><label>#Bulletproof: </label><input type="number"><br><label>Info: </label><input><a style="color:#f00;font-size:unset" onclick="this.parentElement.remove()">X</a>`;
    p.className='entry';
    document.getElementById('ppl').appendChild(p);
}
function roster() {
    let d=document.getElementById('live');
    d.innerHTML='';
    for (let _ of document.getElementsByName('name')) {
        if (_.parentElement.style.opacity=='') {
            d.innerHTML+=`<option value="${_.value}"></option>`
        }
    }
}
visit=(p,r)=>`<label>Player: </label><input value="${p}" list="live"><br><label>Role: </label><input value="${r}"><br><label>Visit: </label><input list="live"><br><label>Result: </label><input><a style="color:#f00;font-size:unset" onclick="this.parentElement.remove()">X</a>`
function act(p,r) {
    let a=document.createElement('div');
    a.innerHTML=visit(p,r);
    a.className='entry';
    document.getElementById('do').appendChild(a);
    }
function actAll() {
    for (let i = 0; i < document.getElementsByName('name').length; i++) {
        if (document.getElementsByName('name')[i].parentElement.style.opacity=='') {
            act(document.getElementsByName('name')[i].value,document.getElementsByName('role')[i].value)
        }
    }
}
function assignRoles() {
    let m=document.getElementById('m').value;
    let n=document.getElementById('n').value;
    let t=document.getElementById('t').value;
    let r = (m+(m&&n?',':'')+n+((n||m)&&t?',':'')+t).split(',').sort(()=>(Math.random()-0.5));
    let p = document.getElementById('p').value.split(',');
    if (p.length>r.length) {
        alert('More players than roles!')
    } else {
        for (let i = 0; i < p.length; i++) {
            addPlayer(p[i],r[i])
        }
    }
}
function getTier(tier) {
    window.pool={}
    let t=new XMLHttpRequest();
    t.open('GET',`https://raw.githubusercontent.com/mafiaclub/mafiaclub.github.io/master/tiers/${tier}.json`);
    t.onreadystatechange = () => {
        if (t.readyState==XMLHttpRequest.DONE) {
            tier=JSON.parse(t.responseText)
        }
        let r=new XMLHttpRequest();
        r.open('GET','https://raw.githubusercontent.com/mafiaclub/mafiaclub.github.io/master/roles.json');
        r.onreadystatechange = () => {
            if (r.readyState==XMLHttpRequest.DONE) {
                roles=JSON.parse(r.responseText);
                pool.m=roles.filter(x=>x.team=="Mafia"&&tier.roles.includes(x.name));
                pool.t=roles.filter(x=>x.team=="Town"&&tier.roles.includes(x.name));
                pool.n=roles.filter(x=>x.team=="Third Party"&&tier.roles.includes(x.name))
            }
        }
        r.send();
    }
    document.getElementById('load').disabled=true;
    t.send();
}
function getRoles() {
    for (let s of ['m','n','t']) {
        let i=document.getElementById(s);
        let N=parseInt(document.getElementById(s.toUpperCase()).value);
        let a=pool[s];
        for (let j = 0; j < N; j++) {
            i.value+=(i.value?',':'')+a[Math.floor(Math.random()*a.length)].name;
        }
    }
}