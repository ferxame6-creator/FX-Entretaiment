const audio=new Audio();
function escapeMarkup(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function stageCoordinate(element,axis,index){const value=parseFloat(element.style[axis]);if(Number.isFinite(value))return value;const stored=p()[index]?.[axis==='left'?0:1];return Number.isFinite(+stored)?+stored:50}
const formationCollapseStyle=document.createElement('style');formationCollapseStyle.textContent='.formations-collapsed>.formation{display:none!important}';document.head.append(formationCollapseStyle);
const hiddenToolbarActions=document.createElement('style');hiddenToolbarActions.textContent='#color,#showNames{display:none!important}';document.head.append(hiddenToolbarActions);
state.formations.forEach(formation=>formation.positions.forEach(dancer=>dancer[2]='#ff3b57'));save();render();
const orangeTheme=document.createElement('style');orangeTheme.textContent=':root{--accent:#ff7a00;--accent-dark:#d95000;--accent-light:#ffd27a;--accent-bg:#38200b;--bg:#090909;--panel:#171717;--line:#383838;--text:#fff;--muted:#b6aaa0;--pink:var(--accent);--grid:#333}body{background:radial-gradient(circle at 50% 0,var(--accent-bg),transparent 38%),#090909}header b{color:var(--accent)}.toolbar,.panel{background:#171717;border-color:#393939}.formation.active,.play{background:linear-gradient(135deg,var(--accent),var(--accent-dark))}#viewport{border-color:var(--accent);background:#0f0f0f}#stage{background-color:#141414;background-image:linear-gradient(#353535 1px,transparent 1px),linear-gradient(90deg,#353535 1px,transparent 1px)}.cross:before{border-color:var(--accent)}.cross:after{border-color:var(--accent)}.center-mark{background:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 28%,transparent),0 0 12px var(--accent)}.dancer{background:var(--accent)!important}.timer b,#status,.distance-info{color:var(--accent-light)}.music button{background:var(--accent)}.path{background:linear-gradient(90deg,var(--accent),var(--accent-light))}input[type=range]{accent-color:var(--accent)}';document.head.append(orangeTheme);const themes={naranja:['#ff7a00','#d95000','#ffd27a','#38200b'],morado:['#a855f7','#6d28d9','#e9b7ff','#27103b'],azul:['#00aaff','#0764d8','#9be7ff','#082c47'],rojo:['#ff3d3d','#bd1212','#ffadad','#3a0c0c'],dorado:['#e5ad22','#a66700','#ffe29a','#382b07'],turquesa:['#00cdbd','#008f88','#9affef','#063832']};function applyTheme(name){let t=themes[name]||themes.naranja,r=document.documentElement;r.style.setProperty('--accent',t[0]);r.style.setProperty('--accent-dark',t[1]);r.style.setProperty('--accent-light',t[2]);r.style.setProperty('--accent-bg',t[3]);localStorage.setItem('fx-dance-theme',name)}const themeTool=document.createElement('select');themeTool.id='themePicker';themeTool.innerHTML='<option value="naranja">🟠 Naranja</option><option value="morado">🟣 Morado</option><option value="azul">🔵 Azul</option><option value="rojo">🔴 Rojo</option><option value="dorado">🟡 Dorado</option><option value="turquesa">🟢 Turquesa</option>';document.querySelector('.toolbar').append(themeTool);themeTool.value=localStorage.getItem('fx-dance-theme')||'naranja';applyTheme(themeTool.value);themeTool.onchange=e=>applyTheme(e.target.value);
const file=document.createElement('div');file.className='music-file';file.innerHTML='<button id="loadSong">♫ Cargar canción MP3</button><input id="musicFile" type="file" accept="audio/*" hidden>';document.querySelector('.music').after(file);$('#loadSong').onclick=()=>$('#musicFile').click();
const loadedSongs=[];$('#musicFile').onchange=e=>{let song=e.target.files[0];if(!song)return;let url=URL.createObjectURL(song);audio.src=url;loadedSongs.push({name:song.name,url});$('#status').textContent='Canción agregada: '+song.name;audio.onloadedmetadata=()=>{document.querySelector('.music span:last-child').textContent=formatTime(audio.duration);$('#musicProgress').max=audio.duration};audio.ontimeupdate=()=>{$('#musicProgress').value=audio.currentTime;$('#musicTime').textContent=formatTime(audio.currentTime)};};
const searchTools=document.createElement('div');searchTools.className='library-tools';searchTools.innerHTML='<button id="toggleFormations">▦ Formaciones</button><button id="openSearch">⌕ SEARCH</button>';document.querySelector('.toolbar').append(searchTools);const searchStyle=document.createElement('style');searchStyle.textContent='body.formations-hidden .workspace{grid-template-columns:minmax(440px,1fr) 230px}body.formations-hidden .workspace>aside:first-child{display:none}';document.head.append(searchStyle);$('#toggleFormations').onclick=()=>{let hidden=document.body.classList.toggle('formations-hidden');$('#toggleFormations').textContent=hidden?'▦ Mostrar':'▦ Formaciones'};const searchBox=document.createElement('div');searchBox.style.cssText='display:none;position:fixed;inset:0;z-index:40;background:#000b;place-items:center';searchBox.innerHTML='<section style="width:min(440px,92vw);max-height:75vh;overflow:auto;background:#171717;border:1px solid #813030;border-radius:12px;padding:20px;color:#fff"><button id="closeSearch" style="float:right">×</button><h2 style="margin:0 0 10px">SEARCH</h2><input id="searchInput" placeholder="Buscar formación o canción" style="width:100%;padding:10px;background:#2a2525;border:1px solid #6d3030;border-radius:7px;color:white"><div id="searchResults" style="margin-top:12px"></div></section>';document.body.append(searchBox);function paintSearch(value=''){let q=value.toLowerCase(),formations=state.formations.map((x,i)=>({name:x.name,index:i})).filter(x=>x.name.toLowerCase().includes(q)),songs=loadedSongs.filter(x=>x.name.toLowerCase().includes(q));$('#searchResults').innerHTML='<small>FORMACIONES</small>'+ (formations.length?formations.map(x=>`<button data-formation="${x.index}" style="display:block;width:100%;margin:6px 0;text-align:left">${escapeMarkup(x.name)}</button>`).join(''):'<p>Sin resultados</p>')+'<small>CANCIONES AGREGADAS</small>'+(songs.length?songs.map((x,i)=>`<button data-song="${i}" style="display:block;width:100%;margin:6px 0;text-align:left">♫ ${escapeMarkup(x.name)}</button>`).join(''):'<p>Sin canciones cargadas.</p>');document.querySelectorAll('[data-formation]').forEach(b=>b.onclick=()=>{state.current=+b.dataset.formation;render();searchBox.style.display='none'});document.querySelectorAll('[data-song]').forEach(b=>{let song=loadedSongs[+b.dataset.song];b.onclick=()=>{audio.src=song.url;audio.play();searchBox.style.display='none';$('#status').textContent='Reproduciendo: '+song.name}})}$('#openSearch').onclick=()=>{paintSearch();searchBox.style.display='grid';$('#searchInput').focus()};$('#closeSearch').onclick=()=>searchBox.style.display='none';$('#searchInput').oninput=e=>paintSearch(e.target.value);
const formationsHeader=document.querySelector('.workspace>aside:first-child>p');Object.assign(formationsHeader.style,{display:'flex',alignItems:'center',gap:'6px'});Object.assign($('#openSearch').style,{marginLeft:'auto',padding:'5px 7px',fontSize:'9px'});formationsHeader.append($('#openSearch'));
const formationsPanel=document.querySelector('.workspace>aside:first-child');formationsPanel.insertBefore($('#toggleFormations'),formationsHeader);$('#toggleFormations').textContent='▾ Ocultar formaciones';$('#toggleFormations').style.cssText='width:100%;margin-bottom:8px';$('#toggleFormations').onclick=()=>{let hidden=formationsPanel.classList.toggle('formation-list-hidden');['#formations','#newFormation','.formActions','#partTools'].forEach(selector=>document.querySelector(selector).style.display=hidden?'none':'');$('#toggleFormations').textContent=hidden?'▸ Mostrar formaciones':'▾ Ocultar formaciones'};
const defaultParts=['Intro','Verso 1','Pre-coro','Coro','Verso 2','Puente','Final'];state.songParts=[...new Set([...(state.songParts||[]),...defaultParts])];const partTools=document.createElement('div');partTools.id='partTools';partTools.style.cssText='margin:8px 0;padding:8px 0;border-top:1px solid #4a3a3a;border-bottom:1px solid #4a3a3a';partTools.innerHTML='<small style="display:block;margin-bottom:5px">PARTE DE LA CANCIÓN</small><select id="partSelect" aria-hidden="true" tabindex="-1"></select><details class="part-picker"><summary><span id="partPickerValue"></span><i aria-hidden="true">⌄</i></summary><div class="part-picker-menu" role="listbox" aria-label="Song sections"></div></details><button id="newPart" style="width:100%;margin-top:6px">＋ Nueva parte</button>';formationsPanel.insertBefore(partTools,$('#formations'));function renderParts(){let select=$('#partSelect'),current=f().section||'Intro',picker=$('.part-picker'),menu=$('.part-picker-menu');select.innerHTML=state.songParts.map(part=>`<option value="${part.replaceAll('"','&quot;')}" ${part===current?'selected':''}>${part}</option>`).join('');$('#partPickerValue').textContent=current;menu.replaceChildren(...state.songParts.map(part=>{let option=document.createElement('button');option.type='button';option.className='part-picker-option';option.setAttribute('role','option');option.setAttribute('aria-selected',String(part===current));option.textContent=part;option.onclick=()=>{select.value=part;select.dispatchEvent(new Event('change',{bubbles:true}));picker.open=false};return option}))}function decorateFormations(){document.querySelectorAll('#formations .formation').forEach((button,index)=>{let formation=state.formations[index],section=formation.section||'Intro';button.innerHTML=`<span>${index+1}. ${formation.name}</span><small style="display:block;margin-top:3px;opacity:.72;font-size:9px">${section}</small>`});renderParts()}$('#partSelect').onchange=e=>change(()=>f().section=e.target.value);$('#newPart').onclick=()=>{let part=prompt('Nombre de la nueva parte:');if(!part)return;part=part.trim();if(!part)return;if(!state.songParts.includes(part))state.songParts.push(part);change(()=>f().section=part);renderParts()};$('#newFormation').onclick=()=>{let name=prompt('Nombre de la formación:','Nueva formación');if(!name)return;let part=$('#partSelect').value||'Intro';change(()=>{let next=JSON.parse(JSON.stringify(f()));next.name=name.trim();next.section=part;state.formations.push(next);state.current=state.formations.length-1});decorateFormations()};const partPickerStyle=document.createElement('style');partPickerStyle.textContent='#partTools{position:relative;z-index:4}#partSelect{display:none}.part-picker{position:relative;z-index:5}.part-picker>summary{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:35px;padding:7px 10px;border:1px solid #704048;border-radius:7px;background:#292121;color:#fff;cursor:pointer;list-style:none;font-size:12px;font-weight:700}.part-picker>summary::-webkit-details-marker{display:none}.part-picker>summary i{font-style:normal;color:#dfb8bb}.part-picker[open]>summary{border-color:#d34a57;border-radius:7px 7px 0 0}.part-picker-menu{display:none;position:absolute;top:calc(100% - 1px);left:0;right:0;z-index:140;max-height:220px;overflow:auto;padding:4px;background:#21191c;border:1px solid #743743;border-radius:0 0 8px 8px;box-shadow:0 10px 24px #000b}.part-picker:hover .part-picker-menu,.part-picker[open] .part-picker-menu,.part-picker:focus-within .part-picker-menu{display:grid}.part-picker-option{width:100%;min-height:32px;padding:7px 9px;border:0;border-radius:5px;background:transparent;color:#eee5e5;text-align:left;font-size:12px;font-weight:600}.part-picker-option:hover,.part-picker-option:focus-visible{background:#49252b;color:white;outline:none}.part-picker-option[aria-selected=true]{background:#612b33;color:#ffb7b9}';document.head.append(partPickerStyle);new MutationObserver(()=>decorateFormations()).observe($('#formations'),{childList:true});decorateFormations();
applyTheme('rojo');themeTool.style.display='none';
let choosingCenter=false;function centerAt(x,y){change(()=>{let dancers=p();if(!dancers.length)return;let averageX=dancers.reduce((sum,d)=>sum+d[0],0)/dancers.length,averageY=dancers.reduce((sum,d)=>sum+d[1],0)/dancers.length;dancers.forEach(d=>{d[0]=Math.max(2,Math.min(98,d[0]+x-averageX));d[1]=Math.max(2,Math.min(98,d[1]+y-averageY))})})}document.querySelector('[data-action="center"]').onclick=()=>{choosingCenter=true;$('#status').textContent='Haz clic en un cuadro para centrar la formación'};$('#stage').addEventListener('pointerdown',e=>{if(!choosingCenter)return;let rect=$('#stage').getBoundingClientRect(),step=100/35,x=Math.round(((e.clientX-rect.left)/rect.width*100)/step)*step,y=Math.round(((e.clientY-rect.top)/rect.height*100)/step)*step;e.stopImmediatePropagation();e.preventDefault();choosingCenter=false;centerAt(x,y);$('#status').textContent='Formación centrada en el cuadro elegido'},true);
setTimeout(()=>{decorateFormations=function(){let box=$('#formations'),buttons=[...box.children].filter(el=>el.classList.contains('formation'));if(!buttons.length){renderParts();return}let groups=new Map();buttons.forEach((button,index)=>{let formation=state.formations[index],section=formation.section||'Intro';button.innerHTML=`<span>${formation.name}</span>`;if(!groups.has(section)){let group=document.createElement('section');group.style.cssText='margin:8px 0;padding:6px;background:#241b1b;border-radius:7px';group.innerHTML=`<small style="display:block;color:#ff9b9b;letter-spacing:1px;margin:0 0 4px 3px">${section.toUpperCase()}</small>`;groups.set(section,group)}groups.get(section).append(button)});box.replaceChildren(...groups.values());renderParts()};decorateFormations()},0);
let musicPausedByUser=false,musicCountdown=0,musicCountdownTimer=null;
let playCountdownTimer=null;
function formatTime(value){let s=Math.floor(value);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function setMusicPosition(time){if(!audio.src)return;audio.currentTime=Math.min(Math.max(0,time),audio.duration||0);$('#musicProgress').value=audio.currentTime;$('#musicTime').textContent=formatTime(audio.currentTime)}
function playAudioIfAvailable(){if(!audio.src||audio.paused===false||musicPausedByUser)return;audio.play().then(()=>$('#musicPlay').textContent='❚❚').catch(()=>{});}
function resetMusicCountdown(){if(musicCountdownTimer){clearInterval(musicCountdownTimer);musicCountdownTimer=null;}musicCountdown=0;}
function clearPlayCountdown(){if(playCountdownTimer){clearInterval(playCountdownTimer);playCountdownTimer=null;}}
function startMusicCountdown(){if(!audio.src||!audio.paused||musicCountdownTimer)return;musicCountdown=3;$('#musicPlay').textContent=String(musicCountdown);musicCountdownTimer=setInterval(()=>{musicCountdown--;if(musicCountdown>0){$('#musicPlay').textContent=String(musicCountdown);return}resetMusicCountdown();audio.play().then(()=>$('#musicPlay').textContent='❚❚').catch(()=>{});musicPausedByUser=false;},1000)}
function centerDancers(){let dancers=p();if(dancers.length===0)return;if(dancers.length===1){dancers[0][0]=50;dancers[0][1]=50;return}let avgX=dancers.reduce((sum,d)=>sum+d[0],0)/dancers.length;let avgY=dancers.reduce((sum,d)=>sum+d[1],0)/dancers.length;let dx=50-avgX,dy=50-avgY;dancers.forEach(d=>{d[0]=Math.max(0,Math.min(100,d[0]+dx));d[1]=Math.max(0,Math.min(100,d[1]+dy))})}
function centerLineDancers(){
  const dancers=p(),count=dancers.length;
  if(!count)return;
  const stage=$('#stage'),width=stage?.offsetWidth||700,height=stage?.offsetHeight||700;
  const grid=getComputedStyle(stage).backgroundSize.split(/\s+/),cellX=parseFloat(grid[0])||20,cellY=parseFloat(grid[1])||cellX;
  const snap=(value,size,cell)=>Math.max(cell/2,Math.min(size-cell/2,Math.round(value/cell-.5)*cell+cell/2));
  // Keep the line compact and centered; reduce spacing for larger groups so nobody
  // gets pushed to the edges. Snap each marker to the center of a grid square.
  const maxSpan=Math.min(72,100-200*(cellX/2)/width),step=count>1?Math.min(12,maxSpan/(count-1)):0;
  const centerX=snap(width/2,width,cellX)/width*100,centerY=snap(height/2,height,cellY)/height*100;
  dancers.forEach((dancer,index)=>{
    const targetX=centerX+(index-(count-1)/2)*step;
    dancer[0]=snap(targetX/100*width,width,cellX)/width*100;
    dancer[1]=centerY;
  });
}
document.querySelector('[data-action="center"]').onclick=()=>change(centerDancers);
document.addEventListener('keydown',e=>{
  const active=document.activeElement;
  const modal=$('#modal');
  if($('#welcomeHome')||$('#welcomeGroupChooser.is-open')||$('#keyboardGuide.is-open')||$('#fxDialog.is-open')||(modal&&!modal.classList.contains('hidden')))return;
  if(['INPUT','SELECT','TEXTAREA'].includes(active.tagName)||active.isContentEditable)return;
  if((e.code==='Space'||e.key==='Enter')&&active.matches?.('button:not(.dancer),summary,[role="button"],a[href]'))return;
  const key=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
  if(mod&&key==='z'){e.preventDefault();(e.shiftKey?$('#redo'):$('#undo')).click();return}
  if(mod&&key==='y'){e.preventDefault();$('#redo').click();return}
  if(mod||e.altKey)return;
  if(e.key==='ArrowRight'){state.current=(state.current+1)%state.formations.length;selected=0;render();e.preventDefault();return}
  if(e.key==='ArrowLeft'){state.current=(state.current-1+state.formations.length)%state.formations.length;selected=0;render();e.preventDefault();return}
  if(e.code==='Space'&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();$('#play').click();return}
  if(key==='n'){e.preventDefault();$('#newFormation').click();return}
  if(key==='a'){e.preventDefault();$('#addDancer').click();return}
  if(key==='d'){e.preventDefault();change(centerLineDancers);return}
  if(e.key==='+'||e.key==='='){e.preventDefault();$('#zoomIn').click();return}
  if(e.key==='-'||e.key==='_'){e.preventDefault();$('#zoomOut').click()}
});
function toggleMusicPlayback(){if(!audio.src)return;if(musicCountdownTimer){resetMusicCountdown();$('#musicPlay').textContent='▶';musicPausedByUser=true;return}if(!audio.paused){resetMusicCountdown();audio.pause();$('#musicPlay').textContent='▶';musicPausedByUser=true;return}startMusicCountdown()}$('#musicPlay').onclick=toggleMusicPlayback;setInterval(()=>{if(audio.src&&animating&&!musicPausedByUser&&$('#play').textContent.includes('⏸')&&audio.paused){audio.play().then(()=>$('#musicPlay').textContent='❚❚').catch(()=>{})}},80);
function stopContinuousPlay(){clearPlayCountdown();animating=false;resetMusicCountdown();if(!audio.paused){audio.pause()}$('#play').textContent='▶ Reproducir';$('#musicPlay').textContent='▶';}
let firstPlay=true,counting=false;
function handlePlayButton(){if(counting||animating)return;const startAction=()=>play();if(firstPlay){counting=true;let n=3;$('#play').textContent=n;playCountdownTimer=setInterval(()=>{if(--n){$('#play').textContent=n;return}clearPlayCountdown();counting=false;startAction()},1000);firstPlay=false;return}startAction()}
$('#play').onclick=handlePlayButton;
let zonesOn=true;function drawZones(){let old=$('.stage-zones');if(old)old.remove();if(!zonesOn)return;let z=document.createElement('div');z.className='stage-zones';z.innerHTML='<i class="zone-v one"></i><i class="zone-v two"></i><i class="zone-h one"></i><i class="zone-h two"></i><b class="front">FRENTE</b><b class="back">FONDO</b>';$('#stage').append(z)}
drawZones();
function centerStageGuides(){
  const stage=$('#stage'),zones=$('.stage-zones');
  if(!stage||!zones)return;
  const width=stage.offsetWidth,height=stage.offsetHeight,grid=getComputedStyle(stage).backgroundSize.split(/\s+/),cellX=parseFloat(grid[0])||20,cellY=parseFloat(grid[1])||cellX;
  // Keep each pair exactly symmetric around the stage center; snapping the
  // one-third positions separately could make one guide drift by a grid cell.
  const x=width/2,y=height/2;
  const offsetX=Math.min(width/2-cellX/2,Math.max(cellX,Math.round((width/6)/cellX)*cellX));
  const offsetY=Math.min(height/2-cellY/2,Math.max(cellY,Math.round((height/6)/cellY)*cellY));
  const x1=x-offsetX,x2=x+offsetX,y1=y-offsetY,y2=y+offsetY;
  stage.style.setProperty('--guide-center-x',`${x/width*100}%`);stage.style.setProperty('--guide-center-y',`${y/height*100}%`);
  zones.querySelector('.zone-v.one').style.left=`${x1/width*100}%`;zones.querySelector('.zone-v.two').style.left=`${x2/width*100}%`;
  zones.querySelector('.zone-h.one').style.top=`${y1/height*100}%`;zones.querySelector('.zone-h.two').style.top=`${y2/height*100}%`;
  const centerMark=$('.center-mark');if(centerMark){centerMark.style.left=`${x/width*100}%`;centerMark.style.top=`${y/height*100}%`}
}
const centeredGuideStyle=document.createElement('style');centeredGuideStyle.textContent='.midline{left:var(--guide-center-x)!important}.cross:before{top:var(--guide-center-y)!important}.cross:after{left:calc(var(--guide-center-x) - 5px)!important;top:calc(var(--guide-center-y) - 5px)!important}';document.head.append(centeredGuideStyle);
requestAnimationFrame(centerStageGuides);
new ResizeObserver(()=>requestAnimationFrame(centerStageGuides)).observe($('#stage'));
['zoomIn','zoomOut'].forEach(id=>$('#'+id).addEventListener('click',()=>requestAnimationFrame(centerStageGuides)));
// Controles de ensayo del panel de transición.
$('#advanceButton').onclick=()=>{if(!animating)play()};$('#bpm').oninput=e=>{$('#bpmValue').textContent=e.target.value;localStorage.setItem('fx-dance-bpm',e.target.value)};let savedBpm=localStorage.getItem('fx-dance-bpm')||'120';$('#bpm').value=savedBpm;$('#bpmValue').textContent=savedBpm;


// Selección y arrastre de varios bailarines: Ctrl/Shift + clic.
setTimeout(()=>{
  let selectedDancers=new Set(), groupDrag=null;
  const dancers=()=>[...document.querySelectorAll('.dancer')];
  const paint=()=>dancers().forEach((el,i)=>{
    el.style.outline=selectedDancers.has(i)?'3px solid #ffd45a':'none';
    el.style.boxShadow=selectedDancers.has(i)?'0 0 0 6px rgba(255,212,90,.24)':'0 2px 9px #0008';
  });
  document.addEventListener('pointerdown',e=>{
    const all=dancers(), index=all.indexOf(e.target);
    if(index<0||animating)return;
    e.stopImmediatePropagation();e.preventDefault();
    if(e.ctrlKey||e.shiftKey){selectedDancers.has(index)?selectedDancers.delete(index):selectedDancers.add(index)}
    else if(!selectedDancers.has(index))selectedDancers=new Set([index]);
    if(!selectedDancers.size)selectedDancers.add(index);
    selected=index; paint(); snap();
    const rect=$('#stage').getBoundingClientRect(), starts={};
    selectedDancers.forEach(i=>starts[i]=[p()[i][0],p()[i][1]]);
    groupDrag={x:e.clientX,y:e.clientY,rect,starts};e.target.setPointerCapture(e.pointerId);
  },true);
  document.addEventListener('pointermove',e=>{
    if(!groupDrag)return;
    const dx=(e.clientX-groupDrag.x)/groupDrag.rect.width*100,dy=(e.clientY-groupDrag.y)/groupDrag.rect.height*100;
    selectedDancers.forEach(i=>{p()[i][0]=Math.max(0,Math.min(100,groupDrag.starts[i][0]+dx));p()[i][1]=Math.max(0,Math.min(100,groupDrag.starts[i][1]+dy))});
    dancers().forEach((el,i)=>{if(selectedDancers.has(i)){el.style.left=p()[i][0]+'%';el.style.top=p()[i][1]+'%'}});
  },true);
  document.addEventListener('pointerup',()=>{if(!groupDrag)return;selectedDancers.forEach(i=>{const[cx,cy]=snapToGridCenter(p()[i][0],p()[i][1]);p()[i][0]=cx;p()[i][1]=cy});dancers().forEach((el,i)=>{if(selectedDancers.has(i)){el.style.left=p()[i][0]+'%';el.style.top=p()[i][1]+'%'}});groupDrag=null;save();collision();paint()},true);
  document.addEventListener('click',e=>{if(e.target.classList.contains('dancer')){e.stopImmediatePropagation();e.preventDefault()}},true);
  $('#status').textContent='Ctrl o Shift + clic: selecciona varios y arrástralos juntos';
},100);

// Figuras rápidas, notas de escena y etiquetas opcionales.
const creativeTools=document.createElement('div');creativeTools.className='library-tools';creativeTools.innerHTML='<button id="editNickname">🏷 Apodo</button><button id="showNames">👁 Nombres: no</button>';document.querySelector('.toolbar').append(creativeTools);
let namesVisible=false;function showNicknames(){document.querySelectorAll('.name-tag').forEach(x=>x.remove());if(!namesVisible)return;document.querySelectorAll('.dancer').forEach((el,i)=>{let tag=document.createElement('span');tag.className='name-tag';tag.textContent=p()[i][4]||('Bailarín '+(i+1));Object.assign(tag.style,{position:'absolute',left:'50%',top:'-19px',transform:'translateX(-50%)',whiteSpace:'nowrap',fontSize:'10px',fontWeight:'700',color:'#fff',textShadow:'0 1px 3px #000',pointerEvents:'none'});el.append(tag)})}
$('#editNickname').onclick=()=>{let name=prompt('Apodo del bailarín seleccionado:',p()[selected]?.[4]||'');if(name!==null)change(()=>p()[selected][4]=name.trim());showNicknames()};$('#showNames').onclick=()=>{namesVisible=!namesVisible;$('#showNames').textContent='👁 Nombres: '+(namesVisible?'sí':'no');showNicknames()};new MutationObserver(records=>{let newDancer=records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&n.classList.contains('dancer')));if(namesVisible&&newDancer)showNicknames()}).observe($('#stage'),{childList:true});

// Biblioteca de bailes guardados en este dispositivo.
// Rutas dibujadas para que un bailarín siga el recorrido al reproducir.
setTimeout(()=>{state.formations.forEach(formation=>delete formation.routes);save();['#drawRoute','#clearRoute','.straight-line','.move-handle','.flex-line','.flex-handle','#routeLayer'].forEach(selector=>document.querySelectorAll(selector).forEach(el=>{if(el.matches('button'))el.style.display='none';else el.remove()}));},200);
setTimeout(()=>{let flexMode=false,dragPoint=null;const next=()=>state.formations[(state.current+1)%state.formations.length];const getPoint=e=>{let r=$('#stage').getBoundingClientRect();return[Math.max(2,Math.min(98,(e.clientX-r.left)/r.width*100)),Math.max(2,Math.min(98,(e.clientY-r.top)/r.height*100))]};function drawFlexible(){document.querySelectorAll('.straight-line,.move-handle,.flex-line,.flex-handle,#routeLayer').forEach(x=>x.remove());let route=f().routes?.[selected];if(!route?.length)return;let start=p()[selected],points=[start,...route],svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('flex-line');svg.setAttribute('viewBox','0 0 100 100');Object.assign(svg.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'4'});let poly=document.createElementNS(svg.namespaceURI,'polyline');poly.setAttribute('points',points.map(v=>v.join(',')).join(' '));poly.setAttribute('fill','none');poly.setAttribute('stroke','#ffb000');poly.setAttribute('stroke-width','0.9');poly.setAttribute('stroke-linecap','round');svg.append(poly);$('#stage').append(svg);route.forEach((pnt,i)=>{let h=document.createElement('button');h.className='flex-handle';h.textContent=i===route.length-1?'↔':'●';Object.assign(h.style,{position:'absolute',left:pnt[0]+'%',top:pnt[1]+'%',transform:'translate(-50%,-50%)',zIndex:'6',width:'22px',height:'22px',padding:'0',borderRadius:'50%',background:'#ffb000',color:'#111',cursor:'grab'});h.onpointerdown=e=>{e.stopImmediatePropagation();dragPoint=i;e.target.setPointerCapture(e.pointerId)};$('#stage').append(h)})}function makeLine(end){change(()=>{let start=p()[selected],mid=[(start[0]+end[0])/2,(start[1]+end[1])/2];f().routes=f().routes||{};f().routes[selected]=[mid,end];next().positions[selected][0]=end[0];next().positions[selected][1]=end[1]});drawFlexible();$('#status').textContent='Arrastra el punto ● para doblar la línea'}$('#drawRoute').onclick=()=>{flexMode=!flexMode;$('#drawRoute').textContent=flexMode?'✚ Marca el destino':'✎ Dibujar línea';$('#status').textContent=flexMode?'Haz clic en el destino del bailarín':'Línea cancelada'};$('#clearRoute').onclick=()=>change(()=>{if(f().routes)delete f().routes[selected];drawFlexible()});$('#stage').addEventListener('pointerdown',e=>{if(!flexMode||e.target.classList.contains('flex-handle'))return;e.stopImmediatePropagation();e.preventDefault();makeLine(getPoint(e));flexMode=false;$('#drawRoute').textContent='✎ Dibujar línea'},true);document.addEventListener('pointermove',e=>{if(dragPoint===null)return;let route=f().routes?.[selected];if(!route)return;let pt=getPoint(e);route[dragPoint]=pt;if(dragPoint===route.length-1){next().positions[selected][0]=pt[0];next().positions[selected][1]=pt[1]}drawFlexible()});document.addEventListener('pointerup',()=>{if(dragPoint===null)return;dragPoint=null;save();drawFlexible()});new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&n.classList.contains('dancer'))))drawFlexible()}).observe($('#stage'),{childList:true});drawFlexible()},80);
setTimeout(()=>{let lineMode=false,handleDrag=null;const nextForm=()=>state.formations[(state.current+1)%state.formations.length];function point(e){let r=$('#stage').getBoundingClientRect();return[Math.max(2,Math.min(98,(e.clientX-r.left)/r.width*100)),Math.max(2,Math.min(98,(e.clientY-r.top)/r.height*100))]}function drawStraightLine(){document.querySelectorAll('.straight-line,.move-handle').forEach(x=>x.remove());let end=f().routes?.[selected]?.[0];if(!end)return;let start=p()[selected];let svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('straight-line');svg.setAttribute('viewBox','0 0 100 100');Object.assign(svg.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'4'});let line=document.createElementNS(svg.namespaceURI,'line');line.setAttribute('x1',start[0]);line.setAttribute('y1',start[1]);line.setAttribute('x2',end[0]);line.setAttribute('y2',end[1]);line.setAttribute('stroke','#ffb000');line.setAttribute('stroke-width','0.8');line.setAttribute('stroke-dasharray','2 1');svg.append(line);$('#stage').append(svg);let handle=document.createElement('button');handle.className='move-handle';handle.textContent='↔';Object.assign(handle.style,{position:'absolute',left:end[0]+'%',top:end[1]+'%',transform:'translate(-50%,-50%)',zIndex:'6',width:'22px',height:'22px',padding:'0',borderRadius:'50%',background:'#ffb000',color:'#111',cursor:'grab'});handle.onpointerdown=e=>{e.stopImmediatePropagation();handleDrag=e.target;e.target.setPointerCapture(e.pointerId)};$('#stage').append(handle)}function setDestination(end){change(()=>{let next=nextForm();if(!next.positions[selected])return;next.positions[selected][0]=end[0];next.positions[selected][1]=end[1];f().routes=f().routes||{};f().routes[selected]=[end]});drawStraightLine();$('#status').textContent='Línea guardada; arrastra el punto naranja para cambiarla'}$('#drawRoute').onclick=()=>{lineMode=!lineMode;$('#drawRoute').textContent=lineMode?'✚ Marca el destino':'✎ Dibujar línea';$('#status').textContent=lineMode?'Haz clic en el destino del bailarín seleccionado':'Línea cancelada'};$('#clearRoute').onclick=()=>change(()=>{if(f().routes)delete f().routes[selected];document.querySelectorAll('.straight-line,.move-handle').forEach(x=>x.remove())});$('#stage').addEventListener('pointerdown',e=>{if(!lineMode||e.target.classList.contains('move-handle'))return;e.stopImmediatePropagation();e.preventDefault();setDestination(point(e));lineMode=false;$('#drawRoute').textContent='✎ Dibujar línea'},true);document.addEventListener('pointermove',e=>{if(!handleDrag)return;let end=point(e),next=nextForm();next.positions[selected][0]=end[0];next.positions[selected][1]=end[1];f().routes=f().routes||{};f().routes[selected]=[end];drawStraightLine()});document.addEventListener('pointerup',()=>{if(!handleDrag)return;handleDrag=null;save();drawStraightLine()});new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&n.classList.contains('dancer'))))drawStraightLine()}).observe($('#stage'),{childList:true});drawStraightLine()},0);
const routeTools=document.createElement('div');routeTools.className='library-tools';routeTools.innerHTML='<button id="drawRoute">✎ Dibujar ruta</button><button id="clearRoute">⌫ Borrar ruta</button>';document.querySelector('.toolbar').append(routeTools);let drawingRoute=false,routePoints=[];function routeLayer(){let old=$('#routeLayer');if(old)old.remove();let svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='routeLayer';svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');Object.assign(svg.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'3'});let routes=f().routes||{};Object.entries(routes).forEach(([i,points])=>{if(!points?.length)return;let line=document.createElementNS(svg.namespaceURI,'polyline');line.setAttribute('points',points.map(p=>p.join(',')).join(' '));line.setAttribute('fill','none');line.setAttribute('stroke','#ffb000');line.setAttribute('stroke-width','0.6');line.setAttribute('stroke-dasharray','1.5 1');svg.append(line)});$('#stage').append(svg)}function saveRoute(){if(routePoints.length<2)return;change(()=>{f().routes=f().routes||{};f().routes[selected]=routePoints});routeLayer();$('#status').textContent='Ruta guardada para el bailarín seleccionado'}$('#drawRoute').onclick=()=>{drawingRoute=!drawingRoute;$('#drawRoute').textContent=drawingRoute?'✎ Terminar ruta':'✎ Dibujar ruta';$('#status').textContent=drawingRoute?'Dibuja sobre el escenario la ruta del bailarín seleccionado':'Ruta cancelada'};$('#clearRoute').onclick=()=>change(()=>{if(f().routes)delete f().routes[selected];routeLayer()});$('#stage').addEventListener('pointerdown',e=>{if(!drawingRoute)return;e.stopImmediatePropagation();e.preventDefault();let r=$('#stage').getBoundingClientRect();routePoints=[[Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))]];e.target.setPointerCapture?.(e.pointerId)},true);$('#stage').addEventListener('pointermove',e=>{if(!drawingRoute||!routePoints.length)return;let r=$('#stage').getBoundingClientRect();routePoints.push([Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))]);f().routes=f().routes||{};f().routes[selected]=routePoints;routeLayer()},true);$('#stage').addEventListener('pointerup',e=>{if(!drawingRoute||!routePoints.length)return;saveRoute();drawingRoute=false;$('#drawRoute').textContent='✎ Dibujar ruta';routePoints=[]},true);
function alongRoute(points,t){let segments=[],total=0;for(let i=1;i<points.length;i++){let d=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);segments.push(d);total+=d}let target=total*t;for(let i=0;i<segments.length;i++){if(target<=segments[i]||i===segments.length-1){let q=segments[i]?target/segments[i]:0,a=points[i],b=points[i+1];return[a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q]}target-=segments[i]}return points.at(-1)}play=function(){if(animating)return;if(!state.formations.length)return;animating=true;let source=f(),from=p().map(x=>[x[0],x[1]]),next=(state.current+1)%state.formations.length,to=state.formations[next].positions,els=[...document.querySelectorAll('.dancer')],duration=+$('#duration').value*1000/(+$('#speed').value),delay=+$('#delay').value,start=performance.now();$('#play').textContent='⏸ En movimiento…';function frame(now){let elapsed=now-start;els.forEach((el,i)=>{let t=Math.max(0,Math.min(1,(elapsed-i*delay)/duration)),ease=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,a=from[i],b=to[i]||a,route=source.routes?.[i],at=route?.length>1?alongRoute([a,...route,b],ease):[a[0]+(b[0]-a[0])*ease,a[1]+(b[1]-a[1])*ease];el.style.left=at[0]+'%';el.style.top=at[1]+'%'});if(elapsed<duration+delay*(els.length-1)){requestAnimationFrame(frame);return}state.current=next;animating=false;$('#play').textContent='▶ Reproducir transición';render();routeLayer()}requestAnimationFrame(frame)};
const danceTools=document.createElement('div');danceTools.className='library-tools';danceTools.innerHTML='<button id="saveDance">💾 Guardar baile</button><button id="myDances">▣ Mis bailes</button>';document.querySelector('.toolbar').append(danceTools);
const danceLibrary=document.createElement('div');danceLibrary.style.cssText='display:none;position:fixed;inset:0;z-index:30;background:#000b;place-items:center';danceLibrary.innerHTML='<section style="width:min(420px,90vw);max-height:70vh;overflow:auto;background:#292630;border:1px solid #514b59;border-radius:12px;padding:20px;color:white"><button id="closeDances" style="float:right">×</button><h2 style="margin:0">Mis bailes</h2><p style="color:#aaa4b0;font-size:12px">Guardados en este dispositivo</p><div id="danceList"></div></section>';document.body.append(danceLibrary);
const danceKey='ensemble-dance:';function savedDances(){return Object.keys(localStorage).filter(k=>k.startsWith(danceKey)).map(k=>k.slice(danceKey.length))}function saveDance(name){localStorage.setItem(danceKey+name,JSON.stringify(state));$('#status').textContent='✓ Baile guardado: '+name}function drawDances(){let list=savedDances();$('#danceList').innerHTML=list.length?list.map(name=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px;margin:6px 0;background:#393440;border-radius:7px"><b>${name}</b><span><button data-load-dance="${name}">Abrir</button><button data-delete-dance="${name}">Eliminar</button></span></div>`).join(''):'<small>No hay bailes guardados.</small>';document.querySelectorAll('[data-load-dance]').forEach(b=>b.onclick=()=>{state=JSON.parse(localStorage.getItem(danceKey+b.dataset.loadDance));state.current=0;render();danceLibrary.style.display='none';$('#status').textContent='Baile abierto: '+b.dataset.loadDance});document.querySelectorAll('[data-delete-dance]').forEach(b=>b.onclick=()=>{if(confirm('¿Eliminar este baile?')){localStorage.removeItem(danceKey+b.dataset.deleteDance);drawDances()}})}$('#saveDance').onclick=()=>{let name=prompt('Nombre del baile:',state.name||'Mi baile');if(name){state.name=name;$('#projectName').value=name;saveDance(name)}};$('#myDances').onclick=()=>{drawDances();danceLibrary.style.display='grid'};$('#closeDances').onclick=()=>danceLibrary.style.display='none';

// Partes plegables y orden de reproducción programable.
setTimeout(()=>{
  state.collapsedParts=state.collapsedParts||{};
  state.playOrder=(state.playOrder||[]).filter(i=>Number.isInteger(i)&&state.formations[i]);
  const sequenceTools=document.createElement('div');
  sequenceTools.id='sequenceTools';
  sequenceTools.style.cssText='margin-top:8px;padding-top:8px;border-top:1px solid #4a3a3a';
  sequenceTools.innerHTML='<small style="display:block;margin-bottom:5px">ORDEN DE REPRODUCCIÓN</small><div id="sequenceOrder" style="display:grid;gap:4px"></div><button id="addToSequence" style="width:100%;margin-top:6px">＋ Agregar formación actual</button><button id="clearSequence" style="width:100%;margin-top:5px">Limpiar orden</button>';
  $('#partTools').append(sequenceTools);
  function saveSequence(){save();$('#status').textContent='Orden de reproducción guardado'}
  function drawSequence(){
    const box=$('#sequenceOrder');
    box.innerHTML=state.playOrder.length?state.playOrder.map((index,pos)=>{let form=state.formations[index];return `<div style="display:flex;gap:3px;align-items:center;background:#2b2020;border-radius:5px;padding:4px"><span style="flex:1;font-size:11px">${pos+1}. ${form?.name||'Formación eliminada'}</span><button data-seq-up="${pos}">↑</button><button data-seq-down="${pos}">↓</button><button data-seq-remove="${pos}">×</button></div>`}).join(''):'<small style="color:#bbaaaa">Sin orden: se usarán las formaciones normales.</small>';
    document.querySelectorAll('[data-seq-up]').forEach(b=>b.onclick=()=>{let i=+b.dataset.seqUp;if(i<1)return;[state.playOrder[i-1],state.playOrder[i]]=[state.playOrder[i],state.playOrder[i-1]];drawSequence();saveSequence()});
    document.querySelectorAll('[data-seq-down]').forEach(b=>b.onclick=()=>{let i=+b.dataset.seqDown;if(i>=state.playOrder.length-1)return;[state.playOrder[i+1],state.playOrder[i]]=[state.playOrder[i],state.playOrder[i+1]];drawSequence();saveSequence()});
    document.querySelectorAll('[data-seq-remove]').forEach(b=>b.onclick=()=>{state.playOrder.splice(+b.dataset.seqRemove,1);drawSequence();saveSequence()});
  }
  $('#addToSequence').onclick=()=>{state.playOrder.push(state.current);drawSequence();saveSequence()};
  $('#clearSequence').onclick=()=>{state.playOrder=[];drawSequence();saveSequence()};
  const oldDecorate=decorateFormations;
  decorateFormations=function(){
    oldDecorate();
    document.querySelectorAll('#formations section').forEach(group=>{
      const title=group.querySelector('small');if(!title)return;
      const part=title.dataset.part||title.textContent.trim().replace(/^[▸▾]\s*/,'').toLowerCase();
      title.dataset.part=part;
      const hidden=!!state.collapsedParts[part];
      group.classList.toggle('formations-collapsed',hidden);
      title.style.cssText+=';display:flex;align-items:center;justify-content:space-between;gap:6px;padding:5px;border-radius:4px';
      title.innerHTML=`<span>${part.toUpperCase()}</span><button type="button" class="part-toggle" aria-expanded="${!hidden}" style="padding:3px 6px;font-size:10px">${hidden?'Mostrar':'Ocultar'}</button>`;
      [...group.children].filter(child=>child!==title).forEach(child=>{child.hidden=hidden;if(hidden)child.style.setProperty('display','none','important');else child.style.removeProperty('display')});
      [...group.querySelectorAll('.formation')].forEach(button=>{button.hidden=hidden;if(hidden)button.style.setProperty('display','none','important');else button.style.removeProperty('display')});
      title.querySelector('.part-toggle').onclick=e=>{e.stopPropagation();state.collapsedParts[part]=!state.collapsedParts[part];save();decorateFormations()};
    });
  };
  drawSequence();decorateFormations();
  function programmedNext(){
    const order=(state.playOrder||[]).filter(i=>state.formations[i]);
    if(!order.length)return (state.current+1)%state.formations.length;
    const currentAt=order.indexOf(state.current);
    return currentAt<0?order[0]:order[(currentAt+1)%order.length];
  }
  play=function(){
    if(animating||!state.formations.length)return;
    animating=true;const from=p().map(x=>[x[0],x[1]]),next=programmedNext(),to=state.formations[next].positions,els=[...document.querySelectorAll('.dancer')],duration=+$('#duration').value*1000/(+$('#speed').value),delay=+$('#delay').value,start=performance.now();
    $('#play').textContent='⏸ En movimiento…';
    function frame(now){const elapsed=now-start;els.forEach((el,i)=>{const t=Math.max(0,Math.min(1,(elapsed-i*delay)/duration)),ease=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,a=from[i],b=to[i]||a;el.style.left=(a[0]+(b[0]-a[0])*ease)+'%';el.style.top=(a[1]+(b[1]-a[1])*ease)+'%'});if(elapsed<duration+delay*(els.length-1)){requestAnimationFrame(frame);return}state.current=next;animating=false;$('#play').textContent='▶ Reproducir transición';render();drawSequence()}
    requestAnimationFrame(frame);
  };
},250);

// Se conserva el plegado de partes, sin orden programado.
setTimeout(()=>{
  $('#sequenceTools')?.remove();
  delete state.playOrder;
  save();
  play=function(){
    if(animating||!state.formations.length)return;
    animating=true;const from=p().map(x=>[x[0],x[1]]),next=(state.current+1)%state.formations.length,to=state.formations[next].positions,els=[...document.querySelectorAll('.dancer')],duration=+$('#duration').value*1000/(+$('#speed').value),delay=+$('#delay').value,first=Math.max(0,Math.min(els.length-1,Number(window.fxDanceDelayStartIndex)||0)),start=performance.now();
    $('#play').textContent='⏸ En movimiento…';
    function frame(now){const elapsed=now-start;els.forEach((el,i)=>{const order=(i-first+els.length)%els.length,t=Math.max(0,Math.min(1,(elapsed-order*delay)/duration)),ease=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,a=from[i],b=to[i]||a;el.style.left=(a[0]+(b[0]-a[0])*ease)+'%';el.style.top=(a[1]+(b[1]-a[1])*ease)+'%'});if(elapsed<duration+delay*(els.length-1)){requestAnimationFrame(frame);return}state.current=next;animating=false;$('#play').textContent='▶ Reproducir transición';render()}
    requestAnimationFrame(frame);
  };
},300);

// Herramientas profesionales: entregables, colaboración, notas, versiones e identidad.
setTimeout(()=>{
  const proTools=document.createElement('div');
  proTools.className='library-tools';
  proTools.innerHTML='<button id="exportProject">⇧ Compartir</button><button id="importProject">⇩ Importar</button><input id="importProjectFile" type="file" accept="application/json,.json" hidden><button id="formationNotes">✎ Notas</button><button id="projectLook">✦ Portada</button>';
  document.querySelector('.toolbar').append(proTools);
  const safe=s=>String(s||'coreografia').replace(/[\\/:*?"<>|]+/g,'-').trim()||'coreografia';
  const currentName=()=>safe(state.name||$('#projectName').value);
  function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  $('#exportProject').onclick=()=>{const payload={app:'FX-Entretaiment Dance',version:1,exportedAt:new Date().toISOString(),project:state};download(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),currentName()+'.fxdance.json');$('#status').textContent='✓ Archivo listo para compartir'};
  $('#importProject').onclick=()=>$('#importProjectFile').click();
  function normalizeImportedProject(data){
    const project=data?.project||data;
    if(!project||typeof project!=='object'||!Array.isArray(project.formations)||project.formations.length===0)throw new Error('Invalid project');
    const usedFormationIds=new Set();
    const formations=project.formations.map((formation,formIndex)=>{
      if(!formation||typeof formation!=='object'||typeof formation.name!=='string'||!formation.name.trim()||!Array.isArray(formation.positions))throw new Error('Invalid formation');
      const positions=formation.positions.map((dancer,dancerIndex)=>{
        if(!Array.isArray(dancer)||!Number.isFinite(+dancer[0])||!Number.isFinite(+dancer[1]))throw new Error('Invalid dancer position');
        const color=typeof dancer[2]==='string'&&/^#[\da-f]{6}$/i.test(dancer[2])?dancer[2]:'#ff3b57';
        return [Math.max(0,Math.min(100,+dancer[0])),Math.max(0,Math.min(100,+dancer[1])),color,String(dancer[3]||`Bailarín ${dancerIndex+1}`),String(dancer[4]||'')];
      });
      if(!positions.length)throw new Error('A formation needs at least one dancer');
      const candidateId=String(formation.id||'');
      const id=/^[\w.-]{1,80}$/.test(candidateId)&&!usedFormationIds.has(candidateId)?candidateId:`fimport-${formIndex}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
      usedFormationIds.add(id);
      return {...formation,id,name:formation.name.trim(),section:typeof formation.section==='string'&&formation.section.trim()?formation.section.trim():'Intro',positions};
    });
    const current=Number.isInteger(+project.current)?Math.max(0,Math.min(+project.current,formations.length-1)):0;
    const importedParts=Array.isArray(project.songParts)?project.songParts.filter(part=>typeof part==='string'&&part.trim()).map(part=>part.trim()):[];
    const songParts=[...new Set([...importedParts,...defaultParts])];
    const formationIds=new Set(formations.map(formation=>String(formation.id)));
    const markerIds=new Set();
    const audioMarkers=Array.isArray(project.audioMarkers)?project.audioMarkers.filter(marker=>marker&&Number.isFinite(+marker.time)&&+marker.time>=0&&formationIds.has(String(marker.formationId))).map((marker,index)=>{let id=String(marker.id||'');if(!/^[\w.-]{1,80}$/.test(id)||markerIds.has(id))id=`mimport-${index}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,5)}`;markerIds.add(id);return {...marker,id,time:+marker.time}}):[];
    const collapsedParts=project.collapsedParts&&typeof project.collapsedParts==='object'&&!Array.isArray(project.collapsedParts)?project.collapsedParts:{};
    const sourceIdentity=project.identity&&typeof project.identity==='object'&&!Array.isArray(project.identity)?project.identity:{};
    const identity={logo:typeof sourceIdentity.logo==='string'&&sourceIdentity.logo.length<=8?sourceIdentity.logo:'✦',color:typeof sourceIdentity.color==='string'&&/^#[\da-f]{6}$/i.test(sourceIdentity.color)?sourceIdentity.color:'#7b1e3a'};
    return {...project,name:typeof project.name==='string'&&project.name.trim()?project.name.trim():'Coreografía importada',current,formations,songParts,audioMarkers,collapsedParts,identity};
  }
  $('#importProjectFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const previous=state;try{const imported=normalizeImportedProject(JSON.parse(reader.result));state=imported;selected=0;history.length=0;future.length=0;render();applyIdentity();save();$('#status').textContent='✓ Coreografía importada'}catch{state=previous;render();$('#status').textContent='El archivo no es una coreografía válida'}};reader.readAsText(file);e.target.value=''};
  const notesModal=document.createElement('div');notesModal.id='notesModal';notesModal.style.cssText='display:none;position:fixed;inset:0;z-index:60;background:#000b;place-items:center';notesModal.innerHTML='<section style="width:min(430px,90vw);background:#211b1b;border:1px solid #9a3030;border-radius:12px;padding:18px;color:#fff"><button id="closeNotes" style="float:right">×</button><h2 id="notesTitle" style="margin:0 0 10px">Notas</h2><textarea id="notesText" placeholder="Ej.: entrada desde la derecha, cambio de pareja..." style="width:100%;height:150px;box-sizing:border-box;background:#110e0e;color:#fff;border:1px solid #704040;border-radius:7px;padding:10px"></textarea><button id="saveNotes" style="width:100%;margin-top:8px">Guardar notas</button></section>';
  document.body.append(notesModal);
  $('#formationNotes').onclick=()=>{const formation=f();$('#notesTitle').textContent='Notas: '+formation.name;$('#notesText').value=formation.notes||'';notesModal.style.display='grid';$('#notesText').focus()};$('#closeNotes').onclick=()=>notesModal.style.display='none';$('#saveNotes').onclick=()=>{change(()=>f().notes=$('#notesText').value.trim());notesModal.style.display='none';$('#status').textContent='✓ Notas guardadas'};
  const identity=document.createElement('div');identity.id='identityPanel';identity.style.cssText='display:none;position:fixed;inset:0;z-index:60;background:#000b;place-items:center';identity.innerHTML='<section style="width:min(360px,90vw);background:#211b1b;border:1px solid #9a3030;border-radius:12px;padding:18px;color:#fff"><button id="closeIdentity" style="float:right">×</button><h2 style="margin:0 0 12px">Portada del proyecto</h2><label>Logo <select id="projectLogo" style="width:100%;margin:6px 0;padding:8px"><option>✦</option><option>♬</option><option>★</option><option>◆</option><option>✹</option></select></label><label>Color de portada <input id="coverColor" type="color" value="#7b1e3a" style="width:100%;margin:6px 0"></label><button id="saveIdentity" style="width:100%;margin-top:8px">Guardar portada</button></section>';document.body.append(identity);
  function applyIdentity(){const look=state.identity||{},logo=look.logo||'✦',color=look.color||'#7b1e3a';document.querySelector('header b').firstChild.textContent=logo+' FX-ENTRETAIMENT ';document.documentElement.style.setProperty('--accent',color);}
  applyIdentity();$('#projectLook').onclick=()=>{const look=state.identity||{};$('#projectLogo').value=look.logo||'✦';$('#coverColor').value=look.color||'#7b1e3a';identity.style.display='grid'};$('#closeIdentity').onclick=()=>identity.style.display='none';$('#saveIdentity').onclick=()=>{change(()=>state.identity={logo:$('#projectLogo').value,color:$('#coverColor').value});applyIdentity();identity.style.display='none';$('#status').textContent='✓ Portada actualizada'};
},350);

// Sincronización de coreografía con el tiempo real del audio.
setTimeout(()=>{
  const syncStyle=document.createElement('style');
  syncStyle.textContent=`
    #choreoSync{margin-top:12px;padding-top:12px;border-top:1px solid #4a3030;font-size:11px}
    #choreoSync h3{margin:0 0 8px;color:#ffaaaa;font-size:10px;letter-spacing:1.2px}
    #syncTimeline{position:relative;height:52px;margin:8px 0 5px;border-radius:7px;background:linear-gradient(90deg,#171111,#2c1717);border:1px solid #663333;cursor:pointer;overflow:visible}
    #syncPlayhead{position:absolute;top:-4px;bottom:-4px;width:2px;background:#fff;box-shadow:0 0 6px #fff;pointer-events:none;z-index:3}
    .sync-marker{position:absolute;top:8px;transform:translateX(-50%);border:0;border-radius:5px;background:#a82035;color:white;font-size:10px;padding:4px 5px;cursor:grab;z-index:4;white-space:nowrap}
    .sync-marker:active{cursor:grabbing}.sync-marker.active{background:#ff3d50;box-shadow:0 0 0 2px #ffb0b8}
    .sync-marker small{display:block;font-size:8px;opacity:.8}.sync-row{display:flex;gap:5px;margin:6px 0}.sync-row button,.sync-row select{font-size:10px;padding:6px;min-width:0}.sync-row select{flex:1;background:#2a2020;color:#fff;border:1px solid #6d4040;border-radius:5px}
    #syncMarkers{display:grid;gap:4px;margin-top:8px;max-height:125px;overflow:auto}.sync-marker-row{display:flex;align-items:center;gap:5px;padding:5px;border-radius:5px;background:#241919}.sync-marker-row b{width:39px;color:#ffb0b0}.sync-marker-row select{flex:1;min-width:0;background:#342525;color:#fff;border:1px solid #704040;border-radius:4px;padding:4px}.sync-marker-row button{padding:3px 6px}
  `;
  document.head.append(syncStyle);
  const sync=document.createElement('section');
  sync.id='choreoSync';
  sync.innerHTML=`<h3>COREOGRAFÍA SINCRONIZADA</h3>
    <div class="sync-row"><button id="syncAudioPlay">▶ Canción + baile</button><output id="syncClock">0:00</output></div>
    <div id="syncTimeline" title="Haz clic para mover el tiempo de la canción"><i id="syncPlayhead"></i></div>
    <div class="sync-row"><button id="addMarker">＋ Marcador en tiempo actual</button></div>
    <label style="display:block;margin-top:7px">Movimiento al cambiar<select id="syncMotion"><option value="0">Instantáneo</option><option value="250">0.25 segundos</option><option value="500" selected>0.5 segundos</option><option value="1000">1 segundo</option></select></label>
    <label style="display:block;margin-top:6px">Tipo de transición<select id="syncEase"><option value="linear">Linear</option><option value="easeIn">Ease In</option><option value="easeOut">Ease Out</option><option value="easeInOut" selected>Ease In Out</option><option value="smooth">Smooth</option></select></label>
    <div id="syncMarkers"></div>`;
  document.querySelector('.music').parentElement.append(sync);

  const markerId=()=>`m${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;
  const formationId=(formation,index)=>formation.id||(formation.id=`f${Date.now().toString(36)}${index}${Math.random().toString(36).slice(2,5)}`);
  const ensureData=()=>{state.formations.forEach(formationId);state.audioMarkers=(state.audioMarkers||[]).filter(m=>m&&Number.isFinite(+m.time)&&m.formationId).sort((a,b)=>a.time-b.time)};
  const seconds=t=>{t=Math.max(0,+t||0);return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')};
  let activeMarkerId=null,clockFrame=null,transitionFrame=null;
  ensureData();
  function selectedMarker(){return state.audioMarkers.find(m=>m.id===activeMarkerId)}
  function duration(){return Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:Math.max(1,+$('#musicProgress').max||100)}
  function markerFormation(marker){return state.formations.findIndex((formation,index)=>formationId(formation,index)===marker.formationId)}
  function currentMarker(time=audio.currentTime){let found=null;for(const marker of state.audioMarkers){if(marker.time<=time+.001)found=marker;else break}return found}
  function curve(type,t){if(type==='linear')return t;if(type==='easeIn')return t*t;if(type==='easeOut')return 1-(1-t)*(1-t);if(type==='smooth')return t*t*(3-2*t);return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
  function setPlayhead(){const d=duration(),left=Math.max(0,Math.min(100,audio.currentTime/d*100));$('#syncPlayhead').style.left=left+'%';$('#syncClock').textContent=seconds(audio.currentTime)}
  function markerOptions(selected){return state.formations.map((form,index)=>`<option value="${formationId(form,index)}" ${formationId(form,index)===selected?'selected':''}>${form.name}</option>`).join('')}
  function drawMarkers(){
    ensureData();const d=duration(),timeline=$('#syncTimeline');timeline.querySelectorAll('.sync-marker').forEach(x=>x.remove());
    state.audioMarkers.forEach(marker=>{const index=markerFormation(marker),form=state.formations[index];if(index<0)return;const button=document.createElement('button');button.className='sync-marker '+(marker.id===activeMarkerId?'active':'');button.dataset.id=marker.id;button.style.left=(marker.time/d*100)+'%';button.innerHTML=`◆<small>${form.name}</small>`;button.title=`${seconds(marker.time)} · ${form.name}`;timeline.append(button);bindMarkerDrag(button,marker)});
    $('#syncMarkers').innerHTML=state.audioMarkers.length?state.audioMarkers.map(marker=>{const index=markerFormation(marker),name=index<0?'Formación eliminada':state.formations[index].name;return `<div class="sync-marker-row" data-marker-row="${marker.id}"><b>${seconds(marker.time)}</b><select data-marker-form="${marker.id}">${markerOptions(marker.formationId)}</select><button data-marker-go="${marker.id}" title="Ir a este momento">⌖</button><button data-marker-delete="${marker.id}" title="Eliminar marcador">×</button></div>`}).join(''):'<small style="color:#b9a2a2">Crea un marcador al pausar la canción en el momento deseado.</small>';
    document.querySelectorAll('[data-marker-form]').forEach(select=>select.onchange=()=>{const marker=state.audioMarkers.find(m=>m.id===select.dataset.markerForm);if(marker){marker.formationId=select.value;save();syncAudio(true);drawMarkers()}});
    document.querySelectorAll('[data-marker-go]').forEach(button=>button.onclick=()=>{const marker=state.audioMarkers.find(m=>m.id===button.dataset.markerGo);if(marker){audio.currentTime=marker.time;syncAudio(true)}});
    document.querySelectorAll('[data-marker-delete]').forEach(button=>button.onclick=()=>{state.audioMarkers=state.audioMarkers.filter(m=>m.id!==button.dataset.markerDelete);if(activeMarkerId===button.dataset.markerDelete)activeMarkerId=null;save();drawMarkers()});
  }
  function bindMarkerDrag(button,marker){
    button.onpointerdown=e=>{e.preventDefault();e.stopPropagation();button.setPointerCapture(e.pointerId);const move=q=>{const rect=$('#syncTimeline').getBoundingClientRect();marker.time=Math.max(0,Math.min(duration(),(q.clientX-rect.left)/rect.width*duration()));button.style.left=(marker.time/duration()*100)+'%';button.title=`${seconds(marker.time)} · ${state.formations[markerFormation(marker)]?.name||''}`};const end=()=>{button.removeEventListener('pointermove',move);button.removeEventListener('pointerup',end);button.removeEventListener('pointercancel',end);state.audioMarkers.sort((a,b)=>a.time-b.time);save();drawMarkers();syncAudio(true)};button.addEventListener('pointermove',move);button.addEventListener('pointerup',end);button.addEventListener('pointercancel',end)};
  }
  function animateToFormation(index){
    if(index<0||!state.formations[index])return;
    if(transitionFrame)cancelAnimationFrame(transitionFrame);
    const elements=[...document.querySelectorAll('.dancer')],target=state.formations[index].positions,start=elements.map((el,i)=>[stageCoordinate(el,'left',i),stageCoordinate(el,'top',i)]),motion=+$('#syncMotion').value;
    state.current=index;selected=0;
    if(!motion){render();return}
    const began=performance.now(),ease=$('#syncEase').value;
    function tick(now){const t=Math.min(1,(now-began)/motion),q=curve(ease,t);elements.forEach((el,i)=>{const a=start[i],b=target[i]||a;el.style.left=(a[0]+(b[0]-a[0])*q)+'%';el.style.top=(a[1]+(b[1]-a[1])*q)+'%'});if(t<1){transitionFrame=requestAnimationFrame(tick);return}render()}
    transitionFrame=requestAnimationFrame(tick);
  }
  function syncAudio(forceInstant=false){
    ensureData();setPlayhead();const marker=currentMarker();
    if(!marker){activeMarkerId=null;drawMarkers();return}
    const index=markerFormation(marker);if(index<0)return;
    if(marker.id!==activeMarkerId||state.current!==index){activeMarkerId=marker.id;if(forceInstant){state.current=index;selected=0;render()}else animateToFormation(index);drawMarkers()}
  }
  function audioClock(){syncAudio(false);if(!audio.paused&&!audio.ended)clockFrame=requestAnimationFrame(audioClock);else clockFrame=null}
  audio.addEventListener('play',()=>{if(!clockFrame)clockFrame=requestAnimationFrame(audioClock);$('#syncAudioPlay').textContent='❚❚ Pausar canción'});
  audio.addEventListener('pause',()=>$('#syncAudioPlay').textContent='▶ Canción + baile');
  audio.addEventListener('ended',()=>{$('#syncAudioPlay').textContent='▶ Canción + baile'});
  audio.addEventListener('loadedmetadata',()=>{ensureData();drawMarkers();syncAudio(true)});
  audio.addEventListener('timeupdate',()=>syncAudio(false));
  audio.addEventListener('seeking',()=>syncAudio(true));
  audio.addEventListener('seeked',()=>syncAudio(true));
  $('#syncAudioPlay').onclick=()=>{if(!audio.src){$('#status').textContent='Primero carga una canción MP3';return}if(audio.paused)audio.play().catch(()=>{});else audio.pause()};
  $('#addMarker').onclick=()=>{if(!audio.src){$('#status').textContent='Primero carga una canción MP3';return}ensureData();const marker={id:markerId(),time:Math.round(audio.currentTime*100)/100,formationId:formationId(f(),state.current)};state.audioMarkers.push(marker);state.audioMarkers.sort((a,b)=>a.time-b.time);activeMarkerId=marker.id;save();drawMarkers();$('#status').textContent=`✓ ${f().name} vinculada a ${seconds(marker.time)}`};
  $('#syncTimeline').addEventListener('pointerdown',e=>{if(e.target.closest('.sync-marker'))return;const rect=$('#syncTimeline').getBoundingClientRect();audio.currentTime=Math.max(0,Math.min(duration(),(e.clientX-rect.left)/rect.width*duration()));syncAudio(true)});
  $('#musicProgress').addEventListener('input',e=>{if(audio.src){audio.currentTime=+e.target.value;syncAudio(true)}});
  drawMarkers();setPlayhead();
},500);

// Timeline debajo del escenario: más ancha y con más espacio para los marcadores.
setTimeout(()=>{
  const syncPanel=$('#choreoSync'),distance=$('#distanceInfo');
  if(syncPanel&&distance)distance.after(syncPanel);
  const wideSync=document.createElement('style');
  wideSync.textContent=`
    .center>#choreoSync{width:100%;max-width:none;margin:18px 0 0!important;padding:16px 18px!important}
    .center>#choreoSync .sync-row{display:flex;align-items:center}.center>#choreoSync #syncAudioPlay{width:auto;min-width:145px}.center>#choreoSync #syncTimeline{width:100%;height:88px!important}
    .center>#choreoSync #syncMarkers{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));max-height:180px}.center>#choreoSync .sync-marker-row{margin:0}
    @media(max-width:760px){.center>#choreoSync{margin-top:14px!important;padding:13px!important}.center>#choreoSync #syncTimeline{height:72px!important}.center>#choreoSync #syncMarkers{display:grid;grid-template-columns:1fr}}
  `;
  document.head.append(wideSync);
},620);

// Formaciones a la derecha, en el espacio que antes ocupaba Transición.
setTimeout(()=>{
  const rightFormations=document.createElement('style');
  rightFormations.textContent=`
    @media(min-width:761px){
      .workspace{grid-template-columns:minmax(640px,1fr) 230px!important}
      .workspace>.center{grid-column:1;grid-row:1;min-width:0}
      .workspace>aside:first-child{grid-column:2;grid-row:1;width:auto;min-width:0;max-height:calc(100vh - 120px);overflow:auto}
      .workspace>.controls{display:none}
    }
  `;
  document.head.append(rightFormations);
},630);

// Ajustes de transición recuperados dentro de la coreografía sincronizada.
setTimeout(()=>{
  const sync=$('#choreoSync');
  if(!sync||$('#transitionSettings'))return;
  const transition=document.createElement('details');transition.id='transitionSettings';transition.className='sync-advanced';transition.innerHTML='<summary>Avanzar y ajustes de movimiento</summary><div id="transitionSettingsBody"></div>';
  const body=transition.querySelector('#transitionSettingsBody');
  const speed=$('#speed')?.closest('label'),duration=$('#duration')?.closest('label'),delay=$('#delay')?.closest('label'),advance=$('#advanceButton');
  [speed,duration,delay,advance].filter(Boolean).forEach(control=>body.append(control));
  sync.append(transition);
  const transitionStyle=document.createElement('style');
  transitionStyle.textContent=`#transitionSettings{margin-top:8px}#transitionSettingsBody{display:grid;grid-template-columns:repeat(3,minmax(150px,1fr));gap:10px;align-items:end;padding-top:8px}#transitionSettingsBody label{margin:0!important}#transitionSettingsBody #advanceButton{margin:0!important;height:39px;align-self:end}@media(max-width:760px){#transitionSettingsBody{grid-template-columns:1fr}#transitionSettingsBody #advanceButton{width:100%}}`;
  document.head.append(transitionStyle);
},640);

setTimeout(()=>{
  const sync=$('#choreoSync'),songFile=$('.music-file');
  if(!sync||!songFile)return;
  songFile.id='syncSongFile';
  $('#syncAudioPlay').parentElement.after(songFile);
  const songStyle=document.createElement('style');
  songStyle.textContent=`#syncSongFile{margin:8px 0!important}#syncSongFile #loadSong{width:100%;padding:10px;border:1px solid #864047;background:#31252a;border-radius:8px;color:#fff;font-weight:700}@media(min-width:761px){#syncSongFile{max-width:280px}}`;
  document.head.append(songStyle);
},645);

// Música y ajustes de transición junto a los controles de formaciones.
setTimeout(()=>{
  const panel=document.querySelector('.workspace>aside:first-child'),actions=$('.formActions'),song=$('#syncSongFile'),settings=$('#transitionSettings');
  if(!panel||!actions)return;
  if(song)actions.after(song);
  if(settings)(song||actions).after(settings);
  const formationControls=document.createElement('style');
  formationControls.textContent=`
    .workspace>aside:first-child>#syncSongFile{max-width:none!important;margin:12px 0 0!important}
    .workspace>aside:first-child>#transitionSettings{margin-top:9px}.workspace>aside:first-child>#transitionSettingsBody{grid-template-columns:1fr!important;gap:7px!important}.workspace>aside:first-child>#transitionSettings #advanceButton{width:100%;height:auto}.workspace>aside:first-child>#transitionSettings label{font-size:10px}.workspace>aside:first-child>#transitionSettings select,.workspace>aside:first-child>#transitionSettings input{width:100%}
  `;
  document.head.append(formationControls);
},1100);

// Estos controles pertenecen a la timeline, debajo de sus opciones de movimiento.
setTimeout(()=>{
  const sync=$('#choreoSync'),advanced=sync?.querySelector('.sync-advanced'),song=$('#syncSongFile'),settings=$('#transitionSettings');
  if(!sync)return;
  if(advanced){
    advanced.after(song);
    if(settings)song.after(settings);
  }else{
    sync.append(song,settings);
  }
  const syncControlsBottom=document.createElement('style');
  syncControlsBottom.textContent=`
    #choreoSync>#syncSongFile{max-width:300px!important;margin:14px 0 0!important}
    #choreoSync>#transitionSettings{margin-top:10px}#choreoSync>#transitionSettingsBody{grid-template-columns:repeat(3,minmax(150px,1fr))!important}@media(max-width:760px){#choreoSync>#transitionSettingsBody{grid-template-columns:1fr!important}}
  `;
  document.head.append(syncControlsBottom);
},1200);

// Ubicación final: debajo de las acciones de la formación.
setTimeout(()=>{
  const panel=document.querySelector('.workspace>aside:first-child'),actions=$('.formActions'),song=$('#syncSongFile'),settings=$('#transitionSettings');
  if(!panel||!actions)return;
  actions.after(song);
  if(settings){song.after(settings);settings.open=true;}
},1300);

setTimeout(()=>{
  const stackedTransition=document.createElement('style');
  stackedTransition.textContent='.workspace>aside:first-child #transitionSettingsBody{display:flex!important;flex-direction:column!important;align-items:stretch!important}.workspace>aside:first-child #transitionSettingsBody>*{width:100%!important}';
  document.head.append(stackedTransition);
},1310);

// Se ocultan los ajustes duplicados de movimiento de la timeline.
setTimeout(()=>{
  const hideSyncMotion=document.createElement('style');
  hideSyncMotion.textContent='#choreoSync>.sync-advanced{display:none!important}';
  document.head.append(hideSyncMotion);
},1320);

setTimeout(()=>{
  const sync=$('#choreoSync'),advanced=sync?.querySelector('.sync-advanced');
  if(!sync||!advanced)return;
  // Se conservan ocultos porque el motor de reproducción usa estos valores.
  advanced.querySelectorAll('#syncMotion,#syncEase,#syncMarkers').forEach(control=>{
    control.style.display='none';
    sync.append(control);
  });
  advanced.remove();
},1330);

// Formaciones compactas: el estado activo se indica con una línea fina.
setTimeout(()=>{
  const slimFormation=document.createElement('style');
  slimFormation.textContent=`
    #formations .formation{min-height:29px!important;margin:3px 0!important;padding:6px 8px!important;border-radius:4px!important;background:transparent!important;border-left:2px solid transparent!important;color:#d5c7ca!important}
    #formations .formation.active{background:linear-gradient(90deg,#5d1a22aa,transparent)!important;border-left:3px solid #f04444!important;color:#fff!important;box-shadow:none!important}
    #formations .formation span{font-size:11px!important}
  `;
  document.head.append(slimFormation);
},1340);

// Se retiran las acciones de importación y compartir de la interfaz.
setTimeout(()=>{
  $('#exportProject')?.remove();
  $('#importProject')?.remove();
  $('#importProjectFile')?.remove();
},1350);

// Cada formación se sincroniza desde su propia fila, no desde un marcador genérico.
setTimeout(()=>{
  $('#addMarker')?.remove();
  const syncFormationStyle=document.createElement('style');
  syncFormationStyle.textContent=`
    #formations .formation{position:relative;padding-right:82px!important}
    #formations .sync-formation{position:absolute;right:6px;top:50%;transform:translateY(-50%);padding:4px 6px!important;min-width:0!important;width:auto!important;height:auto!important;border:1px solid #9e444b!important;border-radius:5px!important;background:#352328!important;color:#ffb8b8!important;font-size:9px!important;line-height:12px!important}
    #formations .sync-formation:hover{background:#7c2630!important;color:#fff!important}
  `;
  document.head.append(syncFormationStyle);
  const markFormation=index=>{
    if(!audio.src){$('#status').textContent='Primero carga una canción MP3';return}
    const formation=state.formations[index];if(!formation)return;
    formation.id=formation.id||`f-${Date.now().toString(36)}-${index}`;
    state.audioMarkers=state.audioMarkers||[];
    state.audioMarkers.push({id:`m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,time:Math.round(audio.currentTime*100)/100,formationId:formation.id});
    state.audioMarkers.sort((a,b)=>a.time-b.time);save();audio.dispatchEvent(new Event('timeupdate'));
    $('#status').textContent=`✓ ${formation.name} sincronizada en ${Math.floor(audio.currentTime/60)}:${String(Math.floor(audio.currentTime%60)).padStart(2,'0')}`;
  };
  const addSyncButtons=()=>document.querySelectorAll('#formations .formation').forEach(button=>{
    if(button.querySelector('.sync-formation'))return;
    const index=+button.dataset.i;if(!Number.isInteger(index))return;
    const syncButton=document.createElement('button');syncButton.type='button';syncButton.className='sync-formation';syncButton.textContent='＋ Sincronizar';
    syncButton.onclick=e=>{e.preventDefault();e.stopPropagation();markFormation(index)};button.append(syncButton);
  });
  new MutationObserver(addSyncButtons).observe($('#formations'),{childList:true,subtree:true});
  addSyncButtons();
},1360);

setTimeout(()=>{
  $('#copy')?.remove();
  $('#paste')?.remove();
},1370);

// Selector de idioma para la interfaz (los nombres creados por el usuario no cambian).
setTimeout(()=>{
  const picker=document.createElement('select');picker.id='languagePicker';picker.title='Language';picker.innerHTML='<option value="en">EN</option><option value="es">ES</option><option value="ko">한국어</option>';
  $('.toolbar').append(picker);
  const translations={
    'FORMATIONS':['FORMATIONS','FORMACIONES','포메이션'],'SONG SECTION':['SONG SECTION','PARTE DE LA CANCIÓN','노래 구간'],'NEW FORMATION':['New formation','Nueva formación','새 포메이션'],'＋ NEW FORMATION':['＋ New formation','＋ Nueva formación','＋ 새 포메이션'],'＋ NEW SECTION':['＋ New section','＋ Nueva parte','＋ 새 구간'],'RENAME':['Rename','Renombrar','이름 변경'],'DUPLICATE':['Duplicate','Duplicar','복제'],'DELETE':['Delete','Eliminar','삭제'],'＋ DANCER':['＋ Dancer','＋ Bailarín','＋ 댄서'],'⌫ DELETE':['⌫ Delete','⌫ Eliminar','⌫ 삭제'],'● COLOR':['● Color','● Color','● 색상'],'AUDIENCE':['AUDIENCE','AUDIENCIA','관객석'],'BACKSTAGE':['BACKSTAGE','BACKSTAGE','무대 뒤'],'MOVEMENT':['MOVEMENT','MOVIMIENTO','움직임'],'ADVANCE AND MOVEMENT SETTINGS':['Advance and movement settings','Avanzar y ajustes de movimiento','이동 설정 및 다음'],'ADVANCE':['Advance','Avanzar','다음'],'SPEED':['Speed','Velocidad','속도'],'DURATION':['Duration','Duración','시간'],'DELAY PER DANCER':['Delay per dancer','Retraso por bailarín','댄서별 지연'],'♫ LOAD MP3':['♫ Load MP3','♫ Cargar canción MP3','♫ MP3 불러오기'],'FORMATIONS WITH SONG':['FORMATIONS WITH SONG','FORMACIONES CON CANCIÓN','음악과 포메이션'],'▶ PLAY':['▶ Play','▶ Reproducir','▶ 재생'],'❚❚ PAUSE':['❚❚ Pause','❚❚ Pausa','❚❚ 일시정지'],'ACTIVE FORMATION: —':['Active formation: —','Formación activa: —','활성 포메이션: —'],'ACTIVE FORMATION:':['Active formation:','Formación activa:','활성 포메이션:'],'＋ LINK TO CURRENT TIME':['＋ Link to current time','＋ Vincular a este segundo','＋ 현재 시간에 연결'],'CLEAR ALL SYNC LINKS':['Clear all sync links','Borrar todas las sincronizaciones','모든 동기화 삭제'],'▾ HIDE SYNC LINKS':['▾ Hide sync links','▾ Ocultar sincronizaciones','▾ 동기화 숨기기'],'▸ SHOW SYNC LINKS':['▸ Show sync links','▸ Mostrar sincronizaciones','▸ 동기화 보기'],'SHOW FORMATIONS':['Show formations','Mostrar formaciones','포메이션 보기'],'HIDE FORMATIONS':['Hide formations','Ocultar formaciones','포메이션 숨기기'],'▾ HIDE FORMATIONS':['▾ Hide formations','▾ Ocultar formaciones','▾ 포메이션 숨기기'],'▸ SHOW FORMATIONS':['▸ Show formations','▸ Mostrar formaciones','▸ 포메이션 보기'],'SETTINGS':['Settings','Ajustes','설정'],'STAGE SIZE':['Stage size','Tamaño de escenario','무대 크기'],'LIGHT THEME':['Light theme','Tema claro','밝은 테마'],'MEDIUM':['Medium','Mediano','중간'],'LARGE':['Large','Grande','큼'],'SMALL':['Small','Pequeño','작음'],'DISTANCE: --':['Distance: --','Distancia: --','거리: --'],'SEARCH':['SEARCH','BUSCAR','검색'],'SAVE DANCE':['Guardar baile','Guardar baile','댄스 저장'],'MY DANCES':['Mis bailes','Mis bailes','내 댄스'],'NAMES: NO':['Nombres: no','Nombres: no','이름: 아니오'],'NAMES: YES':['Nombres: sí','Nombres: sí','이름: 예']
  };
  Object.assign(translations,{
    'LANGUAGE':['Language','Idioma','언어'],'INTRO':['Intro','Intro','인트로'],'VERSE 1':['Verse 1','Verso 1','1절'],'PRE-CHORUS':['Pre-chorus','Pre-coro','프리코러스'],'CHORUS':['Chorus','Coro','후렴'],'VERSE 2':['Verse 2','Verso 2','2절'],'BRIDGE':['Bridge','Puente','브리지'],'FINAL':['Final','Final','마지막'],'SETTINGS':['Settings','Ajustes','설정'],
    'COPY':['Copy','Copiar','복사'],'PASTE':['Paste','Pegar','붙여넣기'],'UNDO':['Undo','Deshacer','실행 취소'],'REDO':['Redo','Rehacer','다시 실행'],'CREATE A NEW GROUP':['Create a new group','Crear un grupo nuevo','새 그룹 만들기'],'NEW GROUP NAME':['New group name','Nombre del grupo nuevo','새 그룹 이름'],'SELECT A GROUP':['Select a group','Selecciona un grupo','그룹을 선택하세요'],'CREATE GROUP AND OPEN EDITOR':['Create group and open editor','Crear grupo y abrir editor','그룹 만들고 편집기 열기'],'OPEN EDITOR':['Open editor','Abrir editor','편집기 열기'],'CLOSE':['Close','Cerrar','닫기'],'CANCEL':['Cancel','Cancelar','취소'],'SAVE':['Save','Guardar','저장'],'RENAME FORMATION':['Rename formation','Renombrar formación','포메이션 이름 변경'],'DUPLICATE FORMATION':['Duplicate formation','Duplicar formación','포메이션 복제'],'REMOVE FORMATION':['Remove formation','Eliminar formación','포메이션 삭제'],'NEW SECTION':['New section','Nueva parte','새 구간'],'SEARCH FORMATIONS':['Search formations','Buscar formaciones','포메이션 검색'],'NO RESULTS':['No results','Sin resultados','결과 없음'],
    'LOAD SONG':['Load song','Cargar canción','음악 불러오기'],'PLAY TRANSITION':['Play transition','Reproducir transición','전환 재생'],'PLAY CHOREOGRAPHY':['Play choreography','Reproducir coreografía','안무 재생'],'BACKSTAGE':['Backstage','Escenario','무대 뒤'],'AUDIENCE':['Audience','Audiencia','관객석'],'TRANSITION SETTINGS':['Transition settings','Ajustes de transición','전환 설정'],'SONG SECTION':['Song section','Parte de la canción','노래 구간'],'FORMATIONS WITH SONG':['Formations with song','Formaciones con canción','음악과 포메이션'],'OPTIONS':['Options','Opciones','옵션'],'ADVANCED OPTIONS':['Advanced options','Opciones avanzadas','고급 옵션'],'TRANSITION TYPE':['Transition type','Tipo de transición','전환 유형'],'MOVEMENT WHEN CHANGING':['Movement when changing','Movimiento al cambiar','변경 시 이동'],'NO SAVED DANCES YET':['No hay bailes guardados todavía','No hay bailes guardados todavía','저장된 안무가 없습니다'],'CREATE DANCE':['Create dance','Crear baile','안무 만들기'],'OPEN DANCE':['Open dance','Abrir baile','안무 열기'],'DELETE ALL':['Delete all','Eliminar todo','모두 삭제'],'DELETE SELECTED':['Delete selected','Eliminar seleccionada','선택 삭제'],'CLEAR ALL SYNC LINKS':['Clear all sync links','Borrar todas las sincronizaciones','모든 동기화 삭제'],
    'ADD DANCER':['Add dancer','Añadir bailarín','댄서 추가'],'CENTER DANCERS IN A LINE':['Center dancers in a line','Centrar bailarines en línea','댄서를 한 줄로 정렬'],'PREVIOUS / NEXT FORMATION':['Previous / next formation','Formación anterior / siguiente','이전 / 다음 포메이션'],'ZOOM IN / OUT':['Zoom in / out','Acercar / alejar','확대 / 축소'],'PLAY TRANSITION TO NEXT FORMATION':['Play the transition to the next formation','Reproducir transición a la siguiente formación','다음 포메이션으로 전환 재생']
    ,'MUSIC AND TIMING':['Music and timing','Música y tiempos','음악 및 타이밍'],'FIRST LOAD AN MP3 SONG':['Load an MP3 song first','Primero carga una canción MP3','먼저 MP3 음악을 불러오세요'],'NO LINKED FORMATIONS YET.':['No linked formations yet.','Aún no hay formaciones vinculadas.','연결된 포메이션이 없습니다.'],'TIME':['Time','Tiempo','시간'],'DISTANCE:':['Distance:','Distancia:','거리:'],'⊙ CENTER':['⊙ Center','⊙ Centrar','⊙ 중앙'],'↻ ROTATE':['↻ Rotate','↻ Rotar','↻ 회전'],'↔ MIRROR H':['↔ Mirror H','↔ Espejar H','↔ 좌우 반전'],'↕ MIRROR V':['↕ Mirror V','↕ Espejar V','↕ 상하 반전'],'⇄ SWAP':['⇄ Swap','⇄ Intercambiar','⇄ 교환'],'LANGUAGE:':['Language:','Idioma:','언어:'],'SIZE:':['Size:','Tamaño:','크기:'],'BACK':['Back','Volver','뒤로'],'NEXT':['Next','Siguiente','다음'],'CONTINUE':['Continue','Continuar','계속'],'RENAME:':['Rename:','Renombrar:','이름 변경:'],'DANCER NICKNAME:':['Dancer nickname:','Apodo del bailarín:','댄서 별명:'],'NAME OF THE NEW SECTION:':['Name of the new section:','Nombre de la nueva parte:','새 구간 이름:'],'FORMATION NAME:':['Formation name:','Nombre de la formación:','포메이션 이름:'],'DANCE NAME:':['Dance name:','Nombre del baile:','안무 이름:'],'DELETE THIS DANCE?':['Delete this dance?','¿Eliminar este baile?','이 안무를 삭제할까요?'],'DELETE ALL FORMATIONS AND SONG SYNC LINKS? ONE FRESH FORMATION WILL REMAIN SO YOU CAN CONTINUE EDITING.':['Delete all formations and song sync links? One fresh formation will remain so you can continue editing.','¿Eliminar todas las formaciones y sincronizaciones de canciones? Quedará una formación nueva para que puedas seguir editando.','모든 포메이션과 음악 동기화를 삭제할까요? 계속 편집할 수 있도록 새 포메이션 하나는 남습니다.'],'CLEAR ALL SYNC LINKS?':['Clear all sync links?','¿Borrar todas las sincronizaciones?','모든 동기화 링크를 지울까요?'],'LOAD AN MP3 SONG FIRST':['Load an MP3 song first','Primero carga una canción MP3','먼저 MP3 음악을 불러오세요'],'DISTANCE: --':['Distance: --','Distancia: --','거리: --'],'ADVANCE AND MOVEMENT SETTINGS':['Advance and movement settings','Avanzar y ajustes de movimiento','이동 설정 및 다음'],'BACK 5 SECONDS':['Back 5 seconds','Retroceder 5 segundos','5초 뒤로'],'FORWARD 5 SECONDS':['Forward 5 seconds','Avanzar 5 segundos','5초 앞으로'],'SONG SECTIONS':['Song sections','Partes de la canción','노래 구간'],'SEARCH FORMATION OR SONG':['Search formation or song','Buscar formación o canción','포메이션 또는 노래 검색'],'NO DANCES SAVED.':['No dances saved.','No hay bailes guardados.','저장된 안무가 없습니다.'],'MUSIC AND TIMING':['Music and timing','Música y tiempos','음악 및 타이밍'],'MY CHOREOGRAPHY':['My choreography','Mi coreografía','내 안무'],'CHOREOGRAPHY':['Choreography','Coreografía','안무'],'DANCE PLANNER':['Dance planner','Planificador de baile','댄스 플래너'],'STAGE MAP':['Stage map','Mapa del escenario','무대 배치도'],'FORMATION DESIGN':['Formation design','Diseño de formaciones','포메이션 디자인'],'MOVE WITH INTENTION':['Move with intention','Muévete con intención','의도 있게 움직이기'],'FRONT':['Front','Frente','앞쪽'],'EDITING':['Editing','Edición','편집'],'PROJECT':['Project','Proyecto','프로젝트'],'OPTIONS OF TRANSITION AND MARKERS':['Transition and marker options','Opciones de transición y marcadores','전환 및 마커 옵션'],'NO FORMATIONS':['No formations','Sin formaciones','포메이션 없음'],'AUTOMATICALLY SAVED':['Saved automatically','Guardado automáticamente','자동 저장됨'],'NO COLLISIONS DETECTED':['No collisions detected','Sin choques detectados','충돌이 감지되지 않았습니다'],'MOTION LINES':['Show path lines','Mostrar líneas de recorrido','이동 경로 표시'],'SNAP TO GRID':['Snap to grid','Ajustar a cuadrícula','격자에 맞추기'],'STEP SEQUENCE':['Step sequence','Secuencia de pasos','단계별 순서'],'MUSIC':['Music','Música','음악'],'CHOREOGRAPHY NOTES':['Choreography notes','Notas de coreografía','안무 메모'],'SAVE NOTES':['Save notes','Guardar notas','메모 저장'],'EXAMPLE: ENTRY FROM THE RIGHT, CHANGE PARTNERS...':['E.g.: enter from the right, change partners...','Ej.: entrada desde la derecha, cambio de pareja...','예: 오른쪽에서 입장, 파트너 변경...'],'MY DANCES':['My dances','Mis bailes','내 안무'],'SAVE DANCE':['Save dance','Guardar baile','안무 저장'],'OPEN':['Open','Abrir','열기'],'DELETE':['Delete','Eliminar','삭제'],'UNDO':['Undo','Deshacer','실행 취소'],'REDO':['Redo','Rehacer','다시 실행'],'COPY':['Copy','Copiar','복사'],'PASTE':['Paste','Pegar','붙여넣기'],'BACKSTAGE':['Backstage','Tras bambalinas','무대 뒤'],'NO DANCES SAVED.':['No dances saved.','No hay bailes guardados.','저장된 안무가 없습니다.'],'SEARCH FORMATIONS…':['Search formations…','Buscar formaciones…','포메이션 검색…'],'SEARCH FORMATIONS':['Search formations','Buscar formaciones','포메이션 검색'],'YOUR CHOREOGRAPHY STARTS HERE':['Your next choreography starts here','Tu próxima coreografía empieza aquí','새 안무를 시작해 보세요'],'NAME':['Name','Nombre','이름'],'NEW SECTION NAME':['Name of the new section','Nombre de la nueva parte','새 구간 이름'],'NEW FORMATION NAME':['Name of the formation','Nombre de la formación','포메이션 이름'],'DANCER NICKNAME SELECTED:':['Nickname of selected dancer:','Apodo del bailarín seleccionado:','선택한 댄서 별명:'],'DELETE?':['Delete?','¿Eliminar?','삭제할까요?'],'NAME:':['Name:','Nombre:','이름:'],'NOMBRE DE LA NUEVA PARTE:':['Name of the new section:','Nombre de la nueva parte:','새 구간 이름:'],'NOMBRE DE LA FORMACIÓN:':['Formation name:','Nombre de la formación:','포메이션 이름:'],'APODO DEL BAILARÍN SELECCIONADO:':['Nickname of selected dancer:','Apodo del bailarín seleccionado:','선택한 댄서 별명:'],'NOMBRE DEL BAILE:':['Dance name:','Nombre del baile:','안무 이름:']
  });
  Object.assign(translations,{
    'FORMATION 1':['Formation 1','Formación 1','포메이션 1'],
    '🏷 APODO':['🏷 Nickname','🏷 Apodo','🏷 별명'],
    '💾 GUARDAR BAILE':['💾 Save dance','💾 Guardar baile','💾 안무 저장'],
    '▣ MIS BAILES':['▣ My dances','▣ Mis bailes','▣ 내 안무'],
    '✦ PORTADA':['✦ Cover','✦ Portada','✦ 표지'],
    'CHOREOGRAPHY STUDIO':['Choreography studio','Estudio de coreografía','안무 스튜디오'],
    'KEYBOARD SHORTCUTS':['Keyboard shortcuts','Atajos del teclado','키보드 단축키'],
    'SECONDS (MILLISECONDS SUPPORTED)':['Seconds (milliseconds supported)','Segundos (se admiten milisegundos)','초 (밀리초 입력 가능)'],
    'GO TO TIME':['Go to time','Ir al momento','해당 시간으로 이동'],
    'SONG + DANCE':['Song + dance','Canción + baile','음악 + 안무'],
    'HAZ CLIC EN UN CUADRO PARA CENTRAR LA FORMACIÓN':['Click a square to center the formation','Haz clic en un cuadro para centrar la formación','칸을 클릭해 포메이션을 중앙에 배치하세요'],
    'FORMACIÓN CENTRADA EN EL CUADRO ELEGIDO':['Formation centered in the selected square','Formación centrada en el cuadro elegido','선택한 칸의 중앙에 포메이션을 배치했습니다'],
    'CTRL O SHIFT + CLIC: SELECCIONA VARIOS Y ARRASTRALOS JUNTOS':['Ctrl or Shift + click: select multiple dancers and drag them together','Ctrl o Shift + clic: selecciona varios y arrástralos juntos','Ctrl 또는 Shift + 클릭: 여러 명을 선택해 함께 드래그하세요'],
    'ARRASTRA EL PUNTO ● PARA DOBLAR LA LÍNEA':['Drag the ● point to bend the path','Arrastra el punto ● para doblar la línea','● 점을 드래그해 경로를 구부리세요'],
    'HAZ CLIC EN EL DESTINO DEL BAILARÍN':['Click the dancer destination','Haz clic en el destino del bailarín','댄서가 이동할 위치를 클릭하세요'],
    'LÍNEA CANCELADA':['Path cancelled','Línea cancelada','경로 취소됨'],
    'ORDEN DE REPRODUCCIÓN GUARDADO':['Playback order saved','Orden de reproducción guardado','재생 순서 저장됨'],
    '✓ ARCHIVO LISTO PARA COMPARTIR':['✓ File ready to share','✓ Archivo listo para compartir','✓ 공유할 파일이 준비되었습니다'],
    '✓ COREOGRAFÍA IMPORTADA':['✓ Choreography imported','✓ Coreografía importada','✓ 안무를 가져왔습니다'],
    'EL ARCHIVO NO ES UNA COREOGRAFÍA VÁLIDA':['This file is not a valid choreography','El archivo no es una coreografía válida','올바른 안무 파일이 아닙니다'],
    '✓ NOTAS GUARDADAS':['✓ Notes saved','✓ Notas guardadas','✓ 메모 저장됨'],
    '✓ PORTADA ACTUALIZADA':['✓ Cover updated','✓ Portada actualizada','✓ 표지가 업데이트되었습니다'],
    'USA “CANCIÓN + BAILE” Y LA TIMELINE PARA REPRODUCIR LA COREOGRAFÍA':['Use “Song + dance” and the timeline to play the choreography','Usa “Canción + baile” y la timeline para reproducir la coreografía','타임라인에서 “음악 + 안무”를 사용해 안무를 재생하세요']
  });
  Object.assign(translations,{
    'LÍNEA GUARDADA; ARRASTRA EL PUNTO NARANJA PARA CAMBIARLA':['Path saved; drag the orange point to change it','Línea guardada; arrastra el punto naranja para cambiarla','경로가 저장되었습니다. 주황색 점을 드래그해 수정하세요'],
    'RUTA GUARDADA PARA EL BAILARÍN SELECCIONADO':['Route saved for the selected dancer','Ruta guardada para el bailarín seleccionado','선택한 댄서의 경로가 저장되었습니다'],
    'LÍNEA GUARDADA':['Path saved','Línea guardada','경로가 저장되었습니다'],
    'RUTA CANCELADA':['Route cancelled','Ruta cancelada','경로가 취소되었습니다']
  });
  const indexFor={en:0,es:1,ko:2};
  const keyFor=text=>{const normalized=text.trim().replace(/\s+/g,' ').toUpperCase();return Object.keys(translations).find(key=>translations[key].some(value=>value.toUpperCase()===normalized))};
  const nativePrompt=window.prompt.bind(window),nativeConfirm=window.confirm.bind(window);
  const localizedDefaults=new Set(['Nueva formación','New formation','새 포메이션','Mi coreografía','My choreography','내 안무','Mi baile','My dance','내 춤']);
  window.prompt=(message='',defaultValue='')=>{const langIndex=indexFor[localStorage.getItem('fx-dance-language')]??0,key=keyFor(String(message)),defaultKey=localizedDefaults.has(String(defaultValue))?keyFor(String(defaultValue)):null;return nativePrompt(key?translations[key][langIndex]:message,defaultKey?translations[defaultKey][langIndex]:defaultValue)};
  window.confirm=message=>{const key=keyFor(String(message));return nativeConfirm(key?translations[key][indexFor[localStorage.getItem('fx-dance-language')]??0]:message)};
  function applyLanguage(language){
    const i=indexFor[language]??0;document.documentElement.lang=language;picker.value=language;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
    while((node=walker.nextNode())){const parent=node.parentElement;if(!parent||parent.closest('#welcomeGroupSelect,#languagePicker'))continue;const inFormations=parent.closest('#formations'),inSyncList=parent.closest('#simpleSyncList');if(inFormations&&!parent.matches('#formations > section > small')&&!parent.matches('#formations .formation span'))continue;if(inSyncList&&!parent.matches('#simpleSyncList small'))continue;let text=node.textContent,key=keyFor(text);if(parent.id==='status'){const patterns=[[/^(?:Guardado automáticamente|Saved automatically|자동 저장됨)(\s*[·•].*)?$/i,['Saved automatically','Guardado automáticamente','자동 저장됨']],[/^(?:✓\s*)?(?:Baile guardado|Dance saved|안무 저장됨):\s*(.*)$/i,['✓ Dance saved: ','✓ Baile guardado: ','✓ 안무 저장됨: ']],[/^(?:Baile abierto|Dance opened|안무 열기):\s*(.*)$/i,['Dance opened: ','Baile abierto: ','안무 열기: ']],[/^(?:Canción agregada|Song added|음악 추가됨):\s*(.*)$/i,['Song added: ','Canción agregada: ','음악 추가됨: ']],[/^(?:Reproduciendo|Playing|재생 중):\s*(.*)$/i,['Playing: ','Reproduciendo: ','재생 중: ']]];for(const[pattern,labels]of patterns){const match=text.trim().match(pattern);if(match){node.textContent=labels[i]+(match[1]||'');key=null;break}}}if(key&&node.textContent!==translations[key][i])node.textContent=translations[key][i]}
    document.querySelectorAll('input[placeholder]').forEach(input=>{const key=keyFor(input.placeholder);if(key&&input.placeholder!==translations[key][i])input.placeholder=translations[key][i];else if(['Buscar formación o canción','Search formation or song','포메이션 또는 노래 검색'].includes(input.placeholder))input.placeholder=['Search formation or song','Buscar formación o canción','포메이션 또는 노래 검색'][i]});
    const actionLabels={editNickname:['🏷 Nickname','🏷 Apodo','🏷 별명'],saveDance:['💾 Save dance','💾 Guardar baile','💾 안무 저장'],myDances:['▣ My dances','▣ Mis bailes','▣ 내 안무'],projectLook:['✦ Cover','✦ Portada','✦ 표지']};Object.entries(actionLabels).forEach(([id,labels])=>{const button=document.getElementById(id);if(button&&button.textContent!==labels[i])button.textContent=labels[i]});
    const projectName=document.querySelector('#projectName'),defaultName=projectName&&keyFor(projectName.value);if(defaultName){projectName.value=translations[defaultName][i];if(state&&keyFor(state.name)===defaultName)state.name=translations[defaultName][i]}
    const dancerLabels=['Dancer','Bailarín','댄서'];document.querySelectorAll('.dancer[title],#dancerList .dancerRow span').forEach(element=>{const match=element.title?.match(/^(?:Dancer|Bailarín|댄서)\s+(\d+)$/)||element.textContent.trim().match(/^(?:Dancer|Bailarín|댄서)\s+(\d+)$/);if(match){const label=dancerLabels[i]+' '+match[1];if(element.matches('.dancer[title]'))element.title=label;else element.textContent=label}});
    document.querySelectorAll('[title],[aria-label]').forEach(element=>['title','aria-label'].forEach(attribute=>{const value=element.getAttribute(attribute),key=value&&keyFor(value);if(key&&value!==translations[key][i])element.setAttribute(attribute,translations[key][i])}));
    localStorage.setItem('fx-dance-language',language);
  }
  picker.onchange=()=>applyLanguage(picker.value);
  window.applyFxDanceLanguage=applyLanguage;
  applyLanguage(localStorage.getItem('fx-dance-language')||'en');
},1700);

// Re-translate controls created later by the editor, sync panel, and modals.
setTimeout(()=>{
  const picker=$('#languagePicker');if(!picker||!window.applyFxDanceLanguage)return;
  let pending=false;
  const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;window.applyFxDanceLanguage(picker.value)})});
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
},1800);

// El idioma se configura desde Settings, no desde la barra principal.
setTimeout(()=>{
  const picker=$('#languagePicker'),settingsPanel=$('#modal>div');
  if(!picker||!settingsPanel)return;
  const languageLabel=document.createElement('label');languageLabel.id='languageSetting';languageLabel.textContent='Language';
  languageLabel.append(picker);
  settingsPanel.querySelector('h2')?.after(languageLabel);
},1800);

// Evitar desplazamiento horizontal; los controles se adaptan al ancho del panel.
setTimeout(()=>{
  const noSideScroll=document.createElement('style');
  noSideScroll.textContent=`
    html,body{max-width:100%;overflow-x:hidden!important}.app,.workspace,.panel,.center,#simpleSync{min-width:0!important;max-width:100%}
    #simpleSync .simple-sync-top{flex-wrap:wrap}.simple-sync-top select{min-width:120px!important}.simple-sync-row{min-width:0}.simple-sync-row select{width:0;min-width:0!important}
    @media(max-width:1050px){.workspace{grid-template-columns:minmax(0,1fr) 220px!important}.center>#choreoSync{min-width:0!important}}
    @media(max-width:760px){.simple-sync-top{display:grid!important;grid-template-columns:auto auto auto 1fr}.simple-sync-top b{min-width:0!important}.simple-sync-top select{width:100%;min-width:0!important}.simple-sync-row input{width:62px!important}}
  `;
  document.head.append(noSideScroll);
},1900);

// Ocultar las barras de desplazamiento visibles sin bloquear el scroll.
setTimeout(()=>{
  const hideScrollbars=document.createElement('style');
  hideScrollbars.textContent=`
    html,body,*{scrollbar-width:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar,*::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
  `;
  document.head.append(hideScrollbars);
},1910);

// Barra de acciones más clara y consistente.
setTimeout(()=>{
  const polishedToolbar=document.createElement('style');
  polishedToolbar.textContent=`
    .toolbar{padding:8px!important;gap:7px!important;background:linear-gradient(135deg,#171417,#252027)!important;border-color:#3a3037!important;box-shadow:0 5px 18px #0004!important}
    .toolbar>button{width:auto!important;min-width:76px!important;height:44px!important;padding:7px 10px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;border:1px solid #4b3c48!important;border-radius:9px!important;background:linear-gradient(145deg,#38313e,#2d2833)!important;color:#fff!important;font-size:10px!important;line-height:13px!important;white-space:nowrap!important;box-shadow:inset 0 1px #ffffff12,0 2px 5px #0005!important;transition:transform .14s ease,background .14s ease,border-color .14s ease!important}
    .toolbar>button:hover{transform:translateY(-1px)!important;background:linear-gradient(145deg,#514454,#392d3c)!important;border-color:#9d536e!important}.toolbar>button:active{transform:translateY(1px)!important}
    .toolbar>#undo,.toolbar>#redo{min-width:46px!important;font-size:16px!important}.toolbar>#addDancer{border-color:#7b454d!important;background:linear-gradient(145deg,#5b2932,#3b242c)!important}.toolbar>#deleteDancer{border-color:#744149!important;color:#ffc2c7!important}.toolbar>#saveDance{border-color:#76528b!important;background:linear-gradient(145deg,#4b355d,#322940)!important}.toolbar>#myDances{border-color:#4a617b!important}.toolbar>#settings{min-width:44px!important}
    @media(max-width:760px){.toolbar>button{min-width:68px!important;height:42px!important;padding:6px 8px!important}.toolbar>#undo,.toolbar>#redo{min-width:42px!important}}
  `;
  document.head.append(polishedToolbar);
},1920);

// Refinamiento visual general: estilo oscuro editorial con rojo vino.
setTimeout(()=>{
  const refinedStyle=document.createElement('style');
  refinedStyle.textContent=`
    :root{--wine:#8f2037;--wine-bright:#ed4056;--surface:#171417;--surface-2:#211a1e;--stroke:#493238;--soft-text:#cdbdc2}
    body{background:radial-gradient(900px 500px at 52% -8%,#40131d 0%,transparent 64%),#0d0c0d!important;color:#f7f0f2!important;letter-spacing:.05px}
    .app{max-width:1580px!important;padding:20px 28px!important}header{margin-bottom:18px!important}header b{font-size:18px!important;letter-spacing:1.4px!important;text-shadow:0 0 18px #e13b554d}header input{border-bottom-color:#71414c!important;color:#fff!important}
    .panel{background:linear-gradient(155deg,#211a1e,#161316)!important;border-color:#4d363d!important;border-radius:13px!important;box-shadow:0 12px 30px #0004!important}.panel>p{color:#f3b6bf!important}
    .workspace{gap:20px!important;margin-top:18px!important}.stageTop{color:#e9b6be!important}.stageTop b{font-weight:800!important}.stageTop button{border:1px solid #533840!important;background:#251d22!important}
    #viewport{background:radial-gradient(circle at center,#23161b,#100f10 70%)!important;border:1px solid #bb3145!important;border-radius:15px!important;box-shadow:0 0 0 1px #ff5b6814,inset 0 0 45px #000!important}.audience{color:#e8b5bd!important}
    .transform button,.formActions button{background:#30272e!important;border:1px solid #4c3941!important;border-radius:7px!important}.transform button:hover,.formActions button:hover{border-color:#b94a5a!important}
    #newFormation{background:linear-gradient(135deg,#4e3039,#332731)!important;border-color:#9a5e70!important;border-radius:9px!important}.distance-info{background:#241d23!important;border:1px solid #4a363e!important;color:#ffc3ca!important}
    select,input[type=number],input[type=text],textarea{background:#2b252d!important;border-color:#68404b!important;color:#fff!important;border-radius:7px!important}input[type=range]{accent-color:#e64055!important}
    .formation{transition:background .16s ease,color .16s ease!important}.formation:hover{background:#36242b!important;color:#fff!important}
    .dancer{box-shadow:0 0 0 3px #ffffff1c,0 4px 12px #000b!important}.dancer.selected{outline-color:#ffd2d7!important}
    #simpleSync,#movementControls{background:linear-gradient(145deg,#1e1519,#151214)!important;border:1px solid #58363f!important;border-radius:11px!important;padding:12px!important;box-shadow:0 8px 20px #0003!important}
    #simpleSync button,#movementControls button{border-radius:7px!important}.simple-sync-row{border:1px solid #3f2c32!important}.simple-sync-row:hover{border-color:#75404a!important}
    @media(max-width:760px){.app{padding:13px!important}.workspace{gap:12px!important}.panel{border-radius:11px!important}}
  `;
  document.head.append(refinedStyle);
},1930);

// Versión compacta del estilo refinado.
setTimeout(()=>{
  const compactStyle=document.createElement('style');
  compactStyle.textContent=`
    .app{max-width:1450px!important;padding:14px 18px!important}header{margin-bottom:11px!important}header b{font-size:16px!important}.workspace{gap:14px!important;margin-top:12px!important}.panel{border-radius:10px!important;padding:11px!important}.panel>p{margin:1px 0 7px!important}.toolbar{padding:7px!important;gap:5px!important}.toolbar>button{height:38px!important;min-width:66px!important;padding:5px 8px!important;font-size:9px!important}.toolbar>#undo,.toolbar>#redo{min-width:40px!important}.stageTop{padding:0 4px 5px!important}.audience{padding:6px!important}.transform{gap:4px!important}.transform button{padding:6px 8px!important;font-size:10px!important}.center>#choreoSync,#simpleSync,#movementControls{margin-top:9px!important;padding:9px!important;border-radius:8px!important}.formation{padding:5px 7px!important;min-height:26px!important}.formActions{margin-top:6px!important}.formActions button{padding:5px 3px!important}.simple-sync-row{padding:5px!important}#simpleSync button,#movementControls button{padding:6px!important}@media(max-width:760px){.app{padding:10px!important}.panel{padding:9px!important}}
  `;
  document.head.append(compactStyle);
},1940);

setTimeout(()=>$('#distanceInfo')?.remove(),1950);

// Backstage con apariencia de escenario profesional.
setTimeout(()=>{
  const backstageStyle=document.createElement('style');
  backstageStyle.textContent=`
    .stageTop{margin:0 0 7px!important;padding:8px 10px!important;border:1px solid #4d3038!important;border-radius:9px!important;background:linear-gradient(90deg,#21151a,#120f11)!important}.stageTop>b{display:flex!important;align-items:center;gap:7px;color:#ffb7c0!important;font-size:10px!important;letter-spacing:1.6px!important}.stageTop>b:before{content:'STAGE';font-size:8px;color:#792b3b;border:1px solid #6f2b39;border-radius:4px;padding:3px 4px;letter-spacing:1px}.stageTop span{padding:2px!important;border-radius:7px;background:#191316!important}
    #viewport{position:relative!important;background:radial-gradient(ellipse at 50% 45%,#24151a 0%,#0f0d0e 62%,#080809 100%)!important;border:1px solid #9b2a3b!important;box-shadow:0 0 0 1px #ff66731a,inset 0 0 85px #000!important}
    #viewport:before{content:'';position:absolute;inset:11px;border:1px solid #ffffff08;border-radius:9px;pointer-events:none;z-index:0}#stage{border:1px solid #652833!important;box-shadow:0 0 0 5px #080809,0 18px 46px #000b,inset 0 0 55px #000!important;background-color:#121113!important;background-image:linear-gradient(#3e373a 1px,transparent 1px),linear-gradient(90deg,#3e373a 1px,transparent 1px)!important}
    #stage:before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,#0004,transparent 16%,transparent 84%,#0004),linear-gradient(#0003,transparent 16%,transparent 84%,#0003);z-index:0}.midline,.cross,.center-mark,.stage-zones,.dancer{z-index:2!important}.stage-zones b{padding:3px 5px;border-radius:4px;background:#120e10c9;color:#ff7f91!important;font-weight:800!important;letter-spacing:1.5px!important}
    .audience{margin-top:7px!important;padding:8px!important;border-top:1px solid #5e2b35!important;border-radius:0 0 8px 8px!important;color:#ffb7c0!important;letter-spacing:2px!important}
  `;
  document.head.append(backstageStyle);
},1960);

// La cuadrícula ocupa todo el Backstage, no solo un cuadrado central.
setTimeout(()=>{
  const fullGrid=document.createElement('style');
  fullGrid.textContent=`
    #viewport{display:block!important;overflow:hidden!important}#stage{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;background-size:20px 20px!important;background-position:0 0!important}
    @media(min-width:761px){#viewport{height:min(78vh,720px)!important}}
  `;
  document.head.append(fullGrid);
},1970);

setTimeout(()=>{
  const compactBackstageHeader=document.createElement('style');
  compactBackstageHeader.textContent=`
    .stageTop{margin-bottom:5px!important;padding:5px 8px!important;border-radius:7px!important}.stageTop>b{font-size:9px!important;letter-spacing:1.2px!important}.stageTop>b:before{font-size:7px!important;padding:2px 3px!important}.stageTop span{transform:scale(.88);transform-origin:right center}
  `;
  document.head.append(compactBackstageHeader);
},1980);

// Encabezado de marca más pulido.
setTimeout(()=>{
  const headerStyle=document.createElement('style');
  headerStyle.textContent=`
    header{height:48px!important;padding:0 12px!important;border:1px solid #4b3038!important;border-radius:11px!important;background:linear-gradient(100deg,#211317,#160f12 58%,#110f10)!important;box-shadow:0 8px 22px #0005!important}
    header b{display:flex!important;align-items:center!important;gap:8px!important;color:#f04455!important;font-size:16px!important;letter-spacing:1.7px!important;white-space:nowrap}header b:before{content:'✦';display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:#7d2031;color:#ffd6da;font-size:11px;box-shadow:0 0 14px #df3b5055}header b small{margin:0!important;padding-left:8px!important;border-left:1px solid #71323e!important;color:#f4c6cc!important;font-size:8px!important;letter-spacing:2px!important}
    #projectName{width:min(290px,32vw)!important;padding:7px 12px!important;border:1px solid transparent!important;border-bottom-color:#8b3a4b!important;border-radius:7px 7px 2px 2px!important;background:linear-gradient(180deg,#ffffff08,transparent)!important;color:#fff!important;font-size:14px!important;font-weight:800!important;text-align:center!important;transition:border .15s ease,background .15s ease!important}#projectName:focus{border-color:#bd4557!important;background:#ffffff0b!important}
    #settings{width:32px!important;min-width:32px!important;height:32px!important;padding:0!important;border:1px solid #563840!important;border-radius:8px!important;background:#302933!important;font-size:13px!important}#settings:hover{background:#642838!important;border-color:#c24a5a!important}
    @media(max-width:650px){header{height:42px!important;padding:0 8px!important}header b{font-size:12px!important;letter-spacing:1px!important}header b:before{width:18px;height:18px}header b small{display:none}#projectName{width:130px!important;font-size:12px!important}}
  `;
  document.head.append(headerStyle);
},1990);

setTimeout(()=>{
  const tinyStageHeader=document.createElement('style');
  tinyStageHeader.textContent=`
    .stageTop{height:35px!important;margin-bottom:4px!important;padding:4px 8px!important;border-radius:7px!important}.stageTop>b{font-size:9px!important;gap:5px!important}.stageTop>b:before{font-size:7px!important;padding:2px!important;border-radius:3px!important}.stageTop span{transform:scale(.84)!important}
  `;
  document.head.append(tinyStageHeader);
},2000);

setTimeout(()=>{
  const brand=document.querySelector('header b');
  if(brand?.firstChild)brand.firstChild.textContent=brand.firstChild.textContent.replace(/^\s*[^A-Za-z0-9]+\s*/,'');
  const noBrandIcons=document.createElement('style');
  noBrandIcons.textContent='header b:before{display:none!important}header b{gap:0!important}';
  document.head.append(noBrandIcons);
},2010);

// Bailarines más claros: borde rojo vino y nombre completo al pasar el cursor.
setTimeout(()=>{
  const dancerPolish=document.createElement('style');
  dancerPolish.textContent=`
    .dancer{overflow:visible!important;border:2px solid #a93b4c!important;box-shadow:0 0 0 2px #1a1215,0 4px 10px #000b!important}.dancer.selected{border-color:#ffd2d7!important;box-shadow:0 0 0 3px #e84c5d66,0 4px 12px #000c!important}.dancer:hover:after{content:attr(title);position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);z-index:30;min-width:max-content;max-width:140px;padding:5px 7px;border:1px solid #86404b;border-radius:5px;background:#211419;color:#fff;font-size:10px;font-weight:700;line-height:1.1;white-space:nowrap;box-shadow:0 5px 12px #0009;pointer-events:none}.dancer:hover:before{content:'';position:absolute;left:50%;bottom:calc(100% + 3px);transform:translateX(-50%);border:4px solid transparent;border-top-color:#86404b;pointer-events:none;z-index:31}
  `;
  document.head.append(dancerPolish);
},2020);

// Retirar por completo la interfaz de sincronización, marcadores y timeline visual.
setTimeout(()=>{
  const panel=document.querySelector('.workspace>aside:first-child'),actions=$('.formActions'),song=$('#syncSongFile'),settings=$('#transitionSettings');
  if(panel&&actions&&song)actions.after(song);
  if(panel&&settings){
    const movement=document.createElement('section');movement.id='movementControls';movement.innerHTML='<small>MOVIMIENTO</small><div id="movementControlsBody"></div>';
    const body=movement.querySelector('#movementControlsBody');
    settings.querySelectorAll('#advanceButton,label').forEach(control=>body.append(control));
    (song||actions).after(movement);settings.remove();
  }
  $('#choreoSync')?.remove();
  $('#visualTimeline')?.remove();
  $('#openVisualTimeline')?.remove();
  document.querySelectorAll('.sync-formation').forEach(button=>button.remove());
  // Keep saved song markers when replacing the legacy sync panel.
  save();
  const removeSyncStyle=document.createElement('style');
  removeSyncStyle.textContent=`
    #movementControls{margin-top:10px;padding-top:9px;border-top:1px solid #4a3434}#movementControls small{color:#ffb2b2;font-size:9px;letter-spacing:1px}#movementControlsBody{display:flex;flex-direction:column;gap:8px;margin-top:7px}#movementControlsBody label{margin:0}#movementControlsBody #advanceButton{display:block!important;width:100%;margin:0}
  `;
  document.head.append(removeSyncStyle);
},1450);

// Let the user choose which dancer starts the staggered transition.
setTimeout(()=>{
  const body=$('#movementControlsBody'),delayLabel=$('#delay')?.closest('label');
  if(!body||!delayLabel||$('#delayFirstDancer'))return;
  const label=document.createElement('label');label.id='delayFirstLabel';
  const title=document.createElement('span');title.id='delayFirstTitle';
  const select=document.createElement('select');select.id='delayFirstDancer';
  label.append(title,select);delayLabel.after(label);
  const languageCopy={en:{title:'First dancer to move',dancer:'Dancer'},es:{title:'Bailarín que inicia',dancer:'Bailarín'},ko:{title:'먼저 움직일 댄서',dancer:'댄서'}};
  const update=()=>{
    const language=$('#languagePicker')?.value||localStorage.getItem('fx-dance-language')||'en',copy=languageCopy[language]||languageCopy.en;
    title.textContent=copy.title;
    const dancers=p(),stored=Number(localStorage.getItem('fx-dance-delay-first')||0),first=Math.max(0,Math.min(dancers.length-1,Number.isInteger(stored)?stored:0));
    select.replaceChildren(...dancers.map((dancer,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent=dancer[4]?.trim()||`${copy.dancer} ${index+1}`;return option}));
    select.value=String(first);window.fxDanceDelayStartIndex=first;
    if(String(first)!==localStorage.getItem('fx-dance-delay-first'))localStorage.setItem('fx-dance-delay-first',String(first));
  };
  select.onchange=()=>{const first=Number(select.value);window.fxDanceDelayStartIndex=first;localStorage.setItem('fx-dance-delay-first',String(first))};
  $('#languagePicker')?.addEventListener('change',update);
  new MutationObserver(update).observe($('#stage'),{childList:true});
  update();
  const style=document.createElement('style');style.textContent='#delayFirstLabel{display:grid;gap:6px;margin:0!important;color:#d9cacc;font-size:10px!important}#delayFirstDancer{width:100%;padding:7px 8px;border:1px solid #54363d;border-radius:7px;background:#282024;color:#fff;font-size:11px}';document.head.append(style);
},1550);

// Sincronización simple: una lista de segundos vinculados a formaciones.
setTimeout(()=>{
  const panel=document.querySelector('.workspace>aside:first-child'),song=$('#syncSongFile'),movement=$('#movementControls');
  if(!panel||!song)return;
  const simple=document.createElement('section');simple.id='simpleSync';
  simple.innerHTML='<small>FORMATIONS WITH SONG</small><div class="simple-sync-top"><button id="simpleRewind" title="Back 5 seconds">↶ 5s</button><button id="simpleForward" title="Forward 5 seconds">5s ↷</button><button id="simplePlayPause">▶ Play</button><b id="simpleSyncTime">0:00</b><select id="simpleSyncFormation"></select></div><p id="activeSyncFormation">Active formation: —</p><button id="linkFormationTime">＋ Link to current time</button><button id="clearAllSync">Clear all sync links</button><div id="simpleSyncList"></div><div id="syncEngine" aria-hidden="true"><button id="syncAudioPlay"></button><i id="syncPlayhead"></i><output id="syncClock">0:00</output><select id="syncMotion"><option value="500">500</option></select><select id="syncEase"><option value="easeInOut">easeInOut</option></select><div id="syncTimeline"></div><div id="syncMarkers"></div></div>';
  song.after(simple);if(movement)simple.after(movement);
  const toggle=document.createElement('button');toggle.id='toggleSimpleSync';toggle.textContent='▾ Ocultar sincronizaciones';simple.querySelector('small').after(toggle);
  const simpleStyle=document.createElement('style');simpleStyle.textContent=`
    #simpleSync{margin-top:10px;padding-top:10px;border-top:1px solid #503535}#simpleSync>small{display:block;color:#ffb3b3;letter-spacing:1px;font-size:9px;margin-bottom:7px}#toggleSimpleSync{width:100%;margin:0 0 7px;padding:6px;background:#33262a;color:#ffd0d0;font-size:10px}.simple-sync-top{display:flex;gap:6px;align-items:center}.simple-sync-top b{min-width:68px;color:#ff7777;font-size:12px;font-variant-numeric:tabular-nums}.simple-sync-top select{flex:1;min-width:0;background:#33262a;color:#fff;border:1px solid #744047;border-radius:5px;padding:7px}#simplePlayPause,#simpleRewind,#simpleForward{padding:7px 8px;background:#8f2734;color:#fff;white-space:nowrap}#simpleRewind,#simpleForward{background:#3c2b30}#activeSyncFormation{display:none!important;margin:8px 0 0;padding:7px 8px;border-left:3px solid #e14b55;background:#311d21;color:#ffd1d1;font-size:11px;font-weight:700}#linkFormationTime{width:100%;margin-top:7px;background:#57232a;border:1px solid #a24b52}#clearAllSync{width:100%;margin-top:6px;background:transparent;color:#ffaeae;border:1px solid #6b3539;font-size:10px}#simpleSyncList{display:grid;gap:5px;margin-top:8px}.simple-sync-row{display:flex;gap:5px;align-items:center;background:#271c1f;padding:6px;border-radius:5px}.simple-sync-row input{width:70px;background:#211719;color:#ffb0b0;border:1px solid #704047;border-radius:4px;padding:5px;font-size:11px;font-variant-numeric:tabular-nums}.simple-sync-row select{flex:1;min-width:0;background:#33262a;color:#fff;border:1px solid #704047;border-radius:4px;padding:5px}.simple-sync-row button{padding:4px 7px;background:#3b2428}.simple-sync-row button:last-child{color:#ff9a9a}#syncEngine{display:none!important}#simpleSync.collapsed>.simple-sync-top,#simpleSync.collapsed>#activeSyncFormation,#simpleSync.collapsed>#linkFormationTime,#simpleSync.collapsed>#clearAllSync,#simpleSync.collapsed>#simpleSyncList{display:none!important}
  `;document.head.append(simpleStyle);
  simpleStyle.textContent+=`.workspace>aside:first-child{box-sizing:border-box!important;padding:12px!important;background:linear-gradient(145deg,#251719,#171112)!important;border:1px solid #6e343c!important;border-radius:12px!important}@media(min-width:761px){#formations{max-height:min(38vh,330px)!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#8d343f transparent}#formations::-webkit-scrollbar{width:5px}#formations::-webkit-scrollbar-thumb{background:#8d343f;border-radius:5px}}#simpleSync{margin-top:10px!important;padding:10px 0 0!important;background:transparent!important;border:0!important;border-top:1px solid #503535!important;border-radius:0!important}#simpleSync>small{color:#ff7f91!important;letter-spacing:1.4px!important}`;
  $('#toggleSimpleSync').onclick=()=>{let hidden=simple.classList.toggle('collapsed');$('#toggleSimpleSync').textContent=hidden?'▸ Mostrar sincronizaciones':'▾ Ocultar sincronizaciones'};
  const ensure=()=>{const used=new Set();state.formations.forEach((form,index)=>{if(!form.id||used.has(form.id))form.id=`formation-${Date.now().toString(36)}-${index}-${Math.random().toString(36).slice(2,7)}`;used.add(form.id)});state.audioMarkers=(state.audioMarkers||[]).filter(marker=>state.formations.some(form=>form.id===marker.formationId)).sort((a,b)=>a.time-b.time)};
  const clock=time=>{time=Math.max(0,+time||0);const minutes=Math.floor(time/60),seconds=Math.floor(time%60),milliseconds=Math.round((time-Math.floor(time))*1000);return minutes+':'+String(seconds).padStart(2,'0')+'.'+String(milliseconds).padStart(3,'0')};
  const options=selected=>state.formations.map(form=>`<option value="${form.id}" ${form.id===selected?'selected':''}>${form.name}</option>`).join('');
  let chosenFormationId='';
  const draw=()=>{ensure();if(!state.formations.some(form=>form.id===chosenFormationId))chosenFormationId=state.formations[state.current]?.id||state.formations[0]?.id||'';$('#simpleSyncFormation').innerHTML=options(chosenFormationId);$('#simpleSyncFormation').onchange=e=>{chosenFormationId=e.target.value};$('#simpleSyncList').innerHTML=state.audioMarkers.length?state.audioMarkers.map(marker=>`<div class="simple-sync-row"><input type="number" min="0" step="0.001" value="${(+marker.time).toFixed(3)}" data-simple-time="${marker.id}" title="Seconds (milliseconds supported)"><select data-simple-marker="${marker.id}">${options(marker.formationId)}</select><button data-simple-go="${marker.id}" title="Go to time">⌖</button><button data-simple-delete="${marker.id}" title="Delete">×</button></div>`).join(''):'<small style="color:#ae9999">No linked formations yet.</small>';document.querySelectorAll('[data-simple-time]').forEach(input=>input.onchange=()=>{let marker=state.audioMarkers.find(x=>x.id===input.dataset.simpleTime),max=audio.duration||Infinity,value=Math.max(0,Math.min(max,+input.value));if(marker&&Number.isFinite(value)){marker.time=Math.round(value*1000)/1000;state.audioMarkers.sort((a,b)=>a.time-b.time);save();draw()}});document.querySelectorAll('[data-simple-marker]').forEach(select=>select.onchange=()=>{let marker=state.audioMarkers.find(x=>x.id===select.dataset.simpleMarker);if(marker){marker.formationId=select.value;save();draw()}});document.querySelectorAll('[data-simple-go]').forEach(button=>button.onclick=()=>{let marker=state.audioMarkers.find(x=>x.id===button.dataset.simpleGo);if(marker)audio.currentTime=marker.time});document.querySelectorAll('[data-simple-delete]').forEach(button=>button.onclick=()=>{state.audioMarkers=state.audioMarkers.filter(x=>x.id!==button.dataset.simpleDelete);save();draw()})};
  $('#linkFormationTime').onclick=()=>{if(!audio.src){$('#status').textContent='Load an MP3 song first';return}ensure();let formationId=chosenFormationId||$('#simpleSyncFormation').value;state.audioMarkers.push({id:`marker-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,time:Math.round(audio.currentTime*1000)/1000,formationId});state.audioMarkers.sort((a,b)=>a.time-b.time);save();draw();$('#status').textContent='✓ Formation linked to '+clock(audio.currentTime)};
   $('#simpleRewind').onclick=()=>{if(!audio.src){$('#status').textContent='Load an MP3 song first';return}audio.currentTime=Math.max(0,audio.currentTime-5)};
  $('#simpleForward').onclick=()=>{if(!audio.src){$('#status').textContent='Load an MP3 song first';return}audio.currentTime=Math.min(audio.duration||Infinity,audio.currentTime+5)};
  $('#clearAllSync').onclick=()=>{if(!state.audioMarkers?.length)return;if(!confirm('Clear all sync links?'))return;state.audioMarkers=[];save();draw();$('#activeSyncFormation').textContent='Active formation: —'};
   $('#simplePlayPause').onclick=()=>{if(!audio.src){$('#status').textContent='Load an MP3 song first';return}if(audio.paused)audio.play().catch(()=>{});else audio.pause()};
   audio.addEventListener('play',()=>$('#simplePlayPause').textContent='❚❚ Pause');audio.addEventListener('pause',()=>$('#simplePlayPause').textContent='▶ Play');audio.addEventListener('ended',()=>$('#simplePlayPause').textContent='▶ Play');
  const syncMovementDuration=()=>{const motion=$('#syncMotion'),milliseconds=Math.max(1,Math.round((+$('#duration').value||1)*1000/(+$('#speed').value||1)));if(![...motion.options].some(option=>+option.value===milliseconds)){const option=document.createElement('option');option.value=milliseconds;option.textContent=milliseconds;motion.append(option)}motion.value=milliseconds};
  $('#duration').addEventListener('input',syncMovementDuration);$('#speed').addEventListener('change',syncMovementDuration);syncMovementDuration();
  const applyAtTime=()=>{ensure();$('#simpleSyncTime').textContent=clock(audio.currentTime);let active=null;state.audioMarkers.forEach(marker=>{if(marker.time<=audio.currentTime+.001)active=marker});if(!active){$('#activeSyncFormation').textContent='Active formation: —';return}let index=state.formations.findIndex(form=>form.id===active.formationId);if(index>=0){$('#activeSyncFormation').textContent='Active formation: '+state.formations[index].name;if(state.current!==index){state.current=index;selected=0;render();draw()}}};
  audio.addEventListener('timeupdate',applyAtTime);audio.addEventListener('seeked',applyAtTime);audio.addEventListener('loadedmetadata',()=>{draw();applyAtTime()});
  new MutationObserver(draw).observe($('#formations'),{childList:true,subtree:true});ensure();draw();
},1500);


// Interfaz compacta: conserva funciones, pero muestra primero las acciones de uso diario.
setTimeout(()=>{
  const compactStyle=document.createElement('style');
  compactStyle.textContent=`
    .toolbar{gap:6px}.toolbar>details.tool-menu{position:relative;flex:none}.toolbar>details.tool-menu>summary{list-style:none;cursor:pointer;user-select:none;background:#312a32;color:#fff;border-radius:7px;padding:8px 10px;font-weight:700;font-size:10px;white-space:nowrap}.toolbar>details.tool-menu>summary::-webkit-details-marker{display:none}.toolbar>details.tool-menu[open]>summary{background:#642133}.tool-menu-body{position:absolute;right:0;top:calc(100% + 6px);z-index:80;display:grid;gap:5px;min-width:150px;padding:8px;background:#21191c;border:1px solid #743743;border-radius:9px;box-shadow:0 12px 28px #000a}.tool-menu-body button{width:auto!important;min-width:130px!important;height:auto!important;padding:8px 10px!important;text-align:left;white-space:normal}.tool-menu-body button:hover{background:#612438}.sync-advanced{margin-top:8px}.sync-advanced summary{cursor:pointer;color:#ffb6b6;font-size:10px;padding:5px 0}.sync-advanced #syncMarkers{margin-bottom:3px}.controls #choreoSync{background:#1d1515;border-radius:8px;padding:10px;margin-left:-3px;margin-right:-3px}
  `;
  document.head.append(compactStyle);
  const toolbar=document.querySelector('.toolbar');
  function menu(label,ids){
    const items=ids.map(id=>document.getElementById(id)).filter(Boolean);if(!items.length)return;
    const details=document.createElement('details');details.className='tool-menu';details.innerHTML=`<summary>${label}</summary><div class="tool-menu-body"></div>`;const body=details.querySelector('.tool-menu-body');items.forEach(item=>body.append(item));toolbar.append(details);
  }
  // Copiar, nombres y biblioteca pasan a menús; las acciones de bailarines quedan visibles.
  menu('Edición',['undo','redo','copy','paste','editNickname','showNames']);
  menu('Proyecto',['saveDance','myDances','exportProject','importProject','formationNotes','projectLook']);
  document.querySelectorAll('details.tool-menu').forEach(current=>current.addEventListener('toggle',()=>{
    if(!current.open)return;
    document.querySelectorAll('details.tool-menu').forEach(other=>{if(other!==current)other.open=false});
  }));
  document.querySelectorAll('.toolbar .library-tools').forEach(group=>{if(!group.children.length)group.remove()});
  const syncPanel=$('#choreoSync');
  if(syncPanel&&!syncPanel.querySelector('.sync-advanced')){
    const advanced=document.createElement('details');advanced.className='sync-advanced';advanced.innerHTML='<summary>Opciones de transición y marcadores</summary>';
    ['syncMotion','syncEase','syncMarkers'].forEach(id=>{const element=$('#'+id);if(!element)return;let holder=element.closest('label')||element;advanced.append(holder)});
    syncPanel.append(advanced);
  }
},650);

// Vista móvil inspirada en una app: escenario protagonista y formaciones como pestañas.
setTimeout(()=>{
  const appViewStyle=document.createElement('style');
  appViewStyle.textContent=`
    @media(max-width:760px){
      body{background:#211f25}.app{padding:10px 12px 94px;max-width:520px}header{height:34px;margin:0 5px 8px}header b{font-size:13px}header input{font-size:14px;width:150px}.toolbar{position:fixed;z-index:70;left:0;right:0;bottom:0;border-radius:18px 18px 0 0;padding:8px 12px;background:#292630eF;box-shadow:0 -8px 28px #0009;justify-content:flex-start;gap:7px}.toolbar>button{display:none}.toolbar>button#addDancer,.toolbar>button#deleteDancer,.toolbar>button#color{display:block;width:62px;min-width:62px;height:46px;border-radius:12px;font-size:9px}.toolbar>details.tool-menu>summary{height:46px;display:grid;place-items:center;border-radius:12px;font-size:9px;padding:5px 8px}.toolbar>details.tool-menu:first-of-type{margin-left:auto}.toolbar .tool-menu-body{position:fixed;left:12px;right:12px;top:auto;bottom:64px;grid-template-columns:1fr 1fr;max-height:55vh;overflow:auto}.toolbar .tool-menu-body button{min-width:0!important;text-align:center}.workspace{display:flex;flex-direction:column;gap:9px;margin-top:5px}.center{order:1}.workspace>aside:first-child{order:2}.controls{order:3}.stageTop{padding:4px 5px 7px}.stageTop b{font-size:9px}.audience{padding:8px;font-size:9px}#viewport{height:min(58vh,510px);border-radius:12px}#stage{width:min(100vw - 30px,620px)!important;height:min(100vw - 30px,620px)!important}.transform{display:none}.workspace>aside:first-child{padding:0;background:transparent;border:0;overflow:visible}.workspace>aside:first-child>p,#toggleFormations,#partTools{display:none!important}#formations{display:flex;gap:8px;overflow-x:auto;padding:3px 0 8px;scrollbar-width:none}#formations::-webkit-scrollbar{display:none}#formations section{display:contents!important}#formations section>small{display:none!important}.formation{flex:0 0 126px;width:126px!important;margin:0!important;padding:10px!important;border-radius:19px!important;text-align:center!important;background:#382333!important;color:#d6bac4!important}.formation.active{background:linear-gradient(90deg,#d91e4d,#a9183b)!important;color:#fff!important}.panel>#newFormation{display:none}.formActions{display:none}.controls{padding:10px 12px;border-radius:13px}.controls>p:first-child,.controls>.next,.controls>label:not(.check),.controls>#play,.controls>#advanceButton,.controls>.timer,.controls>#status,.controls>.music-file{display:none}.controls .music{padding:6px 0}.controls #choreoSync{margin:6px 0 0}.controls #choreoSync h3{font-size:9px}.sync-marker-row{font-size:10px}.distance-info{display:none}
    }
  `;
  document.head.append(appViewStyle);
},700);

// La timeline sincronizada reemplaza los controles antiguos de transición.
setTimeout(()=>{
  const cleanControls=document.createElement('style');
  cleanControls.textContent=`
    #play,#advanceButton,
    label:has(#snapGrid),label:has(#sequenceSteps),label:has(#bpm),
    #bpmValue{display:none!important}
  `;
  document.head.append(cleanControls);
  ['snapGrid','sequenceSteps','bpm'].forEach(id=>{
    const control=$('#'+id);if(control)control.closest('label')?.setAttribute('aria-hidden','true');
  });
  $('#status').textContent='Usa “Canción + baile” y la timeline para reproducir la coreografía';
},750);

// Posición de controles tipo app: accesos rápidos, pestañas de formación y barra inferior.
setTimeout(()=>{
  const quick=document.createElement('div');
  quick.id='appQuickControls';
  quick.innerHTML='<span><button id="quickUndo" title="Deshacer">↶</button><button id="quickRedo" title="Rehacer">↷</button></span><button id="quickMusic" title="Canción + baile">♫</button>';
  document.querySelector('.audience').after(quick);
  $('#quickUndo').onclick=()=>$('#undo').click();
  $('#quickRedo').onclick=()=>$('#redo').click();
  $('#quickMusic').onclick=()=>$('#syncAudioPlay').click();
  const positionStyle=document.createElement('style');
  positionStyle.textContent=`
    #appQuickControls{display:none}
    @media(max-width:760px){
      #appQuickControls{display:flex;align-items:center;justify-content:space-between;margin:18px 12px 8px}#appQuickControls span{display:flex;gap:4px;padding:4px;background:#393640;border-radius:12px}#appQuickControls button{min-width:31px;height:31px;padding:0;border-radius:9px;background:transparent;color:#fff;font-size:18px}#appQuickControls #quickMusic{width:48px;height:48px;border-radius:50%;background:#d91e4d;font-size:20px;box-shadow:0 4px 14px #0008}
      .toolbar{height:78px;display:flex;align-items:stretch;justify-content:space-between;padding:8px 10px}.toolbar>button#addDancer,.toolbar>button#deleteDancer,.toolbar>button#color,.toolbar>details.tool-menu{flex:1;min-width:0!important;width:auto!important;height:auto!important}.toolbar>button#addDancer,.toolbar>button#deleteDancer,.toolbar>button#color{height:auto!important;padding:5px 3px!important;border-radius:12px;white-space:normal}.toolbar>details.tool-menu>summary{height:100%;min-height:0;white-space:normal;text-align:center;line-height:12px}.toolbar>details.tool-menu:first-of-type{margin-left:0}.controls #syncAudioPlay,.controls #syncClock{display:none}.controls #choreoSync{margin-top:0}.sync-row:has(#syncAudioPlay){display:none}
    }
  `;
  document.head.append(positionStyle);
},800);

// Los menús inferiores se muestran por delante de la barra, nunca detrás.
setTimeout(()=>{
  const menuLayer=document.createElement('style');
  menuLayer.textContent=`@media(max-width:760px){.toolbar{z-index:200!important;overflow:visible!important;isolation:isolate}.toolbar .tool-menu-body{position:fixed!important;left:12px!important;right:12px!important;top:auto!important;bottom:86px!important;z-index:260!important;display:grid!important;grid-template-columns:1fr 1fr!important;max-height:55vh!important;overflow:auto!important;padding:8px!important;box-shadow:0 10px 30px #000d}.toolbar .tool-menu-body button{min-width:0!important;white-space:normal!important}.toolbar>details.tool-menu[open]>summary{position:relative;z-index:261}}`;
  document.head.append(menuLayer);
},850);

// Restaurar la barra de botones original, sin menús agrupados.
setTimeout(()=>{
  const toolbar=$('.toolbar');
  ['undo','redo','addDancer','deleteDancer','color','copy','paste','editNickname','showNames','saveDance','myDances','exportProject','importProject','formationNotes','projectLook']
    .map(id=>$('#'+id)).filter(Boolean).forEach(button=>toolbar.append(button));
  toolbar.querySelectorAll('details.tool-menu').forEach(menu=>menu.remove());
  $('#appQuickControls')?.remove();
  const originalToolbar=document.createElement('style');
  originalToolbar.textContent=`
    @media(max-width:760px){
      .app{padding-bottom:12px}.toolbar{position:static!important;height:auto!important;min-height:0!important;overflow-x:auto!important;justify-content:flex-start!important;padding:10px!important;border-radius:10px!important;box-shadow:none!important}.toolbar>button{display:block!important;flex:0 0 auto!important;width:60px!important;min-width:60px!important;height:40px!important;padding:3px!important;border-radius:7px!important;font-size:10px!important}.toolbar>details.tool-menu{display:none!important}
    }
  `;
  document.head.append(originalToolbar);
},900);

// Se retira la interfaz de notas sin alterar los proyectos ya guardados.
setTimeout(()=>{
  $('#formationNotes')?.remove();
  $('#notesModal')?.remove();
},950);

// Panel de sincronización más grande y fácil de usar.
setTimeout(()=>{
  const syncLarge=document.createElement('style');
  syncLarge.textContent=`
    #choreoSync{padding:14px!important;margin-top:14px!important;border:1px solid #6e343c!important;border-radius:12px!important;background:linear-gradient(145deg,#251719,#171112)!important;font-size:12px!important}
    #choreoSync h3{font-size:12px!important;letter-spacing:1.5px!important;margin-bottom:12px!important}
    #syncTimeline{height:76px!important;margin:12px 0 9px!important;border-radius:10px!important}
    .sync-marker{top:14px!important;padding:7px 8px!important;font-size:11px!important;border-radius:7px!important}.sync-marker small{font-size:9px!important;margin-top:2px!important}
    #syncPlayhead{width:3px!important}.sync-row{gap:8px!important;margin:9px 0!important}.sync-row button,#addMarker{padding:9px!important;font-size:11px!important}
    #syncClock{font-size:13px!important;font-weight:700!important;color:#fff!important}.sync-advanced summary{font-size:11px!important;padding:8px 0!important}.sync-marker-row{padding:8px!important;font-size:11px!important}.sync-marker-row b{width:47px!important}
    @media(max-width:760px){.controls #choreoSync{padding:13px!important;margin:10px -2px 0!important}.controls #choreoSync h3{font-size:11px!important}.controls #syncTimeline{height:72px!important}.controls .sync-marker{padding:6px 7px!important}}
  `;
  document.head.append(syncLarge);
},970);

setTimeout(()=>{
  const restoreAdvance=document.createElement('style');
  restoreAdvance.textContent='#transitionSettings #advanceButton{display:block!important}';
  document.head.append(restoreAdvance);
},980);

// Editor visual de timeline: miniaturas de formaciones conectadas a los marcadores de música.
setTimeout(()=>{
  const visualStyle=document.createElement('style');
  visualStyle.textContent=`
    #openVisualTimeline{width:100%;margin-top:10px;padding:9px;border:1px solid #b4454b;background:#3a2023;color:#fff;border-radius:8px;font-weight:700;cursor:pointer}
    #visualTimeline{display:none;position:fixed;inset:0;z-index:400;background:#121212;color:#fff;overflow:auto;padding:28px 32px}#visualTimeline.open{display:block}
    .vt-head{display:flex;align-items:center;gap:12px;position:sticky;top:-28px;z-index:5;background:#121212;padding:12px 0 18px}.vt-head h2{margin:0;font-size:19px;color:#ff6868}.vt-head span{color:#aaa;font-size:12px}.vt-head button{margin-left:auto;padding:9px 13px}
    #vtCanvas{position:relative;min-width:1040px;height:690px;margin:6px auto 20px;max-width:1900px}.vt-wave{position:absolute;left:0;right:0;top:300px;height:170px;background:linear-gradient(#303030cc,#303030cc),repeating-linear-gradient(94deg,transparent 0 6px,#777 7px 9px,transparent 10px 15px),linear-gradient(#141414,#242424);border-radius:4px;overflow:hidden}.vt-wave:after{content:'';position:absolute;inset:20px 0;background:repeating-linear-gradient(90deg,transparent 0 10px,#888 12px 14px,transparent 16px 24px);opacity:.6;clip-path:polygon(0 47%,2% 20%,4% 72%,6% 28%,8% 60%,10% 12%,12% 85%,14% 35%,16% 70%,18% 19%,20% 65%,22% 29%,24% 75%,26% 20%,28% 62%,30% 6%,32% 80%,34% 42%,36% 68%,38% 27%,40% 79%,42% 22%,44% 55%,46% 11%,48% 74%,50% 30%,52% 82%,54% 18%,56% 60%,58% 9%,60% 77%,62% 37%,64% 65%,66% 20%,68% 72%,70% 26%,72% 88%,74% 31%,76% 65%,78% 8%,80% 74%,82% 39%,84% 68%,86% 21%,88% 78%,90% 32%,92% 63%,94% 13%,96% 75%,98% 28%,100% 52%,100% 100%,0 100%)}
    .vt-card{position:absolute;width:188px;height:142px;border:2px solid #f14c4c;border-radius:10px;background-color:#242538;background-image:linear-gradient(#4b4b5a 1px,transparent 1px),linear-gradient(90deg,#4b4b5a 1px,transparent 1px);background-size:25px 25px;box-shadow:0 7px 18px #0008;overflow:hidden;cursor:pointer}.vt-card.active{box-shadow:0 0 0 3px #ff8585,0 8px 20px #000}.vt-card:after{content:attr(data-name);position:absolute;left:7px;bottom:5px;font-size:10px;font-weight:bold;background:#181820cc;padding:3px 5px;border-radius:4px}.vt-dot{position:absolute;width:16px;height:16px;border-radius:50%;transform:translate(-50%,-50%);background:#7b1e3a;border:2px solid #fff8}.vt-stem{position:absolute;width:2px;background:#ddd;transform:translateX(-50%);z-index:2}.vt-stem:after{content:'';position:absolute;left:50%;bottom:-5px;width:8px;height:8px;background:#fff;border-radius:50%;transform:translateX(-50%)}.vt-tag{position:absolute;z-index:4;top:289px;transform:translate(-50%,-100%);border:0;border-radius:7px;background:#fb4c4c;color:#fff;padding:8px 10px;font-weight:800;font-size:13px;cursor:grab;box-shadow:0 4px 10px #0009}.vt-tag small{display:block;font-size:9px;opacity:.85;margin-top:2px}.vt-tag.active{background:#ff6c6c;box-shadow:0 0 0 2px #fff7,0 4px 12px #000}.vt-play{position:absolute;z-index:3;top:270px;bottom:190px;width:3px;background:#fff;box-shadow:0 0 7px #fff;pointer-events:none}.vt-play:before{content:'▼';position:absolute;top:-16px;left:-5px;color:#fff;font-size:13px}.vt-help{text-align:center;color:#aaa;font-size:12px}.vt-empty{position:absolute;top:340px;left:0;right:0;text-align:center;color:#aaa;font-size:14px}
    @media(max-width:760px){#visualTimeline{padding:18px 14px}.vt-head{top:-18px}.vt-head h2{font-size:16px}#vtCanvas{transform-origin:top left;transform:scale(.72);margin-bottom:-175px}.vt-help{text-align:left;margin-top:5px}}
  `;
  document.head.append(visualStyle);
  const open=document.createElement('button');open.id='openVisualTimeline';open.textContent='▣ Abrir timeline visual';$('#choreoSync').append(open);
  const visual=document.createElement('section');visual.id='visualTimeline';visual.innerHTML='<header class="vt-head"><h2>Timeline de coreografía</h2><span>Arrastra los marcadores para ajustar el tiempo.</span><button id="closeVisualTimeline">Cerrar ×</button></header><div id="vtCanvas"><div class="vt-wave"></div><i class="vt-play"></i></div><p class="vt-help">Cada tarjeta representa una formación. Haz clic para ir a ella; arrastra su marcador rojo para cambiar el momento de la canción.</p>';document.body.append(visual);
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getDur=()=>Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:100;
  const getFormation=id=>state.formations.findIndex(f=>f.id===id);
  const ensure=()=>{state.formations.forEach((f,i)=>{if(!f.id)f.id='f'+i+'-'+Math.random().toString(36).slice(2,7)});state.audioMarkers=(state.audioMarkers||[]).filter(m=>getFormation(m.formationId)>=0).sort((a,b)=>a.time-b.time)};
  function thumbnail(form,top,left,index){const card=document.createElement('article');card.className='vt-card '+(index===state.current?'active':'');card.style.left=`calc(${left}% - 94px)`;card.style.top=top+'px';card.dataset.name=form.name;form.positions.forEach((d,i)=>{const dot=document.createElement('i');dot.className='vt-dot';dot.style.left=d[0]+'%';dot.style.top=d[1]+'%';dot.style.background=d[2]||'#ff3b57';dot.textContent='';card.append(dot)});card.onclick=()=>{state.current=index;selected=0;render();drawVisual()};return card}
  function drawVisual(){ensure();const canvas=$('#vtCanvas');canvas.querySelectorAll('.vt-card,.vt-stem,.vt-tag,.vt-empty').forEach(x=>x.remove());const d=getDur(),markers=state.audioMarkers||[];$('.vt-play').style.left=(audio.currentTime/d*100)+'%';if(!markers.length){const empty=document.createElement('p');empty.className='vt-empty';empty.textContent='Crea marcadores desde “Marcador en tiempo actual” para ver aquí las formaciones sincronizadas.';canvas.append(empty);return}markers.forEach((marker,order)=>{const idx=getFormation(marker.formationId),form=state.formations[idx];if(idx<0)return;const x=Math.max(3,Math.min(97,marker.time/d*100)),top=order%2?495:70,stem=document.createElement('i');stem.className='vt-stem';stem.style.left=x+'%';stem.style.top=top+142+'px';stem.style.height=(300-(top+142))+'px';canvas.append(stem);canvas.append(thumbnail(form,top,x,idx));const tag=document.createElement('button');tag.className='vt-tag '+(idx===state.current?'active':'');tag.style.left=x+'%';tag.dataset.id=marker.id;tag.innerHTML=`${Math.floor(marker.time/60)+':'+String(Math.floor(marker.time%60)).padStart(2,'0')}<small>${esc(form.name)}</small>`;tag.onclick=()=>{audio.currentTime=marker.time;state.current=idx;render();drawVisual()};tag.onpointerdown=e=>{e.preventDefault();e.stopPropagation();tag.setPointerCapture(e.pointerId);const move=q=>{const rect=canvas.getBoundingClientRect();marker.time=Math.round(Math.max(0,Math.min(d,(q.clientX-rect.left)/rect.width*d))*100)/100;tag.style.left=(marker.time/d*100)+'%'};const done=()=>{tag.removeEventListener('pointermove',move);tag.removeEventListener('pointerup',done);tag.removeEventListener('pointercancel',done);state.audioMarkers.sort((a,b)=>a.time-b.time);save();audio.dispatchEvent(new Event('timeupdate'));drawVisual()};tag.addEventListener('pointermove',move);tag.addEventListener('pointerup',done);tag.addEventListener('pointercancel',done)};canvas.append(tag)});}
  visualStyle.textContent+='.vt-delete{position:absolute;z-index:6;top:287px;transform:translate(-50%,-100%);width:22px;height:22px;padding:0;border-radius:50%;background:#351417;color:#fff;border:1px solid #ff7474;cursor:pointer;font-weight:bold;font-size:15px}';
  const baseDrawVisual=drawVisual;
  drawVisual=function(){
    $('#vtCanvas').querySelectorAll('.vt-delete').forEach(x=>x.remove());
    baseDrawVisual();
    const d=getDur();
    (state.audioMarkers||[]).forEach(marker=>{
      if(getFormation(marker.formationId)<0)return;
      const x=Math.max(3,Math.min(97,marker.time/d*100)),remove=document.createElement('button');
      remove.className='vt-delete';remove.style.left=`calc(${x}% + 56px)`;remove.textContent='×';remove.title='Eliminar marcador';
      remove.onclick=e=>{e.stopPropagation();state.audioMarkers=state.audioMarkers.filter(item=>item.id!==marker.id);save();audio.dispatchEvent(new Event('timeupdate'));drawVisual()};
      $('#vtCanvas').append(remove);
    });
  };
  open.onclick=()=>{visual.classList.add('open');drawVisual()};$('#closeVisualTimeline').onclick=()=>visual.classList.remove('open');
  audio.addEventListener('timeupdate',()=>{if(visual.classList.contains('open'))drawVisual()});audio.addEventListener('loadedmetadata',drawVisual);drawVisual();
},1000);

// Show delete choices when hovering the formation delete button.
setTimeout(()=>{
  const button=$('#removeFormation');
  if(!button||button.closest('.formation-delete-wrap'))return;
  const wrap=document.createElement('div');
  wrap.className='formation-delete-wrap';
  button.before(wrap);
  wrap.append(button);
  const menu=document.createElement('div');
  menu.className='formation-delete-menu';
  menu.innerHTML='<button type="button" data-delete-all>Delete all</button>';
  wrap.append(menu);
  const deleteLabels={en:'Delete all',es:'Eliminar todo',ko:'전체 삭제'};
  const updateDeleteLabels=()=>{
    menu.querySelector('[data-delete-all]').textContent=deleteLabels[$('#languagePicker')?.value]||deleteLabels.en;
  };
  $('#languagePicker')?.addEventListener('change',updateDeleteLabels);
  updateDeleteLabels();
  const style=document.createElement('style');
  style.textContent=`.formActions>.formation-delete-wrap{position:relative;flex:1;min-width:0}.formation-delete-wrap>#removeFormation{width:100%;height:100%}.formation-delete-menu{display:none;position:absolute;right:0;bottom:100%;z-index:120;min-width:126px;padding:5px;gap:4px;background:#21191c;border:1px solid #743743;border-radius:8px;box-shadow:0 8px 20px #000b}.formation-delete-wrap:hover .formation-delete-menu,.formation-delete-wrap:focus-within .formation-delete-menu{display:grid}.formation-delete-menu button{width:100%;padding:7px 9px;text-align:left;font-size:10px}.formation-delete-menu [data-delete-all]{color:#ff9b9b;background:#49242a}`;
  document.head.append(style);
  menu.querySelector('[data-delete-all]').onclick=()=>{
    if(state.formations.length<2)return;
    if(!confirm('Delete all formations and song sync links? One fresh formation will remain so you can continue editing.'))return;
    change(()=>{
      const fresh=JSON.parse(JSON.stringify(state.formations[0]));
      fresh.name='Formation 1';
      delete fresh.id;
      delete fresh.routes;
      state.formations=[fresh];
      state.current=0;
      state.audioMarkers=[];
    });
  };
},2400);

// Use the same wine red for every dancer in every saved formation.
setTimeout(()=>{
  const wineRed='#ff3b57';
  state.formations.forEach(formation=>formation.positions?.forEach(dancer=>{dancer[2]=wineRed}));
  renderStage();
  save();
},2500);
// Quick formation navigation: search by formation or song section without
// making the whole workspace grow into a long page.
(()=>{
  const box=$('#formations');
  if(!box||$('#formationSearch'))return;
  const search=document.createElement('input');
  search.id='formationSearch';
  search.type='search';
  search.autocomplete='off';
  search.setAttribute('aria-label','Search formations');
  search.placeholder='⌕  Search formations…';
  search.style.cssText='width:100%;margin:0 0 7px;padding:8px 10px;border:1px solid #49383b;border-radius:7px;background:#211b1d;color:#fff;font:11px Arial,sans-serif;outline:none';
  box.parentElement.insertBefore(search,box);
  const apply=()=>{
    const query=search.value.trim().toLocaleLowerCase();
    box.querySelectorAll(':scope > section').forEach(group=>{
      let visible=0;
      group.querySelectorAll('.formation').forEach(button=>{
        const match=!query||button.textContent.toLocaleLowerCase().includes(query)||group.querySelector('small')?.textContent.toLocaleLowerCase().includes(query);
        button.hidden=!match;
        if(match)visible++;
      });
      group.hidden=visible===0;
    });
    box.querySelectorAll(':scope > .formation').forEach(button=>{button.hidden=!!query&&!button.textContent.toLocaleLowerCase().includes(query)});
  };
  search.addEventListener('input',apply);
  new MutationObserver(()=>queueMicrotask(apply)).observe(box,{childList:true,subtree:true});
  const style=document.createElement('style');
  style.textContent='#formations{max-height:min(52vh,520px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#75434a #211b1d;padding-right:4px}#formations>section{scroll-margin:8px}#formationSearch:focus{border-color:#d6525f!important;box-shadow:0 0 0 2px #d6525f33}#formations .formation[hidden],#formations>section[hidden]{display:none!important}@media(max-width:760px){#formationSearch{margin:0 0 5px!important}#formations{max-height:none;overflow-y:hidden;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none}#formations::-webkit-scrollbar{display:none}}';
  document.head.append(style);
  const formationDesign=document.createElement('style');
  formationDesign.textContent=`
    @keyframes appSoftEnter{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    @keyframes formationSelect{0%{filter:brightness(1)}45%{filter:brightness(1.24)}100%{filter:brightness(1)}}
    .app{animation:appSoftEnter .38s cubic-bezier(.2,.7,.25,1) both}
    button:not(.dancer){transition:transform .16s ease,filter .16s ease,box-shadow .16s ease,background-color .16s ease}
    button:not(.dancer):hover{transform:translateY(-1px);filter:brightness(1.08)}
    button:not(.dancer):active{transform:translateY(0) scale(.97);filter:brightness(.96)}
    button:not(.dancer):focus-visible{outline:2px solid #ed646c;outline-offset:2px}
    #formationSearch{height:37px!important;margin:0 0 9px!important;padding:0 12px!important;border:1px solid #453237!important;border-radius:9px!important;background:linear-gradient(135deg,#21191b,#181516)!important;color:#fff!important;font-size:11px!important;transition:border-color .18s,box-shadow .18s!important}
    #formationSearch::placeholder{color:#a99a9d;opacity:1}
    #formationSearch:focus{border-color:#d94b58!important;box-shadow:0 0 0 3px #d94b5825!important}
    #formations{padding:2px 5px 5px 1px!important;scrollbar-color:#74414a #191516!important}
    #formations>section{margin:7px 0!important;padding:8px!important;border:1px solid #332629!important;border-radius:10px!important;background:linear-gradient(145deg,#1d1819,#171415)!important;box-shadow:0 3px 10px #0002;animation:appSoftEnter .24s ease both}
    #formations>section>small{display:flex!important;align-items:center!important;gap:7px!important;margin:0 0 6px!important;padding:2px 3px 6px!important;border-bottom:1px solid #34272a!important;color:#f0787e!important;font-size:9px!important;font-weight:800!important;letter-spacing:1.15px!important}
    #formations>section>small::before{content:'';width:6px;height:6px;flex:none;border-radius:2px;background:#e04450;box-shadow:0 0 8px #e0445066}
    #formations .formation{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:7px!important;min-height:36px!important;margin:3px 0!important;padding:6px 7px 6px 9px!important;border:1px solid transparent!important;border-left:3px solid transparent!important;border-radius:7px!important;background:#211a1c!important;color:#d8cacc!important;text-align:left!important;transition:background .16s,border-color .16s,transform .16s,box-shadow .16s!important}
    #formations .formation:hover{transform:translateX(2px)!important;border-color:#493236!important;background:#2a2022!important;color:#fff!important;filter:none!important}
    #formations .formation:focus-visible{outline:2px solid #ed646c!important;outline-offset:1px}
    #formations .formation.active{border-color:#5a2b30!important;border-left-color:#f0444f!important;background:linear-gradient(100deg,#592128,#321d20 78%)!important;color:#fff!important;box-shadow:inset 0 0 18px #e0445010,0 2px 8px #0003!important;animation:formationSelect .28s ease-out both}
    #formations .formation>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px!important;font-weight:700}
    #formations .sync-formation{position:static!important;flex:none!important;transform:none!important;padding:4px 7px!important;border:1px solid #65383d!important;border-radius:6px!important;background:#302124!important;color:#f2a4a6!important;font-size:9px!important;line-height:12px!important;transition:all .16s!important}
    #formations .sync-formation:hover{border-color:#d45a61!important;background:#69272d!important;color:#fff!important}
    @media(max-width:760px){#formationSearch{margin-bottom:6px!important}#formations{padding:2px 0 8px!important}#formations .formation{min-height:38px!important}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
  `;
  setTimeout(()=>document.head.append(formationDesign),1600);
  const placeholders={en:'⌕  Search formations…',es:'⌕  Buscar formación…',ko:'⌕  포메이션 검색…'};
  const updatePlaceholder=()=>{
    const language=$('#languagePicker')?.value||localStorage.getItem('fx-dance-language')||'en';
    search.placeholder=placeholders[language]||placeholders.en;
    search.setAttribute('aria-label',search.placeholder.replace(/^⌕\s*/,''));
  };
  updatePlaceholder();
  $('#languagePicker')?.addEventListener('change',updatePlaceholder);
})();

// Preview manual formation changes with a short staggered stage movement.
setTimeout(()=>{
  const list=$('#formations'),movement=$('#movementControlsBody');
  if(!list||!movement)return;
  const setting=document.createElement('label');
  setting.id='formationPreviewControl';
  setting.innerHTML='<span></span><output></output><input id="formationPreviewSpeed" type="range" min="0" max="1600" step="100">';
  movement.append(setting);
  const slider=$('#formationPreviewSpeed'),output=setting.querySelector('output'),caption=setting.querySelector('span');
  slider.value=Math.max(0,Math.min(1600,+localStorage.getItem('fx-formation-preview-speed')||500));
  const languageCopy={
    en:{label:'Preview transition',instant:'Instant',seconds:value=>`${(value/1000).toFixed(1)} s`},
    es:{label:'Vista previa de transición',instant:'Instantánea',seconds:value=>`${(value/1000).toFixed(1).replace('.',',')} s`},
    ko:{label:'전환 미리보기',instant:'즉시',seconds:value=>`${(value/1000).toFixed(1)}초`}
  };
  const updateLabel=()=>{
    const copy=languageCopy[$('#languagePicker')?.value||'en']||languageCopy.en;
    caption.textContent=copy.label;
    output.textContent=+slider.value===0?copy.instant:copy.seconds(+slider.value);
    setting.title=copy.label;
  };
  slider.addEventListener('input',()=>{localStorage.setItem('fx-formation-preview-speed',slider.value);updateLabel()});
  $('#languagePicker')?.addEventListener('change',updateLabel);
  updateLabel();
  const style=document.createElement('style');
  style.textContent='#formationPreviewControl{display:grid!important;grid-template-columns:1fr auto;gap:5px 8px!important;align-items:center!important;margin:2px 0 0!important;padding:8px 9px!important;border:1px solid #3c292d;border-radius:8px;background:#1b1517;color:#e2ced0!important;font-size:10px!important}#formationPreviewControl output{float:none;color:#ff8587;font-variant-numeric:tabular-nums}#formationPreviewSpeed{grid-column:1/-1;width:100%;margin:2px 0 0;accent-color:#df4650}';
  document.head.append(style);
  list.addEventListener('click',event=>{
    const button=event.target.closest('.formation');
    if(!button||event.target.closest('.sync-formation'))return;
    if(animating){event.preventDefault();event.stopImmediatePropagation();return}
    if(+button.dataset.i===state.current)return;
    if((audio.src&&!audio.paused)||+slider.value===0||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const next=+button.dataset.i,targets=state.formations[next]?.positions||[],dancers=[...document.querySelectorAll('#stage .dancer')];
    if(!dancers.length)return;
    event.preventDefault();event.stopImmediatePropagation();
    const starts=dancers.map((dancer,index)=>[stageCoordinate(dancer,'left',index),stageCoordinate(dancer,'top',index)]);
    const duration=+slider.value,stagger=18,start=performance.now();
    animating=true;state.current=next;selected=0;
    list.querySelectorAll('.formation').forEach(row=>row.classList.toggle('active',row===button));
    function frame(now){
      const elapsed=now-start;
      dancers.forEach((dancer,index)=>{
        const t=Math.max(0,Math.min(1,(elapsed-index*stagger)/duration)),ease=t<1?1-Math.pow(1-t,3):1,a=starts[index],b=targets[index]||a;
        dancer.style.left=(a[0]+(b[0]-a[0])*ease)+'%';dancer.style.top=(a[1]+(b[1]-a[1])*ease)+'%';
      });
      if(elapsed<duration+stagger*(dancers.length-1)){requestAnimationFrame(frame);return}
      animating=false;render();collision();
    }
    requestAnimationFrame(frame);
  },true);
},2600);

// Keep keyboard shortcuts discoverable from Settings in all three UI languages.
setTimeout(()=>{
  const panel=$('#modal>div');
  if(!panel||$('#keyboardShortcuts'))return;
  const help=document.createElement('section');
  help.id='keyboardShortcuts';
  help.innerHTML='<h3></h3><div class="shortcutRows"></div>';
  const copy={
    en:{title:'Keyboard shortcuts',rows:[['← / →','Previous / next formation'],['Space','Play transition'],['N','New formation'],['A','Add dancer'],['D','Center dancers in a line'],['Ctrl+Z','Undo'],['Ctrl+Y / Ctrl+Shift+Z','Redo'],['+ / −','Zoom in / out']]},
    es:{title:'Atajos del teclado',rows:[['← / →','Formación anterior / siguiente'],['Espacio','Reproducir transición'],['N','Nueva formación'],['A','Añadir bailarín'],['D','Centrar bailarines en línea'],['Ctrl+Z','Deshacer'],['Ctrl+Y / Ctrl+Mayús+Z','Rehacer'],['+ / −','Acercar / alejar']]},
    ko:{title:'키보드 단축키',rows:[['← / →','이전 / 다음 포메이션'],['Space','전환 재생'],['N','새 포메이션'],['A','댄서 추가'],['D','댄서를 한 줄로 정렬'],['Ctrl+Z','실행 취소'],['Ctrl+Y / Ctrl+Shift+Z','다시 실행'],['+ / −','확대 / 축소']]}
  };
  const update=()=>{
    const data=copy[$('#languagePicker')?.value||'en']||copy.en;
    help.querySelector('h3').textContent=data.title;
    help.querySelector('.shortcutRows').innerHTML=data.rows.map(([key,action])=>`<div><kbd>${key}</kbd><span>${action}</span></div>`).join('');
  };
  const style=document.createElement('style');
  style.textContent='#keyboardShortcuts{margin-top:16px;padding:12px;border:1px solid #493238;border-radius:9px;background:#1b1517}#keyboardShortcuts h3{margin:0 0 9px;color:#f08084;font-size:11px;letter-spacing:.5px}#keyboardShortcuts .shortcutRows{display:grid;gap:6px}#keyboardShortcuts .shortcutRows>div{display:grid;grid-template-columns:minmax(104px,auto) 1fr;align-items:center;gap:8px;color:#d4c7c8;font-size:10px}#keyboardShortcuts kbd{justify-self:start;padding:3px 6px;border:1px solid #574147;border-bottom-width:2px;border-radius:5px;background:#2b2022;color:#fff;font:600 9px Arial,sans-serif;white-space:nowrap}';
  document.head.append(style);panel.append(help);update();$('#languagePicker')?.addEventListener('change',update);
},3000);

// Branded welcome screen: keep the existing dark/wine-red look, without a saved-dances landing page.
setTimeout(()=>{
  const home=document.createElement('main');
  home.id='welcomeHome';
  home.innerHTML=`
    <section class="welcome-shell">
      <header class="welcome-top"><div class="welcome-brand"><span>FX</span><b>ENTRETAIMENT <small>DANCE</small></b></div><span class="welcome-edition">CHOREOGRAPHY STUDIO</span></header>
      <div class="welcome-hero">
        <div class="welcome-copy"><div class="welcome-kicker"><i></i><span data-home="kicker"></span></div><h1 data-home="title"></h1><p data-home="subtitle"></p><div class="welcome-actions"><button id="welcomeOpenEditor" class="welcome-primary"><span>＋</span><b data-home="open"></b><i>↗</i></button><button id="welcomeOpenShortcuts" class="welcome-secondary"><span>⌘</span><b data-home="shortcuts"></b></button></div><small class="welcome-note" data-home="note"></small></div>
        <div class="welcome-stage" aria-hidden="true"><div class="welcome-stage-label"><span>STAGE MAP</span><b>01</b></div><div class="welcome-grid"><i class="welcome-centerline"></i><i class="welcome-crossline"></i><b class="welcome-dot d1">A</b><b class="welcome-dot d2">B</b><b class="welcome-dot d3">C</b><b class="welcome-dot d4">D</b><b class="welcome-dot d5">E</b><span class="welcome-axis back">BACKSTAGE</span><span class="welcome-axis front">FRONT</span></div><div class="welcome-stage-foot"><span>FORMATION DESIGN</span><i></i><span>MOVE WITH INTENTION</span></div></div>
      </div>
      <div class="welcome-section-title"><span data-home="tools"></span><i></i></div>
      <div class="welcome-features"><article><span class="welcome-icon">▦</span><div><b data-home="feature1"></b><small data-home="feature1desc"></small></div><em>01</em></article><article><span class="welcome-icon">↗</span><div><b data-home="feature2"></b><small data-home="feature2desc"></small></div><em>02</em></article><article><span class="welcome-icon">♫</span><div><b data-home="feature3"></b><small data-home="feature3desc"></small></div><em>03</em></article></div>
      <footer class="welcome-footer"><span>FX — DANCE PLANNER</span><span><kbd>←</kbd><kbd>→</kbd><i data-home="footer"></i></span></footer>
    </section>`;
  document.body.append(home);
  const language=()=>$('#languagePicker')?.value||localStorage.getItem('fx-dance-language')||'en';
  const words={
    en:{kicker:'YOUR NEXT CHOREOGRAPHY STARTS HERE',title:'Make the stage\nyours.',subtitle:'Shape formations, map every move, and rehearse with music — all in one focused workspace.',open:'Open the editor',shortcuts:'Keyboard shortcuts',note:'Your current project stays right where you left it.',tools:'BUILT FOR THE WAY YOU REHEARSE',feature1:'Formation design',feature1desc:'Arrange every dancer on the stage grid.',feature2:'Movement previews',feature2desc:'Watch transitions unfold at your pace.',feature3:'Music rehearsal',feature3desc:'Work with your track and keep each cue in time.',footer:'to move between formations'},
    es:{kicker:'TU PRÓXIMA COREOGRAFÍA EMPIEZA AQUÍ',title:'Haz tuyo\nel escenario.',subtitle:'Diseña formaciones, traza cada movimiento y ensaya con música en un mismo espacio.',open:'Abrir editor',shortcuts:'Atajos del teclado',note:'Tu proyecto actual se queda tal como lo dejaste.',tools:'PENSADO PARA TUS ENSAYOS',feature1:'Diseño de formaciones',feature1desc:'Organiza a cada bailarín sobre la cuadrícula.',feature2:'Vista previa del movimiento',feature2desc:'Observa las transiciones a tu ritmo.',feature3:'Ensayo con música',feature3desc:'Trabaja con tu canción y mantén cada marca a tiempo.',footer:'para cambiar de formación'},
    ko:{kicker:'새로운 안무를 여기서 시작하세요',title:'무대를\n직접 디자인하세요.',subtitle:'포메이션을 구성하고 동선을 계획하고 음악에 맞춰 연습하세요.',open:'편집기 열기',shortcuts:'키보드 단축키',note:'현재 작업은 그대로 유지됩니다.',tools:'연습을 위한 도구',feature1:'포메이션 디자인',feature1desc:'무대 격자에서 댄서들을 배치하세요.',feature2:'동작 미리보기',feature2desc:'원하는 속도로 전환을 확인하세요.',feature3:'음악 리허설',feature3desc:'음악과 큐를 맞춰 연습하세요.',footer:'포메이션 이동'}
  };
  const updateHome=()=>{const copy=words[language()]||words.en;home.querySelectorAll('[data-home]').forEach(node=>{node.textContent=copy[node.dataset.home]||''});home.querySelector('.welcome-kicker i').setAttribute('aria-hidden','true')};
  updateHome();$('#languagePicker')?.addEventListener('change',updateHome);
  const closeHome=afterClose=>{home.classList.add('welcome-is-closing');setTimeout(()=>{home.remove();afterClose?.()},240)};
  $('#welcomeOpenEditor').onclick=()=>closeHome();
  $('#welcomeOpenShortcuts').onclick=()=>closeHome(()=>$('#settings').click());
  const style=document.createElement('style');
  style.textContent=`
    #welcomeHome{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;overflow:auto;padding:clamp(18px,4vw,54px);background:radial-gradient(ellipse at 18% 10%,#35181d 0,transparent 37%),radial-gradient(ellipse at 92% 82%,#211417 0,transparent 36%),#0d0b0c;color:#f8f1f1;font-family:Arial,sans-serif;animation:appSoftEnter .4s ease both}
    .welcome-shell{width:min(1050px,100%);margin:auto}.welcome-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:clamp(28px,5vh,54px)}.welcome-brand{display:flex;align-items:center;gap:10px}.welcome-brand>span{display:grid;place-items:center;width:34px;height:34px;border:1px solid #9c4148;border-radius:9px;background:linear-gradient(145deg,#70262e,#33191d);color:#ffb6b8;font-weight:900;font-size:12px;box-shadow:0 4px 14px #0005}.welcome-brand>b{font-size:12px;letter-spacing:1.4px}.welcome-brand small{margin-left:5px;color:#c68387;font-size:9px}.welcome-edition{color:#927d80;font-size:9px;letter-spacing:2px}
    .welcome-hero{display:grid;grid-template-columns:1fr .92fr;gap:clamp(26px,6vw,78px);align-items:center}.welcome-kicker{display:flex;align-items:center;gap:9px;color:#e1797d;font-size:9px;font-weight:800;letter-spacing:1.65px}.welcome-kicker i{width:7px;height:7px;border-radius:50%;background:#e84b55;box-shadow:0 0 12px #e84b5599}.welcome-copy h1{margin:17px 0 13px;white-space:pre-line;font-size:clamp(38px,5.1vw,62px);line-height:1.02;letter-spacing:-2px}.welcome-copy>p{max-width:440px;margin:0;color:#b5a7a9;font-size:14px;line-height:1.7}.welcome-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:24px}.welcome-actions button{display:flex;align-items:center;gap:10px;min-height:43px;padding:10px 14px;border-radius:8px}.welcome-primary{border:1px solid #b74750;background:linear-gradient(135deg,#962e38,#5e2028);color:#fff;box-shadow:0 6px 18px #5d1b2344}.welcome-primary>span{font-size:17px}.welcome-primary>i{margin-left:7px;font-style:normal}.welcome-secondary{border:1px solid #433237;background:#1b1517;color:#e2d3d4}.welcome-note{display:block;margin-top:13px;color:#907f82;font-size:10px}
    .welcome-stage{padding:12px;border:1px solid #49292e;border-radius:13px;background:linear-gradient(145deg,#1b1517eF,#111011eF);box-shadow:0 18px 48px #0007,inset 0 1px #ffffff08;transform:rotate(1deg);animation:welcomeFloat 5s ease-in-out infinite}.welcome-stage-label,.welcome-stage-foot{display:flex;align-items:center;justify-content:space-between;color:#aa8589;font-size:8px;letter-spacing:1.3px}.welcome-stage-label{padding:3px 4px 10px}.welcome-stage-label b{color:#e8797e}.welcome-grid{position:relative;height:clamp(210px,30vw,310px);overflow:hidden;border:1px solid #342a2d;border-radius:7px;background-color:#131213;background-image:linear-gradient(#393034 1px,transparent 1px),linear-gradient(90deg,#393034 1px,transparent 1px);background-size:22px 22px}.welcome-centerline{position:absolute;top:0;bottom:0;left:50%;border-left:1px dashed #aa535a77}.welcome-crossline{position:absolute;left:0;right:0;top:50%;border-top:1px solid #d54a5277}.welcome-dot{position:absolute;display:grid;place-items:center;width:27px;height:27px;border:2px solid #e77a7e;border-radius:50%;background:radial-gradient(circle at 35% 25%,#c04750,#561c24);box-shadow:0 3px 9px #0009,0 0 12px #bc384433;color:#fff;font-size:9px}.welcome-dot.d1{left:47%;top:17%}.welcome-dot.d2{left:35%;top:34%}.welcome-dot.d3{left:60%;top:39%}.welcome-dot.d4{left:42%;top:62%}.welcome-dot.d5{left:67%;top:73%}.welcome-axis{position:absolute;color:#865f63;font-size:7px;letter-spacing:1.5px}.welcome-axis.back{top:8px;left:9px}.welcome-axis.front{bottom:8px;left:9px}.welcome-stage-foot{padding:10px 4px 2px;font-size:7px}.welcome-stage-foot i{height:1px;flex:1;margin:0 10px;background:#58343a}
    .welcome-section-title{display:flex;align-items:center;gap:12px;margin:clamp(29px,5vh,50px) 0 12px;color:#b78387;font-size:9px;font-weight:800;letter-spacing:1.5px}.welcome-section-title i{height:1px;flex:1;background:linear-gradient(90deg,#48282d,transparent)}.welcome-features{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.welcome-features article{display:grid;grid-template-columns:auto 1fr auto;align-items:start;gap:11px;min-height:91px;padding:14px;border:1px solid #35272a;border-radius:9px;background:linear-gradient(145deg,#1a1516,#141112);transition:transform .18s,border-color .18s,background .18s}.welcome-features article:hover{transform:translateY(-3px);border-color:#754047;background:linear-gradient(145deg,#211719,#171315)}.welcome-icon{display:grid;place-items:center;width:30px;height:30px;border:1px solid #63353b;border-radius:7px;background:#321b1e;color:#ec777c;font-size:14px}.welcome-features article b,.welcome-features article small{display:block}.welcome-features article b{margin:2px 0 5px;color:#eee2e3;font-size:11px}.welcome-features article small{color:#9e8f91;font-size:9px;line-height:1.5}.welcome-features article em{color:#72575a;font-size:8px;font-style:normal}.welcome-footer{display:flex;justify-content:space-between;align-items:center;margin-top:22px;padding-top:12px;border-top:1px solid #2d2224;color:#816e71;font-size:8px;letter-spacing:1.1px}.welcome-footer>span:last-child{display:flex;align-items:center;gap:5px;letter-spacing:0}.welcome-footer kbd{padding:3px 5px;border:1px solid #49353a;border-radius:4px;background:#20181a;color:#d3bfc1;font:9px Arial,sans-serif}.welcome-footer i{margin-left:4px;font-style:normal;color:#9d898c;font-size:9px}
    @keyframes welcomeFloat{0%,100%{transform:rotate(1deg) translateY(0)}50%{transform:rotate(1deg) translateY(-5px)}}
    @media(max-width:760px){#welcomeHome{place-items:start center;padding:22px 18px}.welcome-top{margin-bottom:28px}.welcome-edition{font-size:7px;letter-spacing:1px}.welcome-hero{grid-template-columns:1fr;gap:24px}.welcome-copy h1{font-size:clamp(40px,11vw,58px)}.welcome-copy>p{font-size:12px}.welcome-stage{max-width:500px;width:100%;justify-self:center}.welcome-grid{height:210px}.welcome-section-title{margin-top:27px}.welcome-features{grid-template-columns:1fr}.welcome-features article{min-height:0;padding:11px}.welcome-footer{margin-top:16px}}
    @media(prefers-reduced-motion:reduce){#welcomeHome,.welcome-stage,.welcome-features article{animation:none!important;transition:none!important}}
  `;
  document.head.append(style);
},0);

// Refined Settings panel: retain the existing controls while matching the wine-red interface.
const settingsPolish=document.createElement('style');
settingsPolish.textContent=`
  #modal{padding:16px;background:rgba(7,5,7,.78);backdrop-filter:blur(7px)}
  #modal>div{width:min(420px,calc(100vw - 32px));max-height:min(88vh,760px);overflow-y:auto;overscroll-behavior:contain;padding:25px;border:1px solid #5b343b;border-radius:15px;background:linear-gradient(150deg,#2b262e 0%,#211a1e 100%);box-shadow:0 24px 70px #000a,inset 0 1px #ffffff0b;animation:settingsRise .2s ease-out both}
  #modal>div h2{margin:0 42px 21px 0;color:#fff;font-size:20px;letter-spacing:-.35px}
  #modal .close{top:12px;right:12px;display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid #49343a;border-radius:8px;background:#30252a;color:#f4dfe1;font-size:19px;transition:background .16s,border-color .16s,transform .16s}
  #modal .close:hover{transform:rotate(90deg);border-color:#a84a55;background:#54252d;filter:none}
  #modal label:not(:has(input[type=checkbox])){display:grid;gap:7px;margin:14px 0 0;color:#e8dfe1;font-size:11px;font-weight:700;letter-spacing:.15px}
  #modal label select{width:100%;min-height:39px;margin:0;padding:8px 11px;border:1px solid #684047;border-radius:8px;background:#211b1e;color:#fff;font-size:12px;transition:border-color .16s,box-shadow .16s}
  #modal label select:hover{border-color:#a8525d}
  #modal label select:focus-visible{outline:none;border-color:#dc5863;box-shadow:0 0 0 3px #d94b5830}
  #modal label:has(input[type=checkbox]){display:flex;align-items:center;gap:9px;margin:15px 0 0;padding:10px 11px;border:1px solid #3e3034;border-radius:8px;background:#211a1d;color:#ddd0d2;font-size:11px}
  #modal label input[type=checkbox]{width:15px;height:15px;margin:0;accent-color:#c23a49}
  #keyboardShortcuts{margin-top:15px;padding:13px;border:1px solid #493238;border-radius:10px;background:linear-gradient(145deg,#1d1719,#191516);box-shadow:inset 0 1px #ffffff05}
  #keyboardShortcuts h3{margin:0 0 9px;color:#f08084;font-size:10px;letter-spacing:1px;text-transform:uppercase}
  #keyboardShortcuts .shortcutRows{gap:4px}
  #keyboardShortcuts .shortcutRows>div{grid-template-columns:minmax(112px,.58fr) 1fr;gap:9px;min-height:27px;padding:3px 6px;border-radius:6px;background:#241d20;color:#d9ccce;font-size:10px}
  #keyboardShortcuts kbd{padding:3px 6px;border:1px solid #684047;border-bottom-width:2px;border-radius:5px;background:linear-gradient(180deg,#38272c,#2c2023);color:#ffe9ea;font-size:9px}
  @keyframes settingsRise{from{opacity:0;transform:translateY(7px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
  @media(max-width:480px){#modal{padding:10px}#modal>div{width:100%;max-height:92vh;padding:21px 17px;border-radius:13px}#keyboardShortcuts{padding:11px}#keyboardShortcuts .shortcutRows>div{grid-template-columns:minmax(96px,.62fr) 1fr;gap:7px;font-size:9px}}
  @media(prefers-reduced-motion:reduce){#modal>div{animation:none}#modal .close{transition:none}}
`;
document.head.append(settingsPolish);

// Motion system for the editor and a more theatrical welcome entrance.
const motionPolish=document.createElement('style');
motionPolish.textContent=`
  @keyframes uiRise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes welcomeReveal{0%{opacity:0;filter:brightness(.48) saturate(.65)}65%{opacity:1;filter:brightness(1.16) saturate(1.12)}100%{opacity:1;filter:brightness(1) saturate(1)}}
  @keyframes welcomeShellIn{from{opacity:0;transform:translateY(20px) scale(.965);filter:blur(5px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
  @keyframes welcomeStageIn{from{opacity:0;filter:blur(5px)}to{opacity:1;filter:blur(0)}}
  @keyframes welcomeAura{0%,100%{opacity:.35;transform:scale(.92)}50%{opacity:.8;transform:scale(1.08)}}
  @keyframes welcomeExit{to{opacity:0;transform:scale(1.025);filter:blur(5px)}}
  @keyframes welcomeTitleGlow{0%,100%{text-shadow:0 0 0 #df465000}50%{text-shadow:0 0 24px #df465033}}
  @keyframes dancerArrive{from{opacity:1;transform:translate(-50%,-50%) scale(.9)}70%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
  .app>header{animation:uiRise .36s .04s both}.app>.toolbar{animation:uiRise .4s .1s both}.app>.workspace>.panel:first-child{animation:uiRise .44s .16s both}.app>.workspace>.center{animation:uiRise .46s .2s both}.app>.workspace>.panel:last-child{animation:uiRise .44s .24s both}
  button:not(.dancer),select,input:not([type=range]),details>summary{transition:transform .17s ease,filter .17s ease,box-shadow .17s ease,border-color .17s ease,background-color .17s ease}
  button:not(.dancer):hover{transform:translateY(-2px);filter:brightness(1.12)}button:not(.dancer):active{transform:translateY(0) scale(.97)}
  select:focus-visible,input:focus-visible{outline:2px solid #d94b58;outline-offset:2px;box-shadow:0 0 0 4px #d94b5824}
  #formations .formation{animation:uiRise .28s ease both}#formations .formation:nth-child(2){animation-delay:.025s}#formations .formation:nth-child(3){animation-delay:.05s}#formations .formation:nth-child(4){animation-delay:.075s}#formations .formation:nth-child(5){animation-delay:.1s}
  #stage .dancer{animation:dancerArrive .34s cubic-bezier(.2,.8,.25,1) both;transition:filter .16s,box-shadow .16s}#stage .dancer:hover:not(.dragging){filter:brightness(1.22);box-shadow:0 0 0 4px #ed646c44,0 4px 14px #0009}
  #welcomeHome{animation:welcomeReveal .85s ease-out both!important;background:radial-gradient(ellipse at 18% 10%,#481b24 0,transparent 40%),radial-gradient(ellipse at 92% 82%,#2d171c 0,transparent 38%),#0b090a!important}
  #welcomeHome::before{content:'';position:fixed;inset:-18%;z-index:-1;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,#e2475415,transparent 58%);animation:welcomeAura 4.2s ease-in-out infinite}
  #welcomeHome .welcome-shell{animation:welcomeShellIn .82s cubic-bezier(.16,.75,.2,1) both}
  #welcomeHome .welcome-top{animation:uiRise .5s .16s both}
  #welcomeHome .welcome-kicker{animation:uiRise .52s .24s both}
  #welcomeHome .welcome-copy h1{animation:uiRise .65s .32s both,welcomeTitleGlow 3.6s 1.2s ease-in-out infinite}
  #welcomeHome .welcome-copy>p{animation:uiRise .55s .42s both}
  #welcomeHome .welcome-actions{animation:uiRise .5s .5s both}
  #welcomeHome .welcome-note{animation:uiRise .5s .6s both}
  #welcomeHome .welcome-stage{animation:welcomeFloat 5s .35s ease-in-out infinite,welcomeStageIn .7s .25s both;box-shadow:0 22px 68px #0009,0 0 34px #d3414b20,inset 0 1px #ffffff0c}
  #welcomeHome .welcome-dot{animation:dancerArrive .65s cubic-bezier(.2,.8,.25,1) both,markerPulse 2.7s ease-in-out infinite}
  #welcomeHome .welcome-dot.d1{animation-delay:.55s,1s}#welcomeHome .welcome-dot.d2{animation-delay:.66s,1.3s}#welcomeHome .welcome-dot.d3{animation-delay:.77s,1.6s}#welcomeHome .welcome-dot.d4{animation-delay:.88s,1.9s}#welcomeHome .welcome-dot.d5{animation-delay:.99s,2.2s}
  @keyframes markerPulse{0%,100%{box-shadow:0 3px 9px #0009,0 0 7px #bc384422}50%{box-shadow:0 3px 9px #0009,0 0 17px #df465066}}
  #welcomeHome .welcome-section-title{animation:uiRise .5s .52s both}
  #welcomeHome .welcome-features article{animation:uiRise .56s both;transition:transform .22s,border-color .22s,box-shadow .22s,background .22s}
  #welcomeHome .welcome-features article:nth-child(1){animation-delay:.58s}#welcomeHome .welcome-features article:nth-child(2){animation-delay:.7s}#welcomeHome .welcome-features article:nth-child(3){animation-delay:.82s}
  #welcomeHome .welcome-features article:hover{transform:translateY(-5px);box-shadow:0 12px 26px #0005,0 0 15px #c13d481f}
  #welcomeHome .welcome-primary{box-shadow:0 7px 22px #8a263644;animation:welcomeButtonGlow 2.8s 1s ease-in-out infinite}
  @keyframes welcomeButtonGlow{0%,100%{box-shadow:0 7px 20px #8a263633}50%{box-shadow:0 8px 30px #c13d485c}}
  #welcomeHome .welcome-is-closing{animation:welcomeExit .24s ease-in both!important}
  #welcomeHome.welcome-is-closing{animation:welcomeExit .24s ease-in both!important;pointer-events:none}
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}#welcomeHome::before{display:none}}
`;
document.head.append(motionPolish);
const welcomeLayoutStyle=document.createElement('style');
welcomeLayoutStyle.textContent=`
  @keyframes welcomeDrop{0%{opacity:0;transform:translateY(-18px);filter:blur(3px)}72%{opacity:1;transform:translateY(2px);filter:blur(0)}100%{opacity:1;transform:translateY(0);filter:blur(0)}}
  @keyframes welcomeFade{from{opacity:0}to{opacity:1}}
  #welcomeHome .welcome-top{position:relative;left:50%;width:min(1450px,calc(100vw - clamp(36px,8vw,108px)));transform:translateX(-50%);animation:none!important}
  #welcomeHome .welcome-brand{animation:welcomeDrop .68s cubic-bezier(.2,.75,.25,1) .08s both!important}
  #welcomeHome .welcome-edition{animation:welcomeDrop .68s cubic-bezier(.2,.75,.25,1) .14s both!important}
  #welcomeHome .welcome-shell{width:min(1120px,100%);animation:welcomeFade .42s ease-out both!important}
  #welcomeHome .welcome-top{margin-bottom:clamp(24px,4vh,42px)}
  #welcomeHome .welcome-hero{grid-template-columns:minmax(220px,.7fr) minmax(340px,1.3fr);gap:clamp(24px,5vw,64px)}
  #welcomeHome .welcome-actions{flex-direction:column;align-items:stretch;max-width:250px;gap:10px;margin-top:22px}
  #welcomeHome .welcome-actions button{width:100%;justify-content:flex-start;min-height:48px}
  #welcomeHome .welcome-stage{width:100%;transform:none;animation:welcomeDrop .72s cubic-bezier(.2,.75,.25,1) .3s both!important}
  #welcomeHome .welcome-kicker{animation:welcomeDrop .62s cubic-bezier(.2,.75,.25,1) .12s both!important}
  #welcomeHome .welcome-copy h1{animation:welcomeDrop .7s cubic-bezier(.2,.75,.25,1) .18s both!important}
  #welcomeHome .welcome-copy>p{animation:welcomeDrop .64s cubic-bezier(.2,.75,.25,1) .25s both!important}
  #welcomeHome .welcome-actions{animation:welcomeDrop .66s cubic-bezier(.2,.75,.25,1) .32s both!important}
  #welcomeHome .welcome-note{animation:welcomeDrop .6s cubic-bezier(.2,.75,.25,1) .4s both!important}
  #welcomeHome .welcome-dot{animation:welcomeDrop .62s cubic-bezier(.2,.75,.25,1) .34s both!important}
  #welcomeHome .welcome-dot.d1{animation-delay:.34s!important}#welcomeHome .welcome-dot.d2{animation-delay:.39s!important}#welcomeHome .welcome-dot.d3{animation-delay:.44s!important}#welcomeHome .welcome-dot.d4{animation-delay:.49s!important}#welcomeHome .welcome-dot.d5{animation-delay:.54s!important}
  #welcomeHome .welcome-section-title{animation:welcomeDrop .62s cubic-bezier(.2,.75,.25,1) .48s both!important}
  #welcomeHome .welcome-features article{animation:welcomeDrop .62s cubic-bezier(.2,.75,.25,1) both!important}
  #welcomeHome .welcome-features article:nth-child(1){animation-delay:.54s!important}#welcomeHome .welcome-features article:nth-child(2){animation-delay:.61s!important}#welcomeHome .welcome-features article:nth-child(3){animation-delay:.68s!important}
  #welcomeHome .welcome-footer{animation:welcomeDrop .6s cubic-bezier(.2,.75,.25,1) .72s both}
  @media(max-width:760px){#welcomeHome .welcome-hero{grid-template-columns:1fr;gap:22px}#welcomeHome .welcome-actions{max-width:none;flex-direction:row;align-items:stretch}#welcomeHome .welcome-actions button{flex:1;justify-content:center;padding-inline:10px}#welcomeHome .welcome-stage{max-width:520px}}
  @media(max-width:460px){#welcomeHome .welcome-actions{flex-direction:column}#welcomeHome .welcome-actions button{justify-content:flex-start}}
  @media(prefers-reduced-motion:reduce){#welcomeHome .welcome-shell,#welcomeHome .welcome-top,#welcomeHome .welcome-kicker,#welcomeHome .welcome-copy h1,#welcomeHome .welcome-copy>p,#welcomeHome .welcome-actions,#welcomeHome .welcome-note,#welcomeHome .welcome-stage,#welcomeHome .welcome-dot,#welcomeHome .welcome-section-title,#welcomeHome .welcome-features article,#welcomeHome .welcome-footer{animation:none!important}}
`;
document.head.append(welcomeLayoutStyle);
const settingsMotion=document.createElement('style');
settingsMotion.textContent=`
  @keyframes settingsBackdropIn{from{opacity:0;backdrop-filter:blur(0)}to{opacity:1;backdrop-filter:blur(7px)}}
  @keyframes settingsBackdropOut{to{opacity:0;backdrop-filter:blur(0)}}
  @keyframes settingsPanelIn{0%{opacity:0;transform:translateY(22px) scale(.94);filter:blur(6px)}70%{opacity:1;transform:translateY(-2px) scale(1.008);filter:blur(0)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
  @keyframes settingsPanelOut{to{opacity:0;transform:translateY(12px) scale(.975);filter:blur(4px)}}
  @keyframes settingsItemIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes settingsGearSpin{from{transform:rotate(0) scale(.9)}55%{transform:rotate(210deg) scale(1.12)}to{transform:rotate(360deg) scale(1)}}
  #modal.is-opening{animation:settingsBackdropIn .28s ease-out both}
  #modal.is-opening>div{animation:settingsPanelIn .42s cubic-bezier(.18,.8,.24,1) both}
  #modal.is-closing{animation:settingsBackdropOut .2s ease-in both}
  #modal.is-closing>div{animation:settingsPanelOut .2s ease-in both}
  #modal.is-opening>div>h2,#modal.is-opening>div>#languageSetting,#modal.is-opening>div>label,#modal.is-opening>div>#keyboardShortcuts{animation:settingsItemIn .3s ease-out both}
  #modal.is-opening>div>#languageSetting{animation-delay:.08s}#modal.is-opening>div>label:not(#languageSetting){animation-delay:.13s}#modal.is-opening>div>#keyboardShortcuts{animation-delay:.19s}
  #keyboardShortcuts .shortcutRows>div{animation:settingsItemIn .26s ease-out both}
  #keyboardShortcuts .shortcutRows>div:nth-child(2){animation-delay:.025s}#keyboardShortcuts .shortcutRows>div:nth-child(3){animation-delay:.05s}#keyboardShortcuts .shortcutRows>div:nth-child(4){animation-delay:.075s}#keyboardShortcuts .shortcutRows>div:nth-child(5){animation-delay:.1s}#keyboardShortcuts .shortcutRows>div:nth-child(6){animation-delay:.125s}#keyboardShortcuts .shortcutRows>div:nth-child(7){animation-delay:.15s}#keyboardShortcuts .shortcutRows>div:nth-child(8){animation-delay:.175s}
  #settings{transform-origin:center;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease!important}
  #settings:hover{transform:rotate(24deg) scale(1.1)!important;box-shadow:0 0 0 4px #d94b5820,0 0 18px #d94b5845!important}
  #settings.settings-spinning{animation:settingsGearSpin .52s cubic-bezier(.2,.75,.2,1) both!important;border-color:#d95b65!important;box-shadow:0 0 0 4px #d94b5824,0 0 20px #d94b5866!important}
  @media(prefers-reduced-motion:reduce){#modal.is-opening,#modal.is-opening>div,#modal.is-closing,#modal.is-closing>div,#modal.is-opening>div>*,#keyboardShortcuts .shortcutRows>div,#settings.settings-spinning{animation:none!important}}
`;
document.head.append(settingsMotion);
const settingsButton=$('#settings'),settingsModal=$('#modal'),settingsClose=settingsModal?.querySelector('.close');
if(settingsButton&&settingsModal&&settingsClose){
  const animateGear=()=>{settingsButton.classList.remove('settings-spinning');void settingsButton.offsetWidth;settingsButton.classList.add('settings-spinning');setTimeout(()=>settingsButton.classList.remove('settings-spinning'),540)};
  settingsButton.onclick=()=>{animateGear();settingsModal.classList.remove('hidden','is-closing');settingsModal.classList.add('is-opening');setTimeout(()=>settingsModal.classList.remove('is-opening'),450)};
  settingsClose.onclick=()=>{settingsModal.classList.remove('is-opening');settingsModal.classList.add('is-closing');setTimeout(()=>{settingsModal.classList.add('hidden');settingsModal.classList.remove('is-closing')},205)};
}

// Fresh editor sessions, a group picker, and a dedicated animated keyboard guide.
setTimeout(()=>{
  const home=$('#welcomeHome');
  if(!home)return;
  const language=()=>$('#languagePicker')?.value||localStorage.getItem('fx-dance-language')||'en';
  const copy={
    en:{fresh:'Every session starts fresh. Your saved dances stay in My Dances.',choose:'Choose or create a group',group:'Group',description:'Choose one of your groups or create a new one for this choreography.',newGroup:'+ Create a new group',name:'New group name',continue:'Create group and open editor',back:'Back to welcome',invalid:'Enter a name for your new group.',guide:'Keyboard shortcuts',guideIntro:'Quick controls for building and rehearsing a formation.',close:'Close',hint:'Shortcuts pause while this guide or Settings is open.',items:[['← / →','Move to the previous or next formation.'],['Space','Play the transition to the next formation.'],['N','Create a new formation in the editor.'],['A','Add a dancer at the center of the stage.'],['D','Arrange the dancers in a centered line.'],['Ctrl + Z','Undo the last change.'],['Ctrl + Y  ·  Ctrl + Shift + Z','Redo the last undone change.'],['+ / −','Zoom in or out on the stage.']]},
    es:{fresh:'Cada sesión empieza vacía. Tus bailes guardados siguen en Mis bailes.',choose:'Escoge o crea un grupo',group:'Grupo',description:'Elige uno de tus grupos o crea uno nuevo para esta coreografía.',newGroup:'+ Crear un grupo nuevo',name:'Nombre del grupo nuevo',continue:'Crear grupo y abrir editor',back:'Volver a bienvenida',invalid:'Escribe un nombre para el grupo nuevo.',guide:'Atajos del teclado',guideIntro:'Controles rápidos para crear y ensayar una formación.',close:'Cerrar',hint:'Los atajos se pausan mientras esta guía o Ajustes están abiertos.',items:[['← / →','Ir a la formación anterior o siguiente.'],['Espacio','Reproducir la transición a la formación siguiente.'],['N','Crear una formación nueva en el editor.'],['A','Añadir un bailarín en el centro del escenario.'],['D','Alinear los bailarines en una línea centrada.'],['Ctrl + Z','Deshacer el último cambio.'],['Ctrl + Y  ·  Ctrl + Mayús + Z','Rehacer el último cambio deshecho.'],['+ / −','Acercar o alejar el escenario.']]},
    ko:{fresh:'새 세션은 빈 화면으로 시작합니다. 저장된 안무는 내 안무에 남아 있습니다.',choose:'그룹 선택 또는 만들기',group:'그룹',description:'그룹을 선택하거나 이 안무를 위한 새 그룹을 만드세요.',newGroup:'+ 새 그룹 만들기',name:'새 그룹 이름',continue:'그룹 만들고 편집기 열기',back:'환영 화면으로',invalid:'새 그룹 이름을 입력하세요.',guide:'키보드 단축키',guideIntro:'포메이션을 만들고 연습할 때 사용하는 빠른 조작입니다.',close:'닫기',hint:'이 안내나 설정이 열려 있으면 단축키가 일시 정지됩니다.',items:[['← / →','이전 또는 다음 포메이션으로 이동합니다.'],['Space','다음 포메이션으로 전환을 재생합니다.'],['N','새 포메이션을 만듭니다.'],['A','무대 중앙에 댄서를 추가합니다.'],['D','댄서들을 중앙선에 맞춰 정렬합니다.'],['Ctrl + Z','마지막 변경을 실행 취소합니다.'],['Ctrl + Y · Ctrl + Shift + Z','실행 취소한 변경을 다시 실행합니다.'],['+ / −','무대를 확대하거나 축소합니다.']]}
  };
  const words=()=>copy[language()]||copy.en;
  const note=home.querySelector('[data-home="note"]');
  const updateNote=()=>{if(note)note.textContent=words().fresh};
  updateNote();$('#languagePicker')?.addEventListener('change',updateNote);

  const chooser=document.createElement('div');chooser.id='welcomeGroupChooser';chooser.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="groupChooserTitle"><button type="button" class="group-chooser-close" aria-label="Close">×</button><span class="guide-eyebrow">FX · DANCE PLANNER</span><h2 id="groupChooserTitle"></h2><p class="group-chooser-copy"></p><label class="group-field"><span class="group-label"></span><select id="welcomeGroupSelect"></select></label><label class="group-field" id="newGroupField" hidden><span class="group-name-label"></span><input id="welcomeGroupName" maxlength="48" autocomplete="off"></label><p id="groupChooserError" role="alert"></p><div class="group-chooser-actions"><button type="button" id="groupChooserBack"></button><button type="button" id="groupChooserContinue" class="guide-primary" hidden></button></div></section>';
  document.body.append(chooser);
  const songPartPicker=$('.part-picker'),newPartButton=$('#newPart'),createSongPart=newPartButton?.onclick;
  if(songPartPicker&&newPartButton&&createSongPart){songPartPicker.hidden=true;newPartButton.onclick=()=>{const beforeCount=state.songParts.length,beforeSection=f().section;createSongPart();if(state.songParts.length>beforeCount||f().section!==beforeSection)songPartPicker.hidden=false}}
  const groupSelect=chooser.querySelector('#welcomeGroupSelect'),groupName=chooser.querySelector('#welcomeGroupName'),nameField=chooser.querySelector('#newGroupField');
  const fillGroupChooser=()=>{
    const text=words(),defaultParts=['Intro','Verso 1','Pre-coro','Coro','Verso 2','Puente','Final'];
    let savedGroups=[];try{const parsed=JSON.parse(localStorage.getItem('fx-dance-custom-groups')||'[]');if(Array.isArray(parsed))savedGroups=parsed.filter(group=>typeof group==='string'&&group.trim())}catch{}
    const groups=[...new Set([...savedGroups,...(state.songParts||[]).filter(group=>typeof group==='string'&&group.trim()&&!defaultParts.includes(group))])];
    chooser.querySelector('#groupChooserTitle').textContent=text.choose;
    chooser.querySelector('.group-chooser-copy').textContent=text.description;
    chooser.querySelector('.group-label').textContent=text.group;
    chooser.querySelector('.group-name-label').textContent=text.name;
    chooser.querySelector('#groupChooserContinue').textContent=text.continue;
    chooser.querySelector('#groupChooserBack').textContent=text.back;
    const placeholder=document.createElement('option');placeholder.value='';placeholder.disabled=true;placeholder.textContent=language()==='es'?'Selecciona un grupo':language()==='ko'?'그룹을 선택하세요':'Select a group';
    groupSelect.replaceChildren(placeholder,...groups.map(group=>{const option=document.createElement('option');option.value=group;option.textContent=group;return option}));
    const create=document.createElement('option');create.value='__create__';create.textContent=text.newGroup;groupSelect.append(create);
    groupSelect.value='';nameField.hidden=true;chooser.querySelector('#groupChooserContinue').hidden=true;
    groupName.value='';groupName.placeholder=text.name;chooser.querySelector('#groupChooserError').textContent='';
  };
  groupSelect.addEventListener('change',()=>{const creating=groupSelect.value==='__create__',action=chooser.querySelector('#groupChooserContinue');nameField.hidden=!creating;action.hidden=!groupSelect.value;action.textContent=creating?words().continue:(language()==='es'?'Abrir editor':language()==='ko'?'편집기 열기':'Open editor');chooser.querySelector('#groupChooserError').textContent='';if(creating)groupName.focus()});
  home.querySelector('#welcomeOpenEditor').onclick=()=>{fillGroupChooser();chooser.classList.remove('is-closing');chooser.classList.add('is-open');setTimeout(()=>groupSelect.focus(),380)};
  chooser.querySelector('.group-chooser-close').onclick=chooser.querySelector('#groupChooserBack').onclick=()=>{chooser.classList.add('is-closing');setTimeout(()=>chooser.classList.remove('is-open','is-closing'),260)};
  groupName.addEventListener('keydown',event=>{if(event.key==='Enter')chooser.querySelector('#groupChooserContinue').click()});
  chooser.querySelector('#groupChooserContinue').onclick=()=>{
    const text=words(),creating=groupSelect.value==='__create__',group=creating?groupName.value.trim():groupSelect.value;
    if(!groupSelect.value){chooser.querySelector('#groupChooserError').textContent=text.invalid;groupSelect.focus();return}
    if(creating&&!group){chooser.querySelector('#groupChooserError').textContent=text.invalid;groupName.focus();return}
    if(creating){let savedGroups=[];try{const parsed=JSON.parse(localStorage.getItem('fx-dance-custom-groups')||'[]');if(Array.isArray(parsed))savedGroups=parsed.filter(item=>typeof item==='string')}catch{}if(!savedGroups.includes(group)){savedGroups.push(group);try{localStorage.setItem('fx-dance-custom-groups',JSON.stringify(savedGroups))}catch{}}}
    state={name:'Mi coreografía',current:0,songParts:state.songParts,formations:[{name:'Nueva formación',group,section:'Intro',positions:[]}],audioMarkers:[],collapsedParts:{},playOrder:[]};
    selected=0;history.length=0;future.length=0;
    audio.pause();audio.removeAttribute('src');audio.load();
    render();save();decorateFormations();
    chooser.classList.add('is-closing');home.classList.add('welcome-is-closing');
    setTimeout(()=>{chooser.classList.remove('is-open','is-closing');home.remove()},260);
  };

  const guide=document.createElement('aside');guide.id='keyboardGuide';guide.setAttribute('aria-hidden','true');guide.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="keyboardGuideTitle"><div class="guide-top"><span class="guide-emblem">⌘</span><button type="button" class="guide-close" aria-label="Close">×</button></div><span class="guide-eyebrow">FX · DANCE PLANNER</span><h2 id="keyboardGuideTitle"></h2><p class="guide-intro"></p><div class="guide-list"></div><p class="guide-hint"></p><button type="button" class="guide-done guide-primary"></button></section>';
  document.body.append(guide);
  const drawGuide=()=>{const text=words();guide.querySelector('#keyboardGuideTitle').textContent=text.guide;guide.querySelector('.guide-intro').textContent=text.guideIntro;guide.querySelector('.guide-hint').textContent=text.hint;guide.querySelector('.guide-done').textContent=text.close;guide.querySelector('.guide-list').replaceChildren(...text.items.map(([key,description],index)=>{const row=document.createElement('article'),kbd=document.createElement('kbd'),copyText=document.createElement('span'),number=document.createElement('i');row.style.setProperty('--row',index);kbd.textContent=key;copyText.textContent=description;number.textContent=String(index+1).padStart(2,'0');row.append(kbd,copyText,number);return row}))};
  const closeGuide=()=>{guide.classList.add('is-closing');setTimeout(()=>{guide.classList.remove('is-open','is-closing');guide.setAttribute('aria-hidden','true')},260)};
  const openGuide=()=>{drawGuide();guide.classList.remove('is-closing');guide.classList.add('is-open');guide.setAttribute('aria-hidden','false');setTimeout(()=>guide.querySelector('.guide-close').focus(),420)};
  guide.querySelector('.guide-close').onclick=guide.querySelector('.guide-done').onclick=closeGuide;
  home.querySelector('#welcomeOpenShortcuts').onclick=openGuide;
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(guide.classList.contains('is-open'))closeGuide();else if(chooser.classList.contains('is-open'))chooser.querySelector('#groupChooserBack').click()}});
  $('#languagePicker')?.addEventListener('change',drawGuide);
  const style=document.createElement('style');style.textContent=`
    #welcomeGroupChooser,#keyboardGuide{position:fixed;inset:0;z-index:1200;display:grid;place-items:center;padding:20px;background:#080607d9;backdrop-filter:blur(0);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .32s ease,visibility .32s,backdrop-filter .32s}
    #welcomeGroupChooser.is-open,#keyboardGuide.is-open{opacity:1;visibility:visible;pointer-events:auto;backdrop-filter:blur(9px)}
    #welcomeGroupChooser.is-closing,#keyboardGuide.is-closing{opacity:0;backdrop-filter:blur(0)}
    #welcomeGroupChooser>section,#keyboardGuide>section{position:relative;width:min(530px,100%);max-height:min(88vh,760px);overflow:auto;padding:clamp(22px,5vw,38px);border:1px solid #58343a;border-radius:18px;background:radial-gradient(ellipse at 15% 0,#3a1b20 0,transparent 52%),linear-gradient(145deg,#211a1c,#151213);box-shadow:0 32px 100px #000b,0 0 48px #b83c4520;opacity:0;transform:translateY(28px) scale(.965);transition:opacity .38s ease,transform .5s cubic-bezier(.16,.8,.2,1)}
    #welcomeGroupChooser.is-open>section,#keyboardGuide.is-open>section{opacity:1;transform:translateY(0) scale(1)}#welcomeGroupChooser.is-closing>section,#keyboardGuide.is-closing>section{opacity:0;transform:translateY(14px) scale(.98)}
    .group-chooser-close,.guide-close{position:absolute;top:18px;right:18px;width:34px;height:34px;padding:0;border:1px solid #51343a;border-radius:9px;background:#2b2023;color:#f2dfe1;font-size:20px;transition:transform .2s,background .2s}.group-chooser-close:hover,.guide-close:hover{transform:rotate(90deg);background:#54252d;filter:none}
    .guide-eyebrow{display:block;margin:7px 0 12px;color:#e77b80;font-size:9px;font-weight:800;letter-spacing:2px}.group-chooser-copy,.guide-intro{max-width:430px;margin:0 0 23px;color:#bcaeb0;font-size:13px;line-height:1.65}
    #groupChooserTitle,#keyboardGuideTitle{margin:0 42px 10px 0;color:#fff1f1;font-size:clamp(24px,5vw,34px);letter-spacing:-.7px}#welcomeGroupChooser .group-field{display:grid;gap:8px;margin:15px 0;color:#eadcde;font-size:11px;font-weight:700}#newGroupField[hidden]{display:none!important}#welcomeGroupChooser input,#welcomeGroupChooser select{width:100%;min-height:43px;padding:10px 12px;border:1px solid #664047;border-radius:9px;background:#1b1618;color:#fff;font-size:13px}#welcomeGroupChooser input:focus,#welcomeGroupChooser select:focus{outline:none;border-color:#dc646b;box-shadow:0 0 0 3px #d94b5830}#groupChooserError{min-height:17px;margin:4px 0;color:#ff9296;font-size:11px}
    .group-chooser-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:19px}.group-chooser-actions button,.guide-done{min-height:40px;padding:10px 14px;border-radius:9px}.guide-primary{border:1px solid #c04e57;background:linear-gradient(135deg,#9f303a,#68232b);color:white;box-shadow:0 8px 22px #7b25352d;transition:transform .2s,box-shadow .2s,filter .2s}.guide-primary:hover{transform:translateY(-2px);box-shadow:0 12px 26px #a3333c45;filter:brightness(1.12)}#groupChooserBack{border:1px solid #46363a;background:#211a1c;color:#d8c8ca}
    #keyboardGuide>section{width:min(680px,100%)}.guide-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.guide-emblem{display:grid;place-items:center;width:42px;height:42px;border:1px solid #6f3c43;border-radius:12px;background:linear-gradient(145deg,#452126,#281719);color:#ff9ba0;font-size:20px;box-shadow:0 7px 22px #0004}.guide-top .guide-close{position:static}.guide-intro{margin-bottom:19px}.guide-list{display:grid;grid-template-columns:1fr 1fr;gap:9px}.guide-list article{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:11px;min-height:68px;padding:12px;border:1px solid #3f2b30;border-radius:10px;background:linear-gradient(145deg,#21191b,#191516);opacity:0;transform:translateY(12px);transition:opacity .45s ease,transform .45s cubic-bezier(.16,.8,.2,1),border-color .2s,background .2s;transition-delay:calc(var(--row)*45ms)}#keyboardGuide.is-open .guide-list article{opacity:1;transform:translateY(0)}.guide-list article:hover{border-color:#86424b;background:#2a1b1f}.guide-list kbd{padding:6px 8px;border:1px solid #684047;border-bottom-width:2px;border-radius:7px;background:#35262a;color:#fff0f0;font:700 10px Arial,sans-serif;white-space:nowrap}.guide-list span{color:#dfd1d2;font-size:11px;line-height:1.45}.guide-list i{color:#76575b;font-size:9px;font-style:normal}.guide-hint{margin:17px 0 13px;color:#978487;font-size:10px}.guide-done{float:right;min-width:96px}
    @media(max-width:580px){#keyboardGuide{padding:12px}#keyboardGuide>section{padding:20px 16px}.guide-list{grid-template-columns:1fr;gap:6px}.guide-list article{min-height:55px;padding:9px}.group-chooser-actions{flex-direction:column-reverse}.group-chooser-actions button{width:100%}}
    @media(prefers-reduced-motion:reduce){#welcomeGroupChooser,#keyboardGuide,#welcomeGroupChooser>section,#keyboardGuide>section,.guide-list article,.guide-primary,.group-chooser-close,.guide-close{transition-duration:.01ms!important;animation:none!important}}
  `;
  style.textContent+=`.group-chooser-close,.guide-close{transition:transform .28s cubic-bezier(.2,.8,.2,1),background .2s,box-shadow .2s}.group-chooser-close:hover,.guide-close:hover{transform:rotate(90deg) scale(1.08);box-shadow:0 0 0 4px #d94b5822,0 0 16px #d94b5844}.group-chooser-close:active,.guide-close:active{transform:rotate(90deg) scale(.88)}.guide-done{transition:transform .24s cubic-bezier(.2,.8,.2,1),box-shadow .24s,filter .24s}.guide-done:active{transform:scale(.94)}#groupChooserContinue[hidden]{display:none!important}#welcomeGroupChooser.is-closing .group-chooser-close,#keyboardGuide.is-closing .guide-close{animation:closeButtonExit .26s ease-in both}@keyframes closeButtonExit{to{opacity:0;transform:rotate(120deg) scale(.65)}}@media(prefers-reduced-motion:reduce){.group-chooser-close,.guide-close,.guide-done{transition-duration:.01ms!important}#welcomeGroupChooser.is-closing .group-chooser-close,#keyboardGuide.is-closing .guide-close{animation:none!important}}`;
  document.head.append(style);

  setTimeout(()=>{
    const shortcuts=$('#keyboardShortcuts'),panel=$('#modal>div');
    if(shortcuts)shortcuts.remove();
    if(panel&&!$('#openKeyboardGuide')){const button=document.createElement('button');button.id='openKeyboardGuide';button.type='button';button.textContent=words().guide;button.style.cssText='width:100%;margin-top:14px;padding:10px;border:1px solid #604047;border-radius:8px;background:#2a1d21;color:#f2dfe1';button.onclick=openGuide;panel.append(button)}
    $('#languagePicker')?.addEventListener('change',()=>{const button=$('#openKeyboardGuide');if(button)button.textContent=words().guide});
  },3300);
},20);

// Stage studio: selectable floor plans and a traceable custom outline.
(()=>{
  const stage=$('#stage'),viewport=$('#viewport'),top=$('.stageTop span');
  if(!stage||!viewport||!top)return;
  const texts={
    en:{open:'▱ Stage design',title:'Stage design',types:'Choose a stage layout',square:'Rectangular stage',arena:'Arena stage',thrust:'Proscenium',tstage:'T-stage',runway:'Runway stage',bstage:'B-stage',dual:'Dual stage',custom:'Custom outline',trace:'Draw a custom outline',finish:'Finish outline',undo:'Undo point',cancel:'Cancel',close:'Close',hint:'Choose a concert or stadium layout, or draw your own outline.',needPoints:'Add at least 3 points to finish the outline.'},
    es:{open:'▱ Escenario',title:'Diseño del escenario',types:'Elige el montaje',square:'Escenario rectangular',arena:'Escenario arena',thrust:'Proscenio',tstage:'Escenario en T',runway:'Escenario con pasarela',bstage:'Escenario B',dual:'Dos escenarios',custom:'Contorno propio',trace:'Dibujar contorno propio',finish:'Terminar contorno',undo:'Deshacer punto',cancel:'Cancelar',close:'Cerrar',hint:'Elige un montaje de concierto o estadio, o dibuja tu propio contorno.',needPoints:'Agrega al menos 3 puntos para terminar el contorno.'},
    ko:{open:'▱ 무대 디자인',title:'무대 디자인',types:'무대 배치 선택',square:'직사각형 무대',arena:'아레나 무대',thrust:'프로시니엄',tstage:'T자 무대',runway:'런웨이 무대',bstage:'B 무대',dual:'듀얼 무대',custom:'사용자 윤곽',trace:'사용자 윤곽 그리기',finish:'윤곽 완료',undo:'점 실행 취소',cancel:'취소',close:'닫기',hint:'콘서트나 경기장 무대 배치를 선택하거나 직접 윤곽을 그리세요.',needPoints:'윤곽을 완료하려면 점을 3개 이상 추가하세요.'}
  };
  const language=()=>$('#languagePicker')?.value||localStorage.getItem('fx-dance-language')||'es';
  const words=()=>texts[language()]||texts.es;
  let config={shape:'square',points:[]};
  try{config={...config,...JSON.parse(localStorage.getItem('fx-stage-design')||'{}')}}catch{}
  delete config.photo;delete config.opacity;
  if(['oval','circle','stadium','diamond','cross','lstg','fan','hexagon'].includes(config.shape))config.shape='square';
  const button=document.createElement('button');button.id='openStageStudio';button.type='button';top.append(button);
  const modal=document.createElement('div');modal.id='stageStudio';modal.setAttribute('aria-hidden','true');
  modal.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="stageStudioTitle"><button type="button" class="studio-close" aria-label="Close">×</button><h2 id="stageStudioTitle"></h2><p class="studio-hint"></p><h3 class="studio-section"></h3><div class="stage-shape-options"><button data-shape="square"><i class="shape-icon square-icon"></i><span></span></button><button data-shape="arena"><i class="shape-icon arena-icon"></i><span></span></button><button data-shape="thrust"><i class="shape-icon thrust-icon"></i><span></span></button><button data-shape="tstage"><i class="shape-icon tstage-icon"></i><span></span></button><button data-shape="runway"><i class="shape-icon runway-icon"></i><span></span></button><button data-shape="bstage"><i class="shape-icon bstage-icon"></i><span></span></button><button data-shape="dual"><i class="shape-icon dual-icon"></i><span></span></button><button data-shape="custom"><i class="shape-icon custom-icon"></i><span></span></button></div><div class="studio-custom"><button type="button" class="studio-trace"></button></div><button type="button" class="studio-done"></button></section>';
  document.body.append(modal);
  const traceBar=document.createElement('div');traceBar.id='stageTraceBar';traceBar.innerHTML='<button type="button" data-trace-finish></button><button type="button" data-trace-undo></button><button type="button" data-trace-cancel></button>';
  viewport.append(traceBar);
  let tracing=false,points=[];
  const saveConfig=()=>{try{localStorage.setItem('fx-stage-design',JSON.stringify(config))}catch{}};
  const stageContours={
    square:[[0,0],[100,0],[100,100],[0,100]],
    arena:[[14,0],[86,0],[100,18],[100,82],[86,100],[14,100],[0,82],[0,18]],
    thrust:[[0,0],[100,0],[100,78],[68,78],[62,92],[62,100],[38,100],[38,92],[32,78],[0,78]],
    tstage:[[0,0],[100,0],[100,34],[62,34],[62,100],[38,100],[38,34],[0,34]],
    runway:[[0,0],[100,0],[100,22],[59,22],[59,78],[76,78],[76,100],[24,100],[24,78],[41,78],[41,22],[0,22]],
    bstage:[[0,0],[100,0],[100,22],[59,22],[59,78],[80,78],[80,100],[20,100],[20,78],[41,78],[41,22],[0,22]],
    dual:[[17,0],[83,0],[83,22],[59,22],[59,78],[83,78],[83,100],[17,100],[17,78],[41,78],[41,22],[17,22]]
  };
  const drawStageOutline=()=>{
    stage.querySelector('.custom-stage-outline')?.remove();
    const contour=config.shape==='custom'?config.points:stageContours[config.shape];if(!contour||contour.length<3)return;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('custom-stage-outline');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M ${contour.map(p=>`${p[0]} ${p[1]}`).join(' L ')} Z`);svg.append(path);stage.append(svg);
  };
  const apply=()=>{
    stage.dataset.stageShape=config.shape||'square';
    stage.style.clipPath='';stage.style.borderRadius='';
    const contour=config.shape==='custom'?config.points:stageContours[config.shape];
    if(config.shape!=='square'&&contour?.length>=3)stage.style.clipPath=`polygon(${contour.map(p=>`${p[0]}% ${p[1]}%`).join(',')})`;
    drawStageOutline();
    requestAnimationFrame(centerStageGuides);
    button.textContent=words().open;document.querySelectorAll('[data-stage-shape]').forEach(x=>x.classList.toggle('active',x.dataset.shape===config.shape));
    saveConfig();
  };
  const renderModal=()=>{
    const t=words();button.textContent=t.open;modal.querySelector('#stageStudioTitle').textContent=t.title;modal.querySelector('.studio-hint').textContent=t.hint;modal.querySelector('.studio-section').textContent=t.types;
    const labels={square:t.square,arena:t.arena,thrust:t.thrust,tstage:t.tstage,runway:t.runway,bstage:t.bstage,dual:t.dual,custom:t.custom};modal.querySelectorAll('[data-shape]').forEach(x=>{x.querySelector('span').textContent=labels[x.dataset.shape];x.setAttribute('aria-label',labels[x.dataset.shape])});
    modal.querySelector('.studio-trace').textContent=t.trace;modal.querySelector('.studio-done').textContent=t.close;traceBar.querySelector('[data-trace-finish]').textContent=t.finish;traceBar.querySelector('[data-trace-undo]').textContent=t.undo;traceBar.querySelector('[data-trace-cancel]').textContent=t.cancel;
    modal.querySelectorAll('[data-shape]').forEach(x=>x.classList.toggle('active',x.dataset.shape===config.shape));
  };
  const open=()=>{renderModal();modal.classList.add('is-open');modal.setAttribute('aria-hidden','false')};
  const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true')};
  const paintTrace=()=>{
    let svg=stage.querySelector('.stage-trace-preview');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('stage-trace-preview');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');stage.append(svg)}
    svg.replaceChildren();if(!points.length)return;
    const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('points',points.map(p=>p.join(',')).join(' '));line.setAttribute('fill','rgba(232,65,83,.12)');line.setAttribute('stroke','#ff6877');line.setAttribute('stroke-width','.45');line.setAttribute('stroke-dasharray','1.2 .7');svg.append(line);
    points.forEach(([x,y])=>{const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','.8');dot.setAttribute('fill','#fff');dot.setAttribute('stroke','#e94858');dot.setAttribute('stroke-width','.35');svg.append(dot)});
  };
  const pointInside=(x,y,polygon)=>{
    let inside=false;
    for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
      const [xi,yi]=polygon[i],[xj,yj]=polygon[j];
      if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside;
    }
    return inside;
  };
  const gridCentersInsideOutline=polygon=>{
    const width=stage.offsetWidth,height=stage.offsetHeight;
    const grid=getComputedStyle(stage).backgroundSize.split(/\s+/);
    const cellX=parseFloat(grid[0])||20,cellY=parseFloat(grid[1])||cellX;
    const centers=[];
    for(let row=0;row*cellY+cellY/2<=height;row++)for(let column=0;column*cellX+cellX/2<=width;column++){
      const cx=(column*cellX+cellX/2)/width*100,cy=(row*cellY+cellY/2)/height*100;
      if(pointInside(cx,cy,polygon))centers.push([cx,cy]);
    }
    return centers;
  };
  const snapInsideOutline=(x,y,centers)=>{
    const width=stage.offsetWidth,height=stage.offsetHeight;
    const targetX=x*width/100,targetY=y*height/100;
    let best=null,bestDistance=Infinity;
    for(const [cx,cy] of centers){
      const px=cx*width/100,py=cy*height/100;
      const distance=(px-targetX)**2+(py-targetY)**2;
      if(distance<bestDistance){best=[cx,cy];bestDistance=distance}
    }
    return best||[x,y];
  };
  const centerOutline=polygon=>{
    const xs=polygon.map(point=>point[0]),ys=polygon.map(point=>point[1]),dx=50-(Math.min(...xs)+Math.max(...xs))/2,dy=50-(Math.min(...ys)+Math.max(...ys))/2;
    return polygon.map(([x,y])=>[+Math.max(0,Math.min(100,x+dx)).toFixed(2),+Math.max(0,Math.min(100,y+dy)).toFixed(2)]);
  };
  const fitFormationsToOutline=polygon=>{
    const gridCenters=gridCentersInsideOutline(polygon);
    const xs=polygon.map(point=>point[0]),ys=polygon.map(point=>point[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    let anchor=null,bestDistance=-1;
    for(let gy=0;gy<=28;gy++)for(let gx=0;gx<=28;gx++){
      const x=minX+(maxX-minX)*gx/28,y=minY+(maxY-minY)*gy/28;if(!pointInside(x,y,polygon))continue;
      let nearest=Infinity;
      for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
        const [ax,ay]=polygon[j],[bx,by]=polygon[i],dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));
        nearest=Math.min(nearest,Math.hypot(x-(ax+t*dx),y-(ay+t*dy)));
      }
      if(nearest>bestDistance){bestDistance=nearest;anchor=[x,y]}
    }
    if(!anchor)return;
    state.formations.forEach(formation=>{
      const dancers=formation.positions||[];if(!dancers.length)return;
      const avgX=dancers.reduce((sum,dancer)=>sum+dancer[0],0)/dancers.length,avgY=dancers.reduce((sum,dancer)=>sum+dancer[1],0)/dancers.length;
      let scale=1,placed=dancers.map(dancer=>[anchor[0]+dancer[0]-avgX,anchor[1]+dancer[1]-avgY]);
      const fits=positions=>positions.every(([x,y])=>pointInside(x,y,polygon));
      while(scale>0&&!fits(placed)){scale-=.025;placed=dancers.map(dancer=>[anchor[0]+(dancer[0]-avgX)*scale,anchor[1]+(dancer[1]-avgY)*scale])}
      dancers.forEach((dancer,index)=>{[dancer[0],dancer[1]]=snapInsideOutline(placed[index][0],placed[index][1],gridCenters)});
    });
  };
  const stopTrace=()=>{tracing=false;traceBar.classList.remove('is-visible');stage.querySelector('.stage-trace-preview')?.remove()};
  const beginTrace=()=>{close();tracing=true;points=[];traceBar.classList.add('is-visible');paintTrace()};
  button.addEventListener('click',open);modal.querySelector('.studio-close').onclick=modal.querySelector('.studio-done').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  modal.querySelectorAll('[data-shape]').forEach(item=>item.addEventListener('click',()=>{config.shape=item.dataset.shape;if(config.shape==='custom'&&config.points.length<3){beginTrace();return}apply();renderModal()}));
  modal.querySelector('.studio-trace').onclick=beginTrace;
  stage.addEventListener('pointerdown',e=>{if(!tracing)return;e.preventDefault();e.stopImmediatePropagation();const r=stage.getBoundingClientRect();points.push([+((e.clientX-r.left)/r.width*100).toFixed(2),+((e.clientY-r.top)/r.height*100).toFixed(2)]);paintTrace()},true);
  traceBar.querySelector('[data-trace-undo]').onclick=()=>{points.pop();paintTrace()};
  traceBar.querySelector('[data-trace-cancel]').onclick=stopTrace;
  traceBar.querySelector('[data-trace-finish]').onclick=()=>{if(points.length<3){alert(words().needPoints);return}config.shape='custom';config.points=centerOutline(points.map(p=>[...p]));fitFormationsToOutline(config.points);stopTrace();apply();renderStage();save()};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(tracing)stopTrace();else close()}});
  $('#languagePicker')?.addEventListener('change',renderModal);
  const style=document.createElement('style');style.textContent=`
    #openStageStudio{margin-left:4px!important;padding:4px 8px!important;border:1px solid #68404a!important;border-radius:7px!important;background:#291b20!important;color:#ffdce0!important;font-size:10px!important;white-space:nowrap}
    #stage{overflow:hidden}.custom-stage-outline{position:absolute;inset:0;z-index:4;width:100%;height:100%;overflow:visible;pointer-events:none}.custom-stage-outline path{fill:none;stroke:#ff6876;stroke-opacity:.74;stroke-width:1.1px;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;filter:drop-shadow(0 0 2px #ff435e55)}
    #stageStudio{position:fixed;inset:0;z-index:1500;display:grid;place-items:center;padding:18px;background:#080607d9;backdrop-filter:blur(7px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s,visibility .25s}
    #stageStudio.is-open{opacity:1;visibility:visible;pointer-events:auto}#stageStudio>section{position:relative;width:min(500px,100%);max-height:90vh;overflow:auto;padding:25px;border:1px solid #6a343d;border-radius:16px;background:linear-gradient(145deg,#241a1d,#141113);box-shadow:0 25px 70px #000b;transform:translateY(14px) scale(.98);transition:transform .28s cubic-bezier(.2,.8,.2,1)}#stageStudio.is-open>section{transform:none}
    #stageStudio h2{margin:0 36px 6px 0;color:#ff9299;font-size:20px}#stageStudio h3{margin:17px 0 9px;color:#f0dadd;font-size:12px}#stageStudio .studio-hint{margin:0;color:#ab969a;font-size:11px;line-height:1.5}.studio-close{position:absolute;right:13px;top:12px;width:31px;height:31px;padding:0;font-size:20px}.stage-shape-options{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.stage-shape-options button{display:grid;justify-items:center;gap:8px;min-height:76px;padding:10px 4px;border:1px solid #493036;background:#21191c;font-size:10px}.stage-shape-options button.active{border-color:#f05565;background:#3a2026;box-shadow:0 0 0 2px #f0556522}.shape-icon{display:block;width:37px;height:25px;border:2px solid #ef727c;background:#ef727c22}.oval-icon{border-radius:50%}.circle-icon{width:27px;height:27px;border-radius:50%}.arena-icon{clip-path:polygon(20% 0,80% 0,100% 25%,100% 75%,80% 100%,20% 100%,0 75%,0 25%)}.custom-icon{clip-path:polygon(0 30%,25% 0,70% 15%,100% 40%,78% 100%,28% 86%)}
    .studio-custom{margin-top:16px;padding:12px;border:1px solid #443036;border-radius:10px;background:#1b1517}.studio-trace{width:100%;background:#392127;border:1px solid #74404a}.studio-done{display:block;margin:15px 0 0 auto;min-width:90px;background:#8e2635;color:white}
    #stageTraceBar{position:absolute;z-index:40;top:9px;left:50%;display:none;gap:6px;transform:translateX(-50%);padding:6px;border:1px solid #75404a;border-radius:10px;background:#1b1417eF;box-shadow:0 6px 20px #0009}#stageTraceBar.is-visible{display:flex}#stageTraceBar button{padding:7px 9px;font-size:10px;white-space:nowrap}.stage-trace-preview{position:absolute;inset:0;z-index:35;width:100%;height:100%;pointer-events:none;overflow:visible}
    #stage[data-stage-shape="oval"],#stage[data-stage-shape="circle"]{border-color:#e86a77!important}#stage[data-stage-shape="arena"],#stage[data-stage-shape="custom"]{border-color:#e86a77!important}
    @media(max-width:600px){#openStageStudio{font-size:9px!important;padding:4px!important}.stage-shape-options{grid-template-columns:repeat(3,1fr)}#stageStudio>section{padding:20px}.stage-shape-options button{min-height:66px}#stageTraceBar button{padding:6px;font-size:9px}}
  `;style.textContent+=`.stage-shape-options{grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.stage-shape-options button{position:relative;align-content:center;gap:9px;min-height:88px;padding:10px 5px;border:1px solid #493036;border-radius:10px;background:linear-gradient(145deg,#251c20,#1b1518);transition:transform .2s,border-color .2s,background .2s,box-shadow .2s}.stage-shape-options button:hover{transform:translateY(-2px);border-color:#92505a;box-shadow:0 7px 17px #0005}.stage-shape-options button.active{border-color:#f05565;background:linear-gradient(145deg,#49252c,#2d1c20);box-shadow:0 0 0 2px #f0556522,0 7px 18px #0004}.stage-shape-options button.active:after{content:'✓';position:absolute;right:6px;top:5px;color:#ff9299;font-size:11px;font-weight:bold}.shape-icon{position:relative;width:48px;height:32px;border:1.7px solid #f06b79;background-color:#ed57621a;background-image:linear-gradient(#f079822c 1px,transparent 1px),linear-gradient(90deg,#f079822c 1px,transparent 1px);background-size:7px 7px;box-shadow:0 0 14px #e44b5714}.arena-icon{clip-path:polygon(19% 0,81% 0,100% 22%,100% 78%,81% 100%,19% 100%,0 78%,0 22%)}.thrust-icon{clip-path:polygon(0 0,100% 0,100% 72%,68% 72%,60% 100%,40% 100%,32% 72%,0 72%)}.tstage-icon{clip-path:polygon(0 0,100% 0,100% 34%,62% 34%,62% 100%,38% 100%,38% 34%,0 34%)}.runway-icon{clip-path:polygon(39% 0,61% 0,61% 70%,82% 70%,82% 100%,18% 100%,18% 70%,39% 70%)}.diamond-icon{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}.cross-icon{clip-path:polygon(35% 0,65% 0,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0 65%,0 35%,35% 35%)}.lstg-icon{clip-path:polygon(0 0,100% 0,100% 30%,32% 30%,32% 100%,0 100%)}.fan-icon{clip-path:polygon(30% 0,70% 0,100% 100%,0 100%)}.hexagon-icon{clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)}@media(max-width:600px){.stage-shape-options{grid-template-columns:repeat(3,minmax(0,1fr))}.stage-shape-options button{min-height:76px}}`;
  document.head.append(style);
  const concertStageIcons=document.createElement('style');concertStageIcons.textContent='.runway-icon{clip-path:polygon(0 0,100% 0,100% 22%,59% 22%,59% 78%,76% 78%,76% 100%,24% 100%,24% 78%,41% 78%,41% 22%,0 22%)}.bstage-icon{clip-path:polygon(0 0,100% 0,100% 22%,59% 22%,59% 78%,80% 78%,80% 100%,20% 100%,20% 78%,41% 78%,41% 22%,0 22%)}.dual-icon{clip-path:polygon(17% 0,83% 0,83% 22%,59% 22%,59% 78%,83% 78%,83% 100%,17% 100%,17% 78%,41% 78%,41% 22%,17% 22%)}';document.head.append(concertStageIcons);
  apply();
})();

// Replace the browser's native prompt when adding a song section.
(()=>{
  const trigger=$('#newPart');if(!trigger)return;
  const copy={
    en:{title:'Create a song section',description:'Give this part of the song a name.',label:'Section name',placeholder:'For example: Chorus',cancel:'Cancel',create:'Create section',required:'Enter a name for the section.'},
    es:{title:'Crear parte de la canción',description:'Escribe un nombre para esta parte.',label:'Nombre de la parte',placeholder:'Por ejemplo: Coro',cancel:'Cancelar',create:'Crear parte',required:'Escribe un nombre para la parte.'},
    ko:{title:'노래 구간 만들기',description:'이 노래 구간의 이름을 입력하세요.',label:'구간 이름',placeholder:'예: 후렴',cancel:'취소',create:'구간 만들기',required:'구간 이름을 입력하세요.'}
  };
  const language=()=>$('#languagePicker')?.value||localStorage.getItem('fx-dance-language')||'es',words=()=>copy[language()]||copy.es;
  const dialog=document.createElement('div');dialog.id='sectionNameDialog';dialog.setAttribute('aria-hidden','true');
  dialog.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="sectionNameTitle"><span class="section-dialog-icon">♫</span><button type="button" class="section-dialog-x" aria-label="Close">×</button><p class="section-dialog-kicker">FX · DANCE PLANNER</p><h2 id="sectionNameTitle"></h2><p class="section-dialog-description"></p><label><span class="section-dialog-label"></span><input type="text" maxlength="40" autocomplete="off"></label><p class="section-dialog-error" role="alert"></p><div class="section-dialog-actions"><button type="button" class="section-dialog-cancel"></button><button type="button" class="section-dialog-create"></button></div></section>';
  document.body.append(dialog);
  const input=dialog.querySelector('input'),error=dialog.querySelector('.section-dialog-error');let returnFocus=null;
  const paint=()=>{const t=words();dialog.querySelector('#sectionNameTitle').textContent=t.title;dialog.querySelector('.section-dialog-description').textContent=t.description;dialog.querySelector('.section-dialog-label').textContent=t.label;input.placeholder=t.placeholder;dialog.querySelector('.section-dialog-cancel').textContent=t.cancel;dialog.querySelector('.section-dialog-create').textContent=t.create;error.textContent=error.dataset.invalid==='true'?t.required:''};
  const close=()=>{dialog.classList.remove('is-open');dialog.setAttribute('aria-hidden','true');error.dataset.invalid='false';error.textContent='';if(returnFocus?.isConnected)returnFocus.focus()};
  const open=()=>{returnFocus=document.activeElement;paint();input.value='';dialog.classList.add('is-open');dialog.setAttribute('aria-hidden','false');setTimeout(()=>input.focus(),80)};
  const create=()=>{const name=input.value.trim();if(!name){error.dataset.invalid='true';error.textContent=words().required;input.focus();return}if(!state.songParts.includes(name))state.songParts.push(name);change(()=>f().section=name);renderParts();$('.part-picker').hidden=false;close()};
  const openHandler=event=>{event.preventDefault();open()};trigger.onclick=openHandler;
  setTimeout(()=>{trigger.onclick=openHandler},60);
  dialog.querySelector('.section-dialog-x').onclick=dialog.querySelector('.section-dialog-cancel').onclick=close;
  dialog.querySelector('.section-dialog-create').onclick=create;
  dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
  input.addEventListener('input',()=>{error.dataset.invalid='false';error.textContent=''});
  input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();create()}if(event.key==='Escape')close()});
  $('#languagePicker')?.addEventListener('change',paint);
  const style=document.createElement('style');style.textContent=`
    #sectionNameDialog{position:fixed;inset:0;z-index:1600;display:grid;place-items:center;padding:18px;background:#080607d9;backdrop-filter:blur(7px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .24s ease,visibility .24s}
    #sectionNameDialog.is-open{opacity:1;visibility:visible;pointer-events:auto}#sectionNameDialog>section{position:relative;width:min(430px,100%);padding:28px;border:1px solid #69363e;border-radius:16px;background:radial-gradient(ellipse at 12% 0,#3b1e24 0,transparent 55%),linear-gradient(145deg,#241a1d,#151213);box-shadow:0 24px 70px #000b;transform:translateY(14px) scale(.98);transition:transform .28s cubic-bezier(.2,.8,.2,1)}#sectionNameDialog.is-open>section{transform:none}
    .section-dialog-icon{display:grid;place-items:center;width:38px;height:38px;margin-bottom:13px;border:1px solid #75404a;border-radius:11px;background:#3a2026;color:#ff9299;font-size:19px}.section-dialog-kicker{margin:0 0 5px;color:#ff7b86;font-size:9px;font-weight:800;letter-spacing:1.7px}.section-dialog-x{position:absolute;right:14px;top:14px;width:30px;height:30px;padding:0;font-size:19px}.section-dialog-x:hover{transform:rotate(90deg)}#sectionNameTitle{margin:0 0 6px;color:#fff0f1;font-size:20px}.section-dialog-description{margin:0 0 20px;color:#b9a6a9;font-size:11px;line-height:1.5}#sectionNameDialog label{display:block;margin:0;color:#eadbdd;font-size:11px;font-weight:700}#sectionNameDialog input{display:block;width:100%;height:42px;margin-top:8px;padding:0 12px;border:1px solid #65404a;border-radius:8px;background:#171315;color:#fff;font-size:13px;outline:none;transition:border-color .18s,box-shadow .18s}#sectionNameDialog input:focus{border-color:#e45463;box-shadow:0 0 0 3px #e4546325}.section-dialog-error{min-height:15px;margin:5px 0 0;color:#ff858b;font-size:10px}.section-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:13px}.section-dialog-actions button{min-width:94px;padding:9px 12px}.section-dialog-create{background:linear-gradient(135deg,#bd3545,#842433);color:#fff;border:1px solid #dc5965}.section-dialog-cancel{background:#30272a;border:1px solid #514044}
    @media(prefers-reduced-motion:reduce){#sectionNameDialog,#sectionNameDialog>section,#sectionNameDialog input{transition-duration:.01ms!important}}
  `;document.head.append(style);
})();

// Branded, localized replacements for the remaining browser prompt/confirm boxes.
(()=>{
  const language=()=>$('#languagePicker')?.value||localStorage.getItem('fx-dance-language')||'es';
  const words={
    en:{cancel:'Cancel',confirm:'Confirm',create:'Create',save:'Save',delete:'Delete',newFormation:['Create a formation','Name this formation before adding it to the song.','Formation name','For example: Chorus formation'],renameFormation:['Rename formation','Choose a clear name for this formation.','Formation name','Formation name'],nickname:['Edit dancer nickname','Set the name shown on this dancer.','Dancer nickname','Nickname'],saveDance:['Save this dance','Give your choreography a name.','Dance name','My dance'],deleteFormation:['Delete this formation?','The selected formation will be removed.','',''],deleteDance:['Delete this dance?','“{name}” will be removed from My Dances.','',''],deleteAllFormations:['Delete all formations?','All formations and song sync links will be removed. One blank formation will remain.','',''],clearSync:['Clear all song links?','All links between song times and formations will be removed.','','']},
    es:{cancel:'Cancelar',confirm:'Confirmar',create:'Crear',save:'Guardar',delete:'Eliminar',newFormation:['Crear formación','Ponle nombre antes de agregarla a la canción.','Nombre de la formación','Por ejemplo: Formación del coro'],renameFormation:['Renombrar formación','Elige un nombre claro para esta formación.','Nombre de la formación','Nombre de la formación'],nickname:['Editar apodo del bailarín','Escribe el nombre que aparecerá en este bailarín.','Apodo del bailarín','Apodo'],saveDance:['Guardar este baile','Ponle un nombre a tu coreografía.','Nombre del baile','Mi baile'],deleteFormation:['¿Eliminar esta formación?','Se eliminará la formación seleccionada.','',''],deleteDance:['¿Eliminar este baile?','“{name}” se eliminará de Mis bailes.','',''],deleteAllFormations:['¿Eliminar todas las formaciones?','Se eliminarán las formaciones y sus sincronizaciones. Quedará una formación vacía.','',''],clearSync:['¿Borrar todas las sincronizaciones?','Se eliminarán todos los enlaces entre la canción y las formaciones.','','']},
    ko:{cancel:'취소',confirm:'확인',create:'만들기',save:'저장',delete:'삭제',newFormation:['포메이션 만들기','노래에 추가하기 전에 이름을 입력하세요.','포메이션 이름','예: 후렴 포메이션'],renameFormation:['포메이션 이름 변경','포메이션을 구분하기 쉬운 이름으로 지정하세요.','포메이션 이름','포메이션 이름'],nickname:['댄서 별명 편집','이 댄서에게 표시할 이름을 입력하세요.','댄서 별명','별명'],saveDance:['안무 저장','안무 이름을 입력하세요.','안무 이름','내 안무'],deleteFormation:['이 포메이션을 삭제할까요?','선택한 포메이션이 삭제됩니다.','',''],deleteDance:['이 안무를 삭제할까요?','“{name}”이(가) 내 안무에서 삭제됩니다.','',''],deleteAllFormations:['모든 포메이션을 삭제할까요?','모든 포메이션과 음악 동기화가 삭제되며 빈 포메이션 하나가 남습니다.','',''],clearSync:['모든 음악 연결을 지울까요?','음악과 포메이션 사이의 연결이 모두 삭제됩니다.','','']}
  };
  const getWords=()=>words[language()]||words.es;
  const dialog=document.createElement('div');dialog.id='fxDialog';dialog.setAttribute('aria-hidden','true');
  dialog.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="fxDialogTitle"><span class="fx-dialog-mark"></span><button type="button" class="fx-dialog-close" aria-label="Close">×</button><p class="fx-dialog-kicker">FX · DANCE PLANNER</p><h2 id="fxDialogTitle"></h2><p class="fx-dialog-copy"></p><label class="fx-dialog-field"><span></span><input type="text" maxlength="48" autocomplete="off"></label><p class="fx-dialog-error" role="alert"></p><div class="fx-dialog-actions"><button type="button" class="fx-dialog-cancel"></button><button type="button" class="fx-dialog-confirm"></button></div></section>';
  document.body.append(dialog);
  let pending=null,activeConfig=null;
  const finish=value=>{if(!pending)return;dialog.classList.remove('is-open');dialog.setAttribute('aria-hidden','true');const resolve=pending;pending=null;activeConfig=null;resolve(value)};
  const paint=()=>{
    if(!activeConfig)return;const t=getWords(),[title,body,label,placeholder]=t[activeConfig.key],input=dialog.querySelector('input'),isInput=activeConfig.kind==='input';
    dialog.querySelector('#fxDialogTitle').textContent=title;dialog.querySelector('.fx-dialog-copy').textContent=body.replace('{name}',activeConfig.name||'');
    const field=dialog.querySelector('.fx-dialog-field');field.hidden=!isInput;field.querySelector('span').textContent=label;input.placeholder=placeholder;input.value=activeConfig.value||'';
    dialog.querySelector('.fx-dialog-mark').textContent=isInput?'♫':'!';dialog.querySelector('.fx-dialog-error').textContent='';dialog.querySelector('.fx-dialog-cancel').textContent=t.cancel;
    const confirm=dialog.querySelector('.fx-dialog-confirm');confirm.textContent=isInput?(activeConfig.key==='saveDance'?t.save:t.create):(activeConfig.key.startsWith('delete')||activeConfig.key==='clearSync'?t.delete:t.confirm);confirm.classList.toggle('danger',!isInput&&(activeConfig.key.startsWith('delete')||activeConfig.key==='clearSync'));
  };
  const ask=(key,options={})=>new Promise(resolve=>{
    if(pending)finish(null);activeConfig={key,kind:options.kind||'confirm',name:options.name||'',value:options.value||''};pending=resolve;paint();dialog.classList.add('is-open');dialog.setAttribute('aria-hidden','false');
    setTimeout(()=>{const target=activeConfig?.kind==='input'?dialog.querySelector('input'):dialog.querySelector('.fx-dialog-confirm');target?.focus();if(target?.select)target.select()},80);
  });
  const input=dialog.querySelector('input');
  dialog.querySelector('.fx-dialog-close').onclick=dialog.querySelector('.fx-dialog-cancel').onclick=()=>finish(null);
  dialog.querySelector('.fx-dialog-confirm').onclick=()=>finish(activeConfig?.kind==='input'?input.value:true);
  dialog.addEventListener('click',event=>{if(event.target===dialog)finish(null)});
  input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();finish(input.value)}if(event.key==='Escape')finish(null)});
  document.addEventListener('keydown',event=>{if(dialog.classList.contains('is-open')&&event.key==='Escape')finish(null)});
  $('#languagePicker')?.addEventListener('change',paint);
  window.fxAsk=ask;
  document.addEventListener('click',async event=>{
    if(!(event.target instanceof Element))return;
    const button=event.target.closest('#renameFormation,#removeFormation,#newFormation,#editNickname,#saveDance,#clearAllSync');if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(button.id==='renameFormation'){const name=await ask('renameFormation',{kind:'input',value:f().name});if(name!==null&&name.trim())change(()=>f().name=name.trim());return}
    if(button.id==='removeFormation'){if(state.formations.length>1&&await ask('deleteFormation'))change(()=>{state.formations.splice(state.current,1);state.current=0});return}
    if(button.id==='newFormation'){const lang=language(),name=await ask('newFormation',{kind:'input',value:lang==='en'?'New formation':lang==='ko'?'새 포메이션':'Nueva formación'});if(name===null||!name.trim())return;const section=$('#partSelect').value||'Intro';change(()=>{const next=JSON.parse(JSON.stringify(f()));next.name=name.trim();next.section=section;state.formations.push(next);state.current=state.formations.length-1});decorateFormations();return}
    if(button.id==='editNickname'){const name=await ask('nickname',{kind:'input',value:p()[selected]?.[4]||''});if(name!==null)change(()=>p()[selected][4]=name.trim());showNicknames();return}
    if(button.id==='saveDance'){const lang=language(),name=await ask('saveDance',{kind:'input',value:state.name||(lang==='en'?'My dance':lang==='ko'?'내 안무':'Mi baile')});if(name===null||!name.trim())return;state.name=name.trim();$('#projectName').value=state.name;saveDance(state.name);return}
    if(button.id==='clearAllSync'&&state.audioMarkers?.length&&await ask('clearSync')){state.audioMarkers=[];save();draw();$('#activeSyncFormation').textContent='Active formation: —'}
  },true);
  $('#danceList').addEventListener('click',async event=>{const button=event.target.closest('[data-delete-dance]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();const name=button.dataset.deleteDance;if(await ask('deleteDance',{name})){localStorage.removeItem(danceKey+name);drawDances()}},true);
  document.addEventListener('click',async event=>{const button=event.target.closest('[data-delete-all]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();if(state.formations.length<2||!await ask('deleteAllFormations'))return;change(()=>{const fresh=JSON.parse(JSON.stringify(state.formations[0]));fresh.name='Formation 1';delete fresh.id;delete fresh.routes;state.formations=[fresh];state.current=0;state.audioMarkers=[]})},true);
  const style=document.createElement('style');style.textContent=`
    #fxDialog{position:fixed;inset:0;z-index:1700;display:grid;place-items:center;padding:18px;background:#080607d9;backdrop-filter:blur(8px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .24s ease,visibility .24s}
    #fxDialog.is-open{opacity:1;visibility:visible;pointer-events:auto}#fxDialog>section{position:relative;width:min(455px,100%);max-height:90vh;overflow:auto;padding:27px;border:1px solid #69363e;border-radius:16px;background:radial-gradient(ellipse at 12% 0,#3b1e24 0,transparent 55%),linear-gradient(145deg,#241a1d,#151213);box-shadow:0 25px 76px #000c;transform:translateY(16px) scale(.98);transition:transform .3s cubic-bezier(.2,.8,.2,1)}#fxDialog.is-open>section{transform:none}
    .fx-dialog-mark{display:grid;place-items:center;width:38px;height:38px;margin-bottom:13px;border:1px solid #75404a;border-radius:11px;background:#3a2026;color:#ff9299;font-size:18px;font-weight:bold}.fx-dialog-kicker{margin:0 0 5px;color:#ff7b86;font-size:9px;font-weight:800;letter-spacing:1.7px}#fxDialogTitle{margin:0 36px 7px 0;color:#fff0f1;font-size:20px}.fx-dialog-copy{margin:0 0 19px;color:#b9a6a9;font-size:11px;line-height:1.55}.fx-dialog-close{position:absolute;right:14px;top:14px;width:30px;height:30px;padding:0;font-size:19px}.fx-dialog-field{display:block;margin:0!important;color:#eadbdd!important;font-size:11px!important;font-weight:700}.fx-dialog-field[hidden]{display:none!important}.fx-dialog-field input{display:block;width:100%;height:42px;margin-top:8px;padding:0 12px;border:1px solid #65404a;border-radius:8px;background:#171315;color:#fff;font-size:13px;outline:none;transition:border-color .18s,box-shadow .18s}.fx-dialog-field input:focus{border-color:#e45463;box-shadow:0 0 0 3px #e4546325}.fx-dialog-error{min-height:8px;margin:4px 0 0;color:#ff858b;font-size:10px}.fx-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:13px}.fx-dialog-actions button{min-width:94px;padding:9px 12px}.fx-dialog-confirm{background:linear-gradient(135deg,#bd3545,#842433);color:#fff;border:1px solid #dc5965}.fx-dialog-confirm.danger{background:linear-gradient(135deg,#b32e3d,#70202d)}.fx-dialog-cancel{background:#30272a;border:1px solid #514044}
    @media(prefers-reduced-motion:reduce){#fxDialog,#fxDialog>section,#fxDialog .fx-dialog-field input{transition-duration:.01ms!important}}
  `;document.head.append(style);
})();
