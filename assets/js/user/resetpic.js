// 入口函数
$(function() {
    // 1.创建剪裁区
    // - 找到剪裁区的图片 （img#image）
    var $image = $('#image');
    // - 设置配置项
    var option = {
        // 纵横比(宽高比)
        aspectRatio: 1, // 正方形
        // 指定预览区域
        preview: '.img-preview' // 指定预览区的类名（选择器）
    };
    // - 调用cropper方法，创建剪裁区
    $image.cropper(option);


    // 2.点击“上传”按钮，可以选择文件
    $('button:contains("上传")').on('click', function() {
        // 2.1用触发器触发文件域的点击事件
        $('#file').trigger('click');
        // 2.2文件域注册值改变事件
        $('#file').on('change', function() {
            // 2.2.1获取到文件
            var file = this.files[0];
            // 2.2.2将文件生成临时url
            var url = URL.createObjectURL(file);
            // 2.2.3将图片放到显示区域
            // - 销毁原理的剪裁区
            // - 更换图片
            // - 重新创建剪裁区
            $image.cropper('destroy').attr('src', url).cropper(option);
        });
    });


    // 3.点击“确认”按钮，更换头像区域图片
    $('button:contains("确定")').on('click', function() {
        // 剪裁得到一张图片（canvas图片）
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 发送ajax请求
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/my/update/avatar',
            data: {
                avatar: dataURL
            },
            headers: {
                // 携带token
                'Authorization': localStorage.getItem('token')
            },
            complete: function(backData) {
                // 拥有假token或者没有token情况
                if (backData.responseJSON.status === 1 && backData.responseJSON.message === '身份认证失败！') {
                    // 清除token
                    localStorage.removeItem('token');
                    // 跳转到login页面
                    window.parent.location.href = '/login.html';
                };
            },
            success: function(backData) {
                // 提示用户
                layer.msg(backData.message);
                // 成功过后，替换头像区图片
                if (backData.status === 0) {
                    // 调用用户信息方法重新渲染到页面
                    window.parent.getUserData();
                };
            }
        });
    });
});