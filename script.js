/* =======================
   1. 건물 정보
======================= */
const BUILDINGS = [
    { id: "pin-swict",  name: "소웨관/미센" },
    { id: "pin-biz",    name: "인상사" },
    { id: "pin-human",  name: "미술관" },
    { id: "pin-law",    name: "법학관" },
    { id: "pin-plaza",  name: "평화의광장" },
    { id: "pin-inter",  name: "국제관" },
    { id: "pin-nochun", name: "노천마당" },
    { id: "pin-lab",    name: "종합실험동" },
    { id: "pin-eng3",   name: "공학관" },
    { id: "pin-social", name: "사회과학관" },
    { id: "pin-dent",   name: "치과병원" },
    { id: "pin-lib",    name: "중앙도서관" },
    { id: "pin-art",    name: "혜당관" },
    { id: "pin-gym",    name: "체육관" },
    { id: "pin-field",  name: "대운동장" }
];

const pageName = window.location.pathname.split("/").pop() || "index.html";


/* ========================================================
   A. 메인 지도 페이지 (index.html)
======================================================== */
if (pageName === "index.html") {

    function updatePins() {
        let items = JSON.parse(localStorage.getItem("lostItems") || "[]");
        const counts = {};

        items.forEach(i => {
            counts[i.building] = (counts[i.building] || 0) + 1;
        });

        BUILDINGS.forEach(b => {
            const pin = document.getElementById(b.id);
            if (pin) pin.textContent = counts[b.name] || 0;
        });
    }

    updatePins();

    document.querySelectorAll(".pin").forEach(pin => {
        pin.addEventListener("click", () => {
            const building = pin.dataset.building;
            window.location.href = `list.html?building=${encodeURIComponent(building)}`;
        });
    });
}



/* ========================================================
   B. 목록 페이지 (list.html)
======================================================== */
if (pageName === "list.html") {

    const params = new URLSearchParams(window.location.search);
    const building = params.get("building");
    const container = document.getElementById("list-container");

    if (!building) {
        container.innerHTML = "<p>잘못된 접근입니다.</p>";
    } else {
        document.getElementById("building-title").innerText = `${building} 분실물 목록`;

        let items = JSON.parse(localStorage.getItem("lostItems") || "[]");
        const filtered = items.filter(i => i.building === building);

        if (filtered.length === 0) {
            container.innerHTML = "<p>분실물이 없습니다.</p>";
        } else {
            let html = "";
            filtered.reverse().forEach(i => {
                const date = new Date(i.createdAt).toLocaleDateString();

               html += `
    <div class="item-card" style="
        border:1px solid #ddd;
        margin:10px;
        padding:10px;
        border-radius:8px;
        background:#fff;">

        ${i.image ? `<img src="${i.image}" style="width:120px; border-radius:8px; margin-bottom:8px;">` : ""}

        <h3>${i.desc}</h3>
        <p>장소: ${i.building}</p>
        <p>날짜: ${date}</p>
    </div>
`;

            });

            container.innerHTML = html;
        }
    }
}



/* ========================================================
   C. 등록 페이지 (register.html)
======================================================== */
if (pageName === "register.html") {

    const form = document.getElementById("lostForm");
    const fileInput = document.getElementById("imageInput");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const building = document.getElementById("building-select").value;
        const desc = document.getElementById("desc").value;

        if (!building || !desc) {
            alert("장소와 설명을 모두 입력해주세요!");
            return;
        }

        // 이미지 파일을 base64로 변환하기
        function convertToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // 이미지가 업로드된 경우 base64로 변환
        let imageBase64 = "";

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            convertToBase64(file).then(base64 => {
                imageBase64 = base64;

                saveData();
            });
        } else {
            saveData();
        }

        function saveData() {
            const newItem = {
                building,
                desc,
                image: imageBase64,   // base64 저장
                createdAt: new Date().toISOString()
            };

            let items = JSON.parse(localStorage.getItem("lostItems") || "[]");
            items.push(newItem);
            localStorage.setItem("lostItems", JSON.stringify(items));

            alert("등록이 완료되었습니다!");
            window.location.href = "index.html";
        }
    });
}
