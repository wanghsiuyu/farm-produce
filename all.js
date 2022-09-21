// 取得 json 資料
let data = [];
function getData() {
  axios
    .get("https://hexschool.github.io/js-filter-data/data.json")
    .then((response) => {
      // 將不完整的資料過濾掉
      data = response.data.filter((item) => item.上價 !== 0);
      data = data.filter((item) => item.種類代碼 && item.作物名稱);
      renderData(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
getData();

// 資料渲染
const showList = document.querySelector(`.showList`);
function renderData(showData) {
  let str = "";
  showData.forEach((item) => {
    str += `<tr>
      <td width="15%">${item.作物名稱}</td>
      <td width="15%">${item.市場名稱}</td>
      <td width="15%">${item.上價}</td>
      <td width="15%">${item.中價}</td>
      <td width="15%">${item.下價}</td>
      <td width="15%">${item.平均價}</td>
      <td width="15%">${item.交易量}</td>
    </tr>`;
  });
  showList.innerHTML = str;
}

// 蔬果/水果/花卉按鈕
const buttonGroup = document.querySelector(`.button-group`);
buttonGroup.addEventListener("click", (e) => {
  // 先取消所有按鈕 active 狀態
  if (e.target.nodeName === "BUTTON") {
    let tabs = document.querySelectorAll(`.button-group button`);
    tabs.forEach((item) => {
      item.classList.remove("active");
    });
  }
  // 不同按鈕的資料篩選
  let filterData = [];
  let type = e.target.getAttribute("data-type");
  data.forEach((item) => {
    if (type === item.種類代碼) {
      filterData = data.filter((item) => item.種類代碼 === type);
      e.target.classList.add("active"); // 黃色按鈕 active 狀態
    }
  });
  renderData(filterData);
});

// 搜尋
const searchBtn = document.querySelector(`.search`);
const cropTxt = document.querySelector(`#crop`);
searchBtn.addEventListener("click", (e) => {
  if (cropTxt.value.trim() === "") {
    alert("請輸入作物名稱");
    return;
  }
  let searchData = [];
  searchData = data.filter((item) => item.作物名稱.match(cropTxt.value.trim()));
  if (searchData.length === 0) {
    showList.innerHTML = `
    <tr><td colspan="7" class="text-center p-3">查詢不到當日的交易資訊QQ</td></tr>`;
  } else {
    renderData(searchData);
  }
  cropTxt.value = "";
});

// 下拉選單排序（僅針對全部資料來排序）
const selectBtn = document.querySelector(`#js-select`);
const selectBtnMobile = document.querySelector(`#js-mobile-select`);
selectBtn.addEventListener("change", (e) => {
  switch (e.target.value) {
    case "依上價排序":
      selectSort("上價");
      break;
    case "依中價排序":
      selectSort("中價");
      break;
    case "依下價排序":
      selectSort("下價");
      break;
    case "依平均價排序":
      selectSort("平均價");
      break;
    case "依交易量排序":
      selectSort("交易量");
      break;
  }
});
selectBtnMobile.addEventListener("change", (e) => {
  switch (e.target.value) {
    case "上價":
      selectSort("上價");
      break;
    case "中價":
      selectSort("中價");
      break;
    case "下價":
      selectSort("下價");
      break;
    case "平均價":
      selectSort("平均價");
      break;
    case "交易量":
      selectSort("交易量");
      break;
  }
});
function selectSort(value) {
  data.sort((a, b) => {
    return a[value] - b[value];
  });
  renderData(data);
}

// 依小箭頭進階排序（僅針對全部資料來排序）
const sortAdvanced = document.querySelector(`.js-sort-advanced`);
sortAdvanced.addEventListener("click", (e) => {
  if (e.target.nodeName === "I") {
    let sortPrice = e.target.dataset.price;
    let sortCaret = e.target.dataset.sort;
    if (sortCaret === "up") {
      data.sort((a, b) => {
        return b[sortPrice] - a[sortPrice];
      });
    } else {
      data.sort((a, b) => {
        return a[sortPrice] - b[sortPrice];
      });
    }
  }
  renderData(data);
});
