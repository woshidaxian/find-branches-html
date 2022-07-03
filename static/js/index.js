window.onload = function(){
  var oBtn = document.getElementsByClassName('btn')[0]
  var oInp = document.getElementById('inp-search')
  var oLoadBox = document.getElementsByClassName('load-box')[0]
  var oProgress = document.getElementsByClassName('load-nei')[0]
  var oLoadValue = document.getElementsByClassName('load-text')[0]
  const baseUrl = 'http://localhost:2022/tool/project'
  let key = null



  // 点击搜索
  oBtn.onclick = function(){
    key = oInp.value.trim()
    if(key==""||key==null||key==undefined){
      alert('请输入关键词查找!!!')
    }else{
      axios.get(baseUrl + '/projectList', { params: { pageSize: 100, pageIndex: 1, projectName: ''}}).then(res=>{
        res.data.data.Data.ProjectList.forEach(item => getDepot(item.Id, item.DisplayName))
      }).catch(e=>{
        alert(e)
      })
      oLoadBox.style.display = 'flex'
    }
  }

  // 查仓库
  function getDepot(projectId, projectName){
    axios.get(baseUrl + '/getDepotInfo', { params: { projectId: projectId } }).then(res => {
      res.data.data.DepotData.Depots.forEach(item => getBranchs(projectName, item.Name, item.Id))
    }).catch(e => {
      alert(e)
    })
  }

  // 查仓库分支
  function getBranchs(projectName, depotName, depotId){
    axios.get(baseUrl + '/getBranchInfo', { params: { depotId: depotId, keyWord:  key} }).then(res => {
      // res.data.data.Data.projectList
    }).catch(e => {
      alert(e)
    })
  }
}