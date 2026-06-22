function predict(){

const predictions = [

"Tomorrow you will spend 2 hours debugging a missing bracket.",

"You will accidentally fix a bug while trying to create another feature.",

"A mysterious console.log() will save your project.",

"You will discover a bug that existed for months.",

"You will write code that works on the first try.",

"You will rename a variable and break everything.",

"You will become best friends with Stack Overflow today.",

"You will solve a problem after taking a tea break."

];

const future =
predictions[Math.floor(Math.random()*predictions.length)];

document.getElementById("future").innerHTML =
`✨ ${future}`;

}