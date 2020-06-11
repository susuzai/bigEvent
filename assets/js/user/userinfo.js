// 入口函数
$(function() {
    // 1.一进入页面发送ajax请求，渲染用户信息到页面
    getUserInfo();

    // 2.给表单注册提交事件，更新信息
    $('form').on('submit', function(e) {
        // 2.1阻止默认提交行为
        e.preventDefault();
        // 2.2发送ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(), //检查form的name属性
            success: function(backData) {
                // 给出相应提示
                layer.msg(backData.message);
                if (backData.status === 0) {
                    // 重新渲染头像区域显示昵称
                    window.parent.getUserData();
                };
            }
        });
    });

    // 3.点击“重置”按钮
    $('button[type="reset"]').on('click', function(e) {
        e.preventDefault();
        // 重新调用获取用户信息功能
        getUserInfo();
    });
});
/**
 * @description:封装一进入页面渲染用户信息到页面
 * @param {type} 
 * @return: 
 */
function getUserInfo() {
    // 1.发送ajax请求
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(backData) {
            if (backData.status === 0) {
                // 加载form对象
                var form = layui.form;
                // 调用val()方法为表单赋值
                form.val('info', backData.data);
            };
        }
    });
};