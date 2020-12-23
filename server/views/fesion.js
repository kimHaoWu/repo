// bootstrap弹窗样式
function myModal(obj) {
  let div = document.createElement('div'),
    html = `<div class="modalWrap"><div class="modal-dialog">
  <div class="modal-content">
      <!-- 模态框头部 -->
      <div class="modal-header">
          <h4 class="modal-title"></h4>
      </div>

      <!-- 模态框主体 -->
      <div class="modal-body">
        
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
      <button type="button" class="btn done" data-dismiss="modal">确定</button>
      <button type="button" class="btn cancel" data-dismiss="modal">关闭</button>
      </div>

  </div>
  </div>
</div>`;
  div.className = "modal modal-mobile";
  div.id = "myModal";
  div.innerHTML = html;
  document.body.appendChild(div);
  $('#myModal .modal-title').html(obj.title);
  $('#myModal .modal-body').html(obj.content);
  $('#myModal .modal-footer').html(obj.footer);
  $('#myModal').modal('show');
  $('#myModal .modal-dialog').click(function (e) {
    e.stopPropagation();
  })

  $('#myModal .modalWrap').click(function (e) {
    e.stopPropagation();
  })
  $('#myModal .done').click(function () {
    obj.doneCallBack();
    close();
  })
  $('#myModal .cancel').click(function () {
    obj.cancelCallBack();
    close();
  })

  function close() {
    $('#myModal').remove();
    $('.modal-backdrop').remove();
  }

}

//input type=date 日期的提示清除
$(document).on("input", "input[name='time']", function () {
  if ($(this).val().length > 0) {
    $(this).addClass("full");
  } else {
    $(this).removeClass("full");
  }
});

// 评价
// (function () {
//   document.addEventListener('click', function (e) {
//     let ev = e || window.event;
//     let evobj = ev.target || ev.srcElement;
//     let rate = evobj.parentNode.parentNode;
//     let items = rate.getElementsByClassName('rate_item')
//     if (rate.getAttribute('data-readonly') == "true") {
//       return false;
//     } else {
//       if (evobj.classList.contains('rate_icon')) {
//         for (let i = 0; i < items.length; i++) {
//           if (evobj == items[i].getElementsByClassName('rate_icon')[0]) {
//             rate.setAttribute('data-value', i + 1);
//           }
//         }
//         let count = parseInt(rate.getAttribute('data-value'))
//         for (let i = 0; i < items.length; i++) {
//           if (i < count) {
//             items[i].getElementsByClassName('rate_icon')[0].classList.add('active')
//           } else {
//             items[i].getElementsByClassName('rate_icon')[0].classList.remove('active')
//           }
//         }
//       }
//     }

//   }, false)
// }())


var Fesion = {
  autoTips: function (obj) {
    // 生成弹窗
    let div = document.createElement('div'),
      html = `<div class="autoTips"><div class="modal-dialog">
      <div class="modal-content" style="height:100vh;background:#f8f8f8;">
      <!-- 模态框头部 -->
      <div class="modal-header">
      <div class="input-group input-group-search" style="margin:10px;border-radius:15px;overflow:hidden;background:#fff;border:1px solid #ddd;">
      <input type="text"  id="input"  placeholder="请输入订单号" class="form-control">
      <div class="input-group-prepend">
      <button class="btn" id="confirmBtn">确定</button>
  </div>
      </div>
      </div>
      
      <!-- 模态框主体 -->
      <div class="modal-body" style="padding:0 10px;">
        <ul class="list-group" id="dataList">
        
        </ul>
      </div>
      
      
      
      </div>
      </div>
      </div>`;
    div.className = "modal modal-mobile panel";
    div.id = "myModal";
    div.innerHTML = html;
    document.body.appendChild(div);

    $('#myModal').modal('show');
    $('#myModal .modal-dialog').click(function (e) {
      e.stopPropagation();
    })

    $('#myModal .autoTips').click(function (e) {
      e.stopPropagation();
    })
    // 判断iphoneX
    if (screen.height == 812 && screen.width == 375) {
      $('#myModal .autoTips')[0].style.padding = "40px 0";
    }

    function close() {
      $('#myModal').remove();
      $('.modal-backdrop').remove();
    }

    // 数据输入提示操作
    let input = div.querySelector('#input'),
      dataList = div.querySelector('#dataList'),
      dataStr = obj.data,
      dataArr = [];
    dataArr = dataStr.split(",");
    // console.log(dataArr)
    // 判断设备为 ios
    function isIos() {
      var u = navigator.userAgent;
      if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
        return true;
      }
      return false;
    }

    let theEv = isIos() ? "input" : "keyup";
    input.addEventListener(theEv, function () {
      // console.log(this.value)
      let value = this.value,
        filterArr, lis = "",
        lisEles;
      filterArr = dataArr.filter(num => {
        return num.indexOf(value) != -1;
      })
      for (let i = 0; i < filterArr.length; i++) {
        lis += `<li class="list-group-item hover">${filterArr[i]}</li>`
      }
      dataList.innerHTML = lis;
      lisEles = dataList.getElementsByClassName('list-group-item');
      for (let i = 0; i < lisEles.length; i++) {
        lisEles[i].addEventListener('click', function () {
          input.value = this.innerHTML;
          dataList.innerHTML = "";
        }, false)
      }
    }, false)


    //点击确定
    $('#myModal #confirmBtn').click(function () {
      let nowValue = input.value;
      obj.confirm(nowValue);
      close();
    })
  },
  customSelect: function (obj) {
    // 生成弹窗
    let div = document.createElement('div'),
      html = `
      <div class="customSelect">
    <div class="modal-dialog">
        <div class="modal-content">

            <!-- 模态框主体 -->
            <div class="modal-body">
                <div id="dataList">
                    <!-- 数据列表开始 -->
                    
                     <!-- 数据列表结束 -->
                </div>
             
            </div>
            <div class="p-2">
                <button class="btn btn-primary btn-block" id="saveBtn">确定</button>
            </div>
        </div>
    </div>
</div>
      `;
    div.className = "modal modal-mobile panel";
    div.id = "myModal";
    div.innerHTML = html;
    document.body.appendChild(div);

    $('#myModal').modal('show');
    $('#myModal .modal-dialog').click(function (e) {
      e.stopPropagation();
    })

    $('#myModal .customSelect').click(function (e) {
      e.stopPropagation();
    })
    // 判断iphoneX
    if (screen.height == 812 && screen.width == 375) {
      $('#myModal .customSelect')[0].style.padding = "40px 0";
    }

    function close() {
      $('#myModal').remove();
      $('.modal-backdrop').remove();
    }
    let data = obj.data,
      dataList = div.querySelector('#dataList'),
      dataHtml = "",
      saveBtn = div.querySelector('#saveBtn'),
      resArr = [];
    for (let i = 0; i < data.length; i++) {
      let dataItem = "";
      for (let key in data[i]) {
        if (key == "opid") {
          continue;
        } else {
          dataItem += ` <p class="card-text pb-1"><strong>${key}</strong>：${data[i][key]}</p>`
        }
      }
      dataHtml += `
      <div class="card m-2">
                        <div class="card-header bg-white">
                            <label>
                                <input type="checkbox" name="${data[i]['opid']}"> <i class="fsiconfont fsicon-square"></i> &nbsp;${data[i]["opid"]}
                            </label>
                        </div>
                        <div class="card-body">
                              ${dataItem}                          
                        </div>

                    </div>
      `
    }
    dataList.innerHTML = dataHtml;
    let input = div.querySelectorAll('input');
    saveBtn.addEventListener('click', function () {
      for (let i = 0; i < input.length; i++) {
        if (input[i].checked == true) {
          resArr.push(input[i].name)
        }
      }
      obj.confirm(resArr);
      close();
    }, false)

  }
}
//分页
class Fxpagination {
  constructor(obj) {
    this.eleId = obj.eleId;
    this.total = obj.total;
    this.currentPage = obj.currentPage;
    this.onChangePage = obj.onChangePage;
    this.init();
  }
  init() {
    this.render()
    this.changePage();
  }
  changePage() {
    let ele = document.getElementById(this.eleId);
    ele.onclick = (e) => {
      if (e.target.classList.contains('page-number') && e.target.classList.contains('active') == false) {
        this.currentPage = parseInt(e.target.innerHTML)
        this.render();
        this.onChangePage(this.currentPage)
      } else if (e.target.classList.contains('page-prev') && e.target.classList.contains('prohibit') == false) {
        this.currentPage = Math.max(--this.currentPage, 1);
        this.render();
        this.onChangePage(this.currentPage)
      } else if (e.target.classList.contains('page-next') && e.target.classList.contains('prohibit') == false) {
        this.currentPage = Math.min(++this.currentPage, this.total);
        this.render();
        this.onChangePage(this.currentPage)
      }
    }
  }
  render() {
    if (this.total > 5) {
      if (this.currentPage < 4) {
        let pageNumbers = "",
          pagePrev = "",
          ellipsis, pageNext = "",
          lastPageNumber = "",
          ul = "";
        for (let i = 1; i < 5; i++) {
          if (i == this.currentPage) {
            pageNumbers += `<li class="page-li page-number active">${i}</li>`
          } else {
            pageNumbers += `<li class="page-li page-number">${i}</li>`
          }
        }
        pagePrev = this.isProhibit()[0];
        pageNext = this.isProhibit()[1];
        ellipsis = `<li class="page-li ellipsis-tail">...</li>`;
        lastPageNumber = `<li class="page-li page-number">${this.total}</li>`
        ul = `
                    <ul class="FxPagination">
                        ${pagePrev}
                        ${pageNumbers}
                        ${ellipsis}
                        ${lastPageNumber}
                        ${pageNext}
                    </ul>
                    `
        document.getElementById(this.eleId).innerHTML = ul;
      } else if (this.currentPage >= 4 && this.currentPage <= this.total - 3) {
        let pageNumbers = "",
          pagePrev = "",
          ellipsis, pageNext = "",
          firstPageNumber = "",
          lastPageNumber = "",
          ul = "";
        for (let i = this.currentPage - 1; i < this.currentPage + 2; i++) {
          if (i == this.currentPage) {
            pageNumbers += `<li class="page-li page-number active">${i}</li>`
          } else {
            pageNumbers += `<li class="page-li page-number">${i}</li>`
          }
        }
        pagePrev = this.isProhibit()[0];
        pageNext = this.isProhibit()[1];
        ellipsis = `<li class="page-li ellipsis-tail">...</li>`;
        firstPageNumber = `<li class="page-li page-number">${1}</li>`
        lastPageNumber = `<li class="page-li page-number">${this.total}</li>`
        ul = `
                    <ul class="FxPagination">
                        ${pagePrev}
                        ${firstPageNumber}
                        ${ellipsis}
                        ${pageNumbers}
                        ${ellipsis}
                        ${lastPageNumber}
                        ${pageNext}
                    </ul>
                    `
        document.getElementById(this.eleId).innerHTML = ul;

      } else {
        let pageNumbers = "",
          pagePrev = "",
          ellipsis, pageNext = "",
          firstPageNumber = "",
          ul = "";
        for (let i = this.total - 3; i < this.total + 1; i++) {
          if (i == this.currentPage) {
            pageNumbers += `<li class="page-li page-number active">${i}</li>`
          } else {
            pageNumbers += `<li class="page-li page-number">${i}</li>`
          }
        }
        pagePrev = this.isProhibit()[0];
        pageNext = this.isProhibit()[1];
        ellipsis = `<li class="page-li ellipsis-tail">...</li>`;
        firstPageNumber = `<li class="page-li page-number">${1}</li>`
        ul = `
                    <ul class="FxPagination">
                        ${pagePrev}
                        ${firstPageNumber}
                        ${ellipsis}
                        ${pageNumbers}
                        ${pageNext}
                    </ul>
                    `
        document.getElementById(this.eleId).innerHTML = ul;
      }
    } else {
      let pageNumbers = "",
        pagePrev = "",
        pageNext = "",
        ul = "";
      for (let i = 1; i < this.total + 1; i++) {
        if (i == this.currentPage) {
          pageNumbers += `<li class="page-li page-number active">${i}</li>`
        } else {
          pageNumbers += `<li class="page-li page-number">${i}</li>`
        }
      }
      pagePrev = this.isProhibit()[0];
      pageNext = this.isProhibit()[1];
      ul = `
            <ul class="FxPagination">
                ${pagePrev}
                ${pageNumbers}
                ${pageNext}
            </ul>
            `
      document.getElementById(this.eleId).innerHTML = ul;
    }
  }
  isProhibit() {
    let pagePrev, pageNext;
    if (this.currentPage > 1) {
      pagePrev = `<li class="page-li page-prev">&lt</li>`
    } else {
      pagePrev = `<li class="page-li page-prev prohibit">&lt</li>`
    }
    if (this.currentPage < this.total) {
      pageNext = `<li class="page-li page-next">&gt</li>`
    } else {
      pageNext = `<li class="page-li page-next prohibit">&gt</li>`
    }
    return [pagePrev, pageNext]
  }
}