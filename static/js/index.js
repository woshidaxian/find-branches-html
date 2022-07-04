window.onload = function(){
  var oBtn = document.getElementsByClassName('btn')[0]
  var oInp = document.getElementById('inp-search')
  var oLoadBox = document.getElementsByClassName('load-box')[0]
  var oProgress = document.getElementsByClassName('load-nei')[0]
  var oLoadValue = document.getElementsByClassName('load-text')[0]
  var oResultBox = document.getElementsByClassName('result-box')[0]
  const baseUrl = BASEURL ||'http://localhost:2022/tool/project'
  // const baseUrl = 'http://localhost:2022/tool/project'
  let key = null
  let loadVal = 0
  let timer = null
  let hasData = false


  // 点击搜索
  oBtn.onclick = function(){
    key = oInp.value.trim()
    if(key==""||key==null||key==undefined){
      alert('请输入关键词查找!!!')
    }else{
      oResultBox.innerHTML = '<div class="no-data">暂无结果</div>'
      document.getElementsByClassName('no-data')[0].style.display = 'block'
      oResultBox.style.display = 'none'
      hasData = false
      axios.get(baseUrl + '/projectList', { params: { pageSize: 400, pageIndex: 1, projectName: ''}}).then(res=>{
        res.data.data.Data.ProjectList.forEach(item => {
          if (item.DisplayName.indexOf('screen')!=-1){
            getDepot(item.Id, item.DisplayName)
          }
        })
      }).catch(e=>{
        // alert(e)
      })
      loadVal = 0
      oLoadBox.style.display = 'flex'
      timer = setInterval(()=>{
        oLoadValue.innerHTML = loadVal + '%'
        oProgress.style.width = loadVal + '%'
        loadVal = loadVal + Math.floor(Math.random() * 5)
        if(loadVal>=100){
          clearInterval(timer)
          loadVal = 100
          oLoadValue.innerHTML = loadVal + '%'
          oProgress.style.width = loadVal + '%'
          oResultBox.style.display = 'block'
          oLoadBox.style.display = 'none'
          !hasData ? '' : document.getElementsByClassName('no-data')[0].style.display = 'none'
        }
      },50)
    }
  }

  // 查仓库
  function getDepot(projectId, projectName){
    axios.get(baseUrl + '/getDepotInfo', { params: { projectId: projectId } }).then(res => {
      res.data.data.DepotData.Depots.forEach(item => getBranchs(projectName, item.Name, item.Id))
    }).catch(e => {
      // alert(e)
    })
  }

  // 查仓库分支
  function getBranchs(projectName, depotName, depotId){
    axios.get(baseUrl + '/getBranchInfo', { params: { depotId: depotId, keyWord: key, pageIndex: 1, pageSize: 200} }).then(res => {
      if (res.data.data.Branches.length!=0){
        hasData = true
        res.data.data.Branches.forEach(item=>{
          oResultBox.appendHTML(`
            <div class="result-line">
              <div>项目名：<span>${projectName}</span></div>
              <div>仓库名：<span>${depotName}</span></div>
              <div>分支名：<span>${item.BranchName.replaceAll(key, `<span class="key-color">${key}</span>`)}</span></div>
            </div>
          `)
        })
      }
    }).catch(e => {
      // alert(e)
    })
  }

  HTMLElement.prototype.appendHTML = function (html) {
    var divTemp = document.createElement("div"), nodes = null
      // 文档片段，一次性append，提高性能
      , fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (var i = 0, length = nodes.length; i < length; i += 1) {
      fragment.appendChild(nodes[i].cloneNode(true));
    }
    this.appendChild(fragment);
    // 据说下面这样子世界会更清净
    nodes = null;
    fragment = null;
  };
}