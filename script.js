let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let done = JSON.parse(localStorage.getItem("done")) || 0;
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];

function toggleTheme(){
  document.body.classList.toggle("light");
}

/* TASKS */
function addTask(){
  const input = document.getElementById("taskInput");
  if(!input.value) return;
  tasks.push(input.value);
  localStorage.setItem("tasks",JSON.stringify(tasks));
  input.value="";
  renderTasks();
}

function renderTasks(){
  const ul = document.getElementById("taskList");
  ul.innerHTML="";
  tasks.forEach((t,i)=>{
    ul.innerHTML+=`
      <li>${t}<button onclick="finishTask(${i})">✔</button></li>
    `;
  });
  document.getElementById("taskCount").innerText = tasks.length;
  document.getElementById("doneCount").innerText = done;
}

function finishTask(i){
  tasks.splice(i,1);
  done++;
  localStorage.setItem("tasks",JSON.stringify(tasks));
  localStorage.setItem("done",done);
  renderTasks();
}

/* TIMER */
let sec=0, interval=null;

function startTimer(){
  if(interval) return;
  interval=setInterval(()=>{
    sec++;
    let m=Math.floor(sec/60);
    let s=sec%60;
    document.getElementById("timer").innerText =
      String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  },1000);
}

function stopTimer(){
  clearInterval(interval);
  interval=null;
  let mins=Math.floor(sec/60);
  if(mins>0){
    sessions.push({date:new Date().toDateString(),min:mins});
    localStorage.setItem("sessions",JSON.stringify(sessions));
  }
  sec=0;
  document.getElementById("timer").innerText="00:00";
  renderHistory();
  drawChart();
}

/* HISTORY */
function renderHistory(){
  const tb=document.getElementById("historyTable");
  tb.innerHTML="";
  let total=0;
  sessions.forEach(s=>{
    total+=s.min;
    tb.innerHTML+=`<tr><td>${s.date}</td><td>${s.min}</td></tr>`;
  });
  document.getElementById("totalMinutes").innerText=total+"m";
}

/* CLEAR */
function clearHistory(){
  if(!confirm("Clear all data?")) return;
  sessions=[];
  localStorage.removeItem("sessions");
  renderHistory();
  drawChart();
}

/* LINE CHART */
function drawChart(){
  const canvas=document.getElementById("lineChart");
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  let data=[0,0,0,0,0,0,0];

  sessions.forEach(s=>{
    let d=new Date(s.date).getDay();
    data[(d+6)%7]+=s.min;
  });

  const max=Math.max(...data,10);
  const step=canvas.width/6;

  ctx.strokeStyle="#3b82f6";
  ctx.lineWidth=3;
  ctx.beginPath();

  data.forEach((v,i)=>{
    let x=i*step+10;
    let y=canvas.height-(v/max)*(canvas.height-40)-20;
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });

  ctx.stroke();

  ctx.fillStyle="#e5e7eb";
  data.forEach((v,i)=>{
    let x=i*step+10;
    let y=canvas.height-(v/max)*(canvas.height-40)-20;
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fill();
    ctx.fillText(days[i],x-10,canvas.height-5);
  });
}

/* INIT */
renderTasks();
renderHistory();
drawChart();

