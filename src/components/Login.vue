<template>
    <div class="container">
        <div class="box">
            <!-- 头像 -->
            <img src="@/assets/logo.png" alt="" class="logo">
            <!-- 表单 -->
            <el-form class="form" :model="loginFrom" :rules="loginFromRules" ref="loginFormRef">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginFrom.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-goods" v-model="loginFrom.password" type="password"></el-input>
                </el-form-item>
                <el-row>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginFrom:{
                username:'admin',
                password:'123456'
            },
            loginFromRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetForm(){
            this.$refs.loginFormRef.resetFields()
        },
        login(){
            let that = this
            this.$refs.loginFormRef.validate(async res => {
                if(!res) return;
                const {data:data} = await this.$axios.post('login',this.loginFrom);
                if(data.meta.status == 200){
                    sessionStorage.setItem('token',data.data.token);
                    that.$router.push('/home');
                    that.$message({
                        message: '登录成功',
                        type: 'success',
                    });
                }else{
                    this.$message.error('登录失败');
                }
            })
        }
        
    },
    created(){
        console.log(this)
    }
}
</script>
<style lang="less" scoped>
    .container{
        background-color: #2b4b6b;
        height: 100%;
        .box{
            width:450px;
            height: 300px;
            background-color: #FFF;
            border-radius: 3px;
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
            .logo{
                width:100px;
                height: 100px;
                position: absolute;
                left:50%;
                margin-left:-50px;
                margin-top:-50px;
                
            }
            .form{
                width:100%;
                padding:0 30px;
                box-sizing: border-box;
                margin-top:60px;
            }
        }
    }
</style>

