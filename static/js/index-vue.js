window.onload = function name(params) {
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
  const app = new Vue({
    el: '#app',
    data: {
      tableData: [],
      keyWord: '',
      isLoading: false,
      isEnd: false,
      all: 0,
      now: 0,
    },
    mounted() {

    },
    methods: {
      search(){
        this.isEnd = false
        this.all = 0
        this.now = 0
        if(this.keyWord==null||this.keyWord==undefined||this.keyWord==''){
          alert('请输入关键词查找!!!')
        }else{
          this.isLoading = true
          this.tableData = []
          axios.get(BASEURL + '/projectList', { params: { pageSize: 400, pageIndex: 1, projectName: '', keyWord: this.keyWord } }).then(res => {
            res.data.data.Data.ProjectList.forEach(item => {
              if (item.DisplayName.indexOf('screen') != -1) {
                this.getDepotList(item.Id, item.DisplayName)
              }
            })
          }).catch(e => {
            // alert(e)
          })
        }
      },
      getDepotList(projectId, projectName){
        axios.get(BASEURL + '/getDepotInfo', { params: { projectId: projectId } }).then(res => {
          res.data.data.DepotData.Depots.forEach(item => this.getBranchs(projectName, item.Name, item.Id, item.SshUrl, item.HttpsUrl))
          this.all = this.all + res.data.data.DepotData.Depots.length
        }).catch(e => {
          // alert(e)
        })
      },
      getBranchs(projectName, depotName, depotId, sshUrl, httpsUrl){
        axios.get(BASEURL + '/getBranchInfo', { params: { depotId: depotId, keyWord: this.keyWord, pageIndex: 1, pageSize: 200 } }).then(res => {
          this.now = this.now + 1
          if (res.data.data.Branches.length != 0) {
            res.data.data.Branches.forEach(item => {
              this.tableData.push({
                projectName: projectName,
                depotName: depotName,
                BranchName: `<span>${item.BranchName.replaceAll(this.keyWord, `<span class="key-color">${this.keyWord}</span>`)}</span>`,
                httpsUrl: httpsUrl,
                sshUrl: sshUrl,
              })
              // document.getElementsByClassName('result-box')[0].appendHTML(`
              //   <div class="result-line">
              //     <div>项目名：<span>${projectName}</span></div>
              //     <div>仓库名：<span>${depotName}</span></div>
              //     <div>分支名：<span>${item.BranchName.replaceAll(this.keyWord, `<span class="key-color">${this.keyWord}</span>`)}</span></div>
              //     <div>HTTPS：<span>${httpsUrl}</span></div>
              //     <div>SSH：<span>${sshUrl}</span></div>
              //   </div>
              // `)
            })
          }
          if(this.now == this.all){
            this.isLoading = false
            this.isEnd = true;
          }
        }).catch(e => {
          // alert(e)
        })
      }
    },
  })
}