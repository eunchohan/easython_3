const API_BASE = "http://localhost:3000";

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
   A. index.html (핀 개수 표시)
======================================================== */
if (pageName === "index.html") {

    async function loadCounts() {
        try {
            const res = await fetch(`${API_BASE}/api/buildings`);
            const data = await res.json();

            const counts = {};
            data.forEach(row => counts[row.building] = row.count);

            BUILDINGS.forEach(b => {
                const pin = document.getElementById(b.id);
                if (pin) pin.textContent = counts[b.name] || 0;
            });
        } catch (err) {
            console.error("핀 개수 불러오기 실패:", err);
        }
    }

    loadCounts();

    document.querySelectorAll(".pin").forEach(pin => {
        pin.addEventListener("click", () => {
            const building = pin.dataset.building;
            window.location.href = `list.html?building=${encodeURIComponent(building)}`;
        });
    });
}



/* ========================================================
   B. list.html (목록 출력 + 사진)
======================================================== */
if (pageName === "list.html") {

    const params = new URLSearchParams(window.location.search);
    const building = params.get("building");
    const container = document.getElementById("list-container");

    if (!building) {
        container.innerHTML = "<p>잘못된 접근입니다.</p>";
    } else {
        document.getElementById("building-title").innerText = `${building} 분실물 목록`;

        async function loadList() {
            try {
                const res = await fetch(`${API_BASE}/api/items?building=${encodeURIComponent(building)}`);
                const items = await res.json();

                if (items.length === 0) {
                    container.innerHTML = "<p>분실물이 없습니다.</p>";
                    return;
                }

                let html = "";
                items.forEach(i => {
                    const date = new Date(i.createdAt).toLocaleDateString();

                    html += `
                        <div class="item-card" style="
                            border:1px solid #ddd;
                            margin:10px;
                            padding:10px;
                            border-radius:8px;
                            background:#fff;">

                            ${i.image ? `<img src="${i.image}" style="width:120px; border-radius:8px; margin-bottom:8px;">` : ""}

                            <h3>${i.description}</h3>
                            <p>장소: ${i.building}</p>
                            <p>날짜: ${date}</p>
                        </div>
                    `;
                });

                container.innerHTML = html;

            } catch (err) {
                console.error("목록 불러오기 실패:", err);
            }
        }

        loadList();
    }
}



/* ========================================================
   C. register.html (등록하기)
======================================================== */
if (pageName === "register.html") {

    const form = document.getElementById("lostForm");
    const fileInput = document.getElementById("imageInput");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const building = document.getElementById("building-select").value;
        const description = document.getElementById("desc").value;

        if (!building || !description) {
            alert("장소와 설명을 모두 입력해주세요!");
            return;
        }

        let imageBase64 = "";

        function convertToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        if (fileInput.files.length > 0) {
            convertToBase64(fileInput.files[0]).then(base64 => {
                imageBase64 = base64;
                saveData();
            });
        } else {
            saveData();
        }

        function saveData() {
            fetch(`${API_BASE}/api/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ building, description, image: imageBase64 })
            })
            .then(res => {
                if (!res.ok) throw new Error("등록 실패");
                return res.json();
            })
            .then(() => {
                alert("등록 성공!");
                window.location.href = "index.html";
            })
            .catch(err => {
                console.error("등록 실패:", err);
            });
        }
    });
}
