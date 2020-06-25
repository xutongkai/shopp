<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
    </el-card>
    <!-- 角色列表区域 -->
    <el-table :data="list" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(itema,indexa) in scope.row.children" :key="indexa">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag>{{itema.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="(itemb,indexb) in itema.children" :key="indexb">
                <el-col :span="6">
                  <el-tag type="success">{{itemb.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    type="danger"
                    closable
                    @close="handleClose(scope.row,itemc.id)"
                    v-for="(itemc,indexc) in itemb.children"
                    :key="indexc"
                  >{{itemc.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)">删除</el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showRole(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%" :before-close="hideRole">
      <el-tree
        ref="el_tree"
        :data="treeList"
        show-checkbox
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideRole">取 消</el-button>
        <el-button type="primary" @click="selDefine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "role",
  data() {
    return {
      list: [],
      dialogVisible: false,
      //   树形数据
      treeList: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      defKeys: [],
      // 分配的角色
      rolesid:''
    };
  },
  methods: {
    // 选中确定
    async selDefine(){
        
        const idarr= [...this.$refs.el_tree.getCheckedKeys(),...this.$refs.el_tree.getCheckedKeys()] 
        console.log(idarr)
        const id = idarr.join(',');
        console.log(id)
        const {data} = await this.$axios.post(`roles/${this.rolesid}/rights`,{rids:id})
        console.log(data)
        if(data.meta.status == 200){
          this.dialogVisible = false
          this.getList()
          this.$message.success(data.meta.msg)
        }else{
          this.$message.err(data.meta.msg)
        }
    },
    //   通过递归的形式，获取角色下所有三级权限的id，并保存到difKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 关闭分配权限
    hideRole() {
      this.dialogVisible = false
      this.defKeys = []
    },
    //   分配权限
    async showRole(roles) {
      // 记录要分配权限的id
      this.rolesid = roles.id
      const { data } = await this.$axios.get("rights/tree");
      console.log(data);
      if (data.meta.status == 200) {
        this.treeList = data.data;
      }
      this.getLeafKeys(roles, this.defKeys);
      this.dialogVisible = true;
    },
    //   移除权限
    handleClose(role, rightId) {
      let that = this;
      that
        .$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          const { data } = await that.$axios.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          console.log(data);
          if (data.meta.status == 200) {
            that.$message({
              type: "success",
              message: "取消权限成功"
            });
            role.children = data.data;
            console.log(role);
          }
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取列表
    async getList() {
      const { data } = await this.$axios.get("roles");
      console.log(data);
      if (data.meta.status == 200) {
        this.list = data.data;
      } else {
        this.message.error(data.meta.msg);
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
}
.el-row {
  border-top: 1px solid #eee;
  .el-tag {
    margin: 7px;
  }
}
.el-row:last-of-type {
  border-bottom: 1px solid #eee;
}
</style>