import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbckBxe5vTBwYTD0u2ywObA_CUB-09juw",
    authDomain: "weding-5e885.firebaseapp.com",
    projectId: "weding-5e885",
    storageBucket: "weding-5e885.firebasestorage.app",
    messagingSenderId: "988379230514",
    appId: "1:988379230514:web:270458bdcd2c5d6402272b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const APP_ID = "weding-5e885";

let currentUser = null;

let wishes = [];
let currentWishIndex = 0;
let rotationStarted = false;

const form = document.getElementById("toast-form");

const wall = document.getElementById("wishes-wall");

const redBar = document.getElementById("red-team-bar");

const blueBar = document.getElementById("blue-team-bar");

const clash = document.getElementById("clash-point");

// ----------------------
// Авторизация
// ----------------------

signInAnonymously(auth)
    .then(() => {
        console.log("Firebase подключен");
    })
    .catch((error) => {
        console.error(error);
        alert("Ошибка подключения Firebase");
    });

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    currentUser = user;

    console.log("Пользователь:", user.uid);

    subscribeToWishes();

});

// ----------------------
// Подписка на Firestore
// ----------------------

function subscribeToWishes() {

    const wishesRef = collection(
        db,
        "artifacts",
        APP_ID,
        "public",
        "data",
        "wishes"
    );

    onSnapshot(wishesRef, (snapshot) => {

        wishes = [];

        snapshot.forEach((doc) => {

            wishes.push({
                id: doc.id,
                ...doc.data()
            });

        });

        wishes.sort((a, b) => {

            const t1 = a.timestamp?.seconds || 0;
            const t2 = b.timestamp?.seconds || 0;

            return t2 - t1;

        });

        renderWishes();

        updateBattle();

    });

}
// ----------------------
// Отправка формы
// ----------------------

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
        document.getElementById("guest-name").value.trim();

    const relation =
        document.getElementById("guest-relation").value.trim();

    const wish =
        document.getElementById("guest-wish").value.trim();

    if (!name || !relation || !wish)
        return;

    let side = "blue";

    const text = relation.toLowerCase();

    if (
        text.includes("арлан") ||
        text.includes("жених") ||
        text.includes("друг жениха") ||
        text.includes("брат жениха")
    ) {

        side = "red";

    }

    await addDoc(

        collection(
            db,
            "artifacts",
            APP_ID,
            "public",
            "data",
            "wishes"
        ),

        {

            name,
            relation,
            wish,
            side,

            uid: currentUser.uid,

            timestamp: serverTimestamp()

        }

    );

    form.reset();

});
// =====================================
// Обновление битвы сторон
// =====================================

function updateBattle() {

    let red = 0;
    let blue = 0;

    wishes.forEach(w => {

        if (w.side === "red") red++;
        else blue++;

    });

    const total = red + blue;

    const redPercentValue =
        total === 0 ? 50 : (red / total) * 100;

    const bluePercentValue = 100 - redPercentValue;


    redBar.style.width =
        redPercentValue + "%";

    blueBar.style.width =
        bluePercentValue + "%";

    clash.style.left =
        redPercentValue + "%";

    // Запускаем анимацию столкновения
    clashEffect();

   if (red > blue) {
    createLightning(8);
}

if (blue > red) {
    createHearts(10);
}

}
// =====================================
// Стена пожеланий
// =====================================

function renderWishes(){

    if(wishes.length===0){

        wall.innerHTML=`
            <div style="text-align:center;padding:50px;color:#999;">
                Пока поздравлений нет
            </div>
        `;

        return;
    }

    showWish(currentWishIndex);

    if(!rotationStarted){

        rotationStarted=true;

        setInterval(()=>{

            currentWishIndex++;

            if(currentWishIndex>=wishes.length){

                currentWishIndex=0;

            }

            showWish(currentWishIndex);

        },10000);

    }

}

function showWish(index){

    const w = wishes[index];

    wall.innerHTML = `
        <div class="wish-card">

            <h2>${w.side==="red" ? "🔴" : "🔵"} ${w.name}</h2>

            <small>${w.relation}</small>

            <p>${w.wish}</p>

        </div>
    `;

}

 

// =====================================
// ❤️ Сердечки
// =====================================

const blueParticles =
document.getElementById("blue-particles");

function createHearts(count = 5){

    for(let i=0;i<count;i++){

        const heart=document.createElement("div");

        heart.innerHTML="❤️";

        heart.style.position="absolute";

        heart.style.left=(55+Math.random()*40)+"%";

        heart.style.bottom="-20px";

        heart.style.fontSize=(12+Math.random()*22)+"px";

        heart.style.opacity=.9;

        heart.style.pointerEvents="none";

        heart.style.transition="all 5s linear";

        heart.style.transform=`translateX(${Math.random()*60-30}px)`;

        blueParticles.appendChild(heart);

        requestAnimationFrame(()=>{

            heart.style.bottom="220px";

            heart.style.left=(55+Math.random()*40)+"%";

            heart.style.opacity=0;

            heart.style.transform=
                `translateX(${Math.random()*200-100}px)
                 rotate(${Math.random()*360}deg)
                 scale(${1+Math.random()})`;

        });

        setTimeout(()=>{

            heart.remove();

        },5000);

    }

}
// =====================================
// ⚡ Молнии
// =====================================

const redParticles =
document.getElementById("red-particles");

function createLightning(count=5){

    for(let i=0;i<count;i++){

        const bolt=document.createElement("div");

        bolt.innerHTML="⚡";

        bolt.style.position="absolute";

        bolt.style.left=(Math.random()*45)+"%";

        bolt.style.top=(Math.random()*160)+"px";

        bolt.style.fontSize=(16+Math.random()*20)+"px";

        bolt.style.opacity=1;

        bolt.style.pointerEvents="none";

        bolt.style.transition="all .8s ease";

        redParticles.appendChild(bolt);

        requestAnimationFrame(()=>{

            bolt.style.transform=
                `translate(
                ${Math.random()*120-60}px,
                ${Math.random()*120-60}px)
                rotate(${Math.random()*360}deg)
                scale(2)`;

            bolt.style.opacity=0;

        });

        setTimeout(()=>{

            bolt.remove();

        },800);

    }

}
// =====================================
// Автоанимация
// =====================================

setInterval(() => {

    createHearts(2);

}, 700);

setInterval(() => {

    createLightning(2);

}, 900);
// =====================================
// Эффект столкновения
// =====================================

function clashEffect(){

    clash.animate(

        [

            {
                transform:"translateX(-50%) scaleX(1)"
            },

            {
                transform:"translateX(-50%) scaleX(1.7)"
            },

            {
                transform:"translateX(-50%) scaleX(1)"
            }

        ],

        {

            duration:450,

            easing:"ease-out"

        }

    );

}