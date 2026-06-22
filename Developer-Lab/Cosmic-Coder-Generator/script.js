function generateCoder(){

const names = [
"Quantum Debugger",
"Nebula Hacker",
"Cosmic Architect",
"Galaxy Coder",
"Stellar Developer"
];

const planets = [
"Reacton-7",
"Java Prime",
"Node Galaxy",
"Python X",
"CodeVerse"
];

const powers = [
"Fix bugs instantly",
"Reads code at light speed",
"Masters recursion",
"Creates perfect UI",
"Finds hidden errors"
];

const weakness = [
"Missing semicolons",
"Merge conflicts",
"Undefined variables",
"Infinite loops",
"Forgotten passwords"
];

const name =
names[Math.floor(Math.random()*names.length)];

const planet =
planets[Math.floor(Math.random()*planets.length)];

const power =
powers[Math.floor(Math.random()*powers.length)];

const weak =
weakness[Math.floor(Math.random()*weakness.length)];

document.getElementById("result").innerHTML = `
🌟 Name: ${name}<br>
🪐 Planet: ${planet}<br>
⚡ Power: ${power}<br>
☠ Weakness: ${weak}
`;

}