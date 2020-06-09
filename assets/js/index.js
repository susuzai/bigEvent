// 入口函数
$(function() {
    // 1. 一进入index页面，把相关用户的信息渲染到页面
    getUserData();

    // 2.点击退出
    $('.loginout').on('click', function() {
        layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
            //do something 
            // 2.1清除token存储
            localStorage.removeItem('token');
            // 2.2跳转到login页面
            window.location.href = '/login.html';
            // 默认关掉弹出框
            layer.close(index);
        });
    });
});
/**
 * @description:封装一进入页面渲染用户相应数据
 * @param {type} 
 * @return: 
 */
function getUserData() {
    // 1.1发送ajax请求
    $.ajax({
        type: 'GET',
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        // 设置请求头
        headers: {
            // 将本地存储的token值传入
            'Authorization': localStorage.getItem('token')
        },
        // 发送ajax成功后执行的代码
        success: function(backData) {
            // 1.2判断成功的情况
            if (backData.status === 0) {
                // 1.3昵称或者用户名显示（昵称有则显示，无则显示用户名）
                var myname = backData.data.nickname || backData.data.username;
                $('.myname').text(myname);
                // 1.4头像显示  自定义头像优先，无则默认头像
                if (backData.data.user_pic) { //有自定义头像
                    // 自定义图片显示
                    $('.layui-nav-img').attr('src', backData.data.user_pic).show();
                    // 默认图片隐藏
                    $('.text-pic').hide();
                } else { //无自定义头像
                    // 获取默认头像文本(转为大写)
                    var txt = myname.substr(0, 1).toUpperCase();
                    // 默认图片显示
                    $('.text-pic').text(txt).css('display', 'inline-block');
                    // 自定义图片隐藏
                    $('.layui-nav-img').hide();
                };
            };
        },
        // 发送ajax完成后执行的代码
        complete: function(backData) {
            // console.log(backData);
            if (backData.responseJSON.status === 1) { // 拥有虚假token或者是没有token情况
                // 先移除token值
                localStorage.removeItem('token');
                // 跳转到login页面
                window.location.href = '/login.html';
            };
        }
    });
};