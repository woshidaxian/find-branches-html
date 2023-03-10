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
      color1: '',
      color2: '',
      commitList: [],
      showCommitDetail: false,
      searchType: 1
    },
    mounted() {
      this.color1 = this.randomColor();
      this.color2 = this.randomColor();
    },
    methods: {
      randomColor(){
        let a = Math.round(Math.random() * 255)
        let b = Math.round(Math.random() * 255)
        let c = Math.round(Math.random() * 255)
        return `rgb(${a}, ${b}, ${c}, 0.6)`
      },
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
              if ((this.searchType == 1 && item.DisplayName.indexOf('screen') != -1) || this.searchType == 2) {
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
                ref: item.BranchName,
                depotId: depotId,
                httpsUrl: httpsUrl,
                sshUrl: sshUrl,
              })
            })
          }
          if(this.now == this.all){
            setTimeout(() => {
              this.isLoading = false
              this.isEnd = true;
            }, 500);
          }
        }).catch(e => {
          // alert(e)
        })
      },
      lookDetail(ref, depotId){
        axios.get(BASEURL + '/commitList', { params: { ref: ref, depotId: depotId, pageSize: 10, pageIndex: 1 } }).then(res=>{
          if(res.data.data.Commits){
            this.commitList = res.data.data.Commits
            this.showCommitDetail = true
          }
        })
      },
      copy(url){
        var aux = document.createElement("input");

        // 设置元素内容
        aux.setAttribute("value", url);

        // 将元素插入页面进行调用
        document.body.appendChild(aux);

        // 复制内容
        aux.select();

        // 将内容复制到剪贴板
        document.execCommand("copy");

        // 删除创建元素
        document.body.removeChild(aux);

        //提示
        alert("复制内容成功");
      },
    },
  })
}