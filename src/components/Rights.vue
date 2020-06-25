<template>
<div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="list" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == 0">一级</el-tag>
                    <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>
    
</template>
<script>
    export default{
        name:'rights',
        data(){
            return {
                list:[]
            }
        },
        methods:{
            async getList(){
                const {data:data} = await this.$axios.get('rights/list')
                console.log(data)
                if(data.meta.status == 200){
                    this.list = data.data
                }
            }
        },
        created(){
            this.getList()
        }
    }
</script>
<style lang="scss" scoped>
    .el-card{
        margin-top:20px;
        .el-tag{
            margin-right:5px;
            cursor: pointer;
        }
    }
</style>