<template>
  <div class="hello">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#999"
              @change="setSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="220px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" mini @click="edit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" mini @click="del(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning " icon="el-icon-setting" mini></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="20"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="define">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editStatus">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editclose">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    // 验证手机号
    var checkEmail = (rule,value,cb) =>{
      console.log(rule)
        let regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if(regEmail.test(value)){
          return cb()
        }
        cb(new Error('请输入格式正确的邮箱'))
      }
    // 验证手机号
    var checkMobile = (rule,value,cb) =>{
        let regMobile = /^1[123456789]\d{9}$/
        if(regMobile.test(value)){
          return cb()
        }
        cb(new Error('请输入正确手机号'))
      }
    return {
      // 用户名
      editname:'',
      editid:'',
      // 修改用户
      editForm:{
        email:'',
        mobile:''
      },
      // 修改用户对话框状态
      editStatus:false,
      userList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 弹出框状态
      dialogFormVisible: false,
      // 添加表单内容
      ruleForm:{
        username:'',
        password:'',
        email:'',
        phone:''
      },
      // 验证规则
      rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator:checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator:checkMobile, trigger: 'blur' }
          ],
      },
    }
  },
  methods: {
    // 删除
    del(id){
      console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:data} = await this.$axios.delete('users/' + id)
          console.log(data)
          if(data.meta.status == 200){
              this.getUserList();
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }else{
              this.$message({
              type: 'warning',
              message: data.meta.msg
            });
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 取消
    editclose(){
      this.editStatus = false
      this.$refs.editForm.resetFields()
    },
    // 修改用户信息
    save(){
      this.$refs.editForm.validate(async(e)=>{
        if(e){
          const {data:data} = await this.$axios.put('users/' + this.editid,this.editForm)
          console.log(data)
          if(data.meta.status == 200){
            this.editStatus = false
            this.$refs.editForm.resetFields()
            this.getUserList();
            this.$message({
              message:data.meta.msg,
              type:'success'
            })
            
          }else{
              this.$message({
                message: data.meta.msg,
                type: "warning"
              });
          }
        }
      })
    },
    // 打开修改用户信息
    edit(e){
      console.log(e)
      this.editStatus = true
      this.editname = e.username
      this.editid = e.id
    },
    // 确定
    define(){
      // this.dialogFormVisible = false
      this.$refs.ruleForm.validate(async(e)=>{
        if(e){
          const {data:data} = await this.$axios.post('users',this.ruleForm)
          if(data.meta.status == 201){
            this.dialogFormVisible = false
            this.$refs.ruleForm.resetFields()
            this.getUserList();
            this.$message({
              message: data.meta.msg,
              type: "success"
            });
          }else{
            this.$message({
              message: data.meta.msg,
              type: "warning"
            });
          }
        }
      })
    },
    // 监听取消按钮重置表单
    close(){
      this.dialogFormVisible = false
      this.$refs.ruleForm.resetFields()
    },
    async getUserList() {
      const { data: data } = await this.$axios.get("users", {
        params: this.queryInfo
      });
      console.log(data);
      if (data.meta.status == 200) {
        this.userList = data.data.users;
        console.log(this.userList);
      }
    },
    // 搜索
    search() {
      this.getUserList();
    },
    // 显示个数
    handleSizeChange(newSize) {
      console.log(newSize);
      let that = this;
      that.queryInfo.pagesize = newSize;
      that.getUserList();
    },
    // 页码
    handleCurrentChange(newPage) {
      console.log(newPage);
      let that = this;
      that.queryInfo.pagenum = newPage;
      that.getUserList();
    },
    // 状态开关
    async setSwitch(e) {
      const { data: data } = await this.$axios.put(
        `users/${e.id}/state/${e.mg_state}`
      );
      console.log(data);
      if (data.meta.status == 200) {
        this.$message({
          message: "设置成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "设置失败",
          type: "warning"
        });
      }
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25) !important;
  .el-table {
    margin-top: 20px;
  }
}
.el-pagination {
  margin-top: 10px;
}
.el-dialog {
  width: 50%;
}
</style>
