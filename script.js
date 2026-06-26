const searchInput = document.getElementById("searchInput");

const cards = document.querySelectorAll(".game-card");

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    cards.forEach(card => {

        const text = card.dataset.name.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});

const buttons = document.querySelectorAll(".filter-btn");

buttons.forEach(button => {

button.addEventListener("click", ()=>{

buttons.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

const filter = button.dataset.filter;

cards.forEach(card=>{

const category = card.dataset.category;

if(filter==="all" || category.includes(filter)){

card.style.display="block";

}

else{

card.style.display="none";

}

});

});

});

const themeButton = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light");

    themeButton.textContent = "☀️";

}

themeButton.addEventListener("click", ()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

        themeButton.textContent="☀️";

    }

    else{

        localStorage.setItem("theme","dark");

        themeButton.textContent="🌙";

    }

});