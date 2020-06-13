$(function() {
    // 加载layui 的form模块
    var form = layui.form;


    // 1.1 初始化图片裁剪器
    var $image = $('#image');
    // 1.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        // 让剪裁框铺满整个剪裁区(默认是0.8)
        autoCropArea: 1,
        preview: '.img-preview'
    };
    // 1.3 初始化裁剪区域
    $image.cropper(options);


    // 2.1 初始化富文本编辑器
    initEditor();
    // 8.1 发送ajax请求，获取文章信息

    // 获取地址栏的id(为获取文章信息做准备)
    var id = location.search.split("=")[1];
    // console.log(id);


    // 3.1渲染文章类别  模板引擎添加到下拉框中
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function(backData) {
            // 通过模板引擎渲染到下拉框中
            if (backData.status === 0) {
                var html = template('tpl-cates', backData);
                $('select').html(html);
                //刷新select选择框渲染
                form.render('select');

                // 为确保文章分类能够显示，必须在这个ajax成功过后，才能获文章信息
                $.ajax({
                    type: 'GET',
                    url: '/my/article/' + id,
                    success: function(backData) {
                        if (backData.status === 0) {
                            // 数据回填
                            form.val('edit-form', backData.data);

                            // 重新生成画布
                            $image.cropper('destroy').attr('src', 'http://www.liulongbin.top:3007' + backData.data.cover_img).cropper(options);


                            // 重新刷新富文本编辑器（因为编辑之后需要获取不到）
                            initEditor();
                        };
                    }
                });
            };
        }
    });

    // 4.1 点击“选择封面”按钮
    $('button:contains("选择封面")').on('click', function() {
        // 4.2 用触发器触发文件域的点击事件
        $('#file').trigger('click');
    });

    // 5.1 注册文件域值改变事件
    $('#file').on('change', function() {
        // 5.2 获取文件
        var file = this.files[0];
        // 5.3 生成临时url
        var url = URL.createObjectURL(file);
        // 5.4 销毁之前的剪裁区，现在重新生成一个剪裁区
        $image.cropper('destroy').attr('src', url).cropper(options);
    });

    // 6.1 点击“已发布”和“存为草稿”，需要改变state值
    // 定义全局变量存储状态值
    var state = "";
    $('button:contains("已发布")').on('click', function() {
        state = "已发布";
    });
    $('button:contains("存为草稿")').on('click', function() {
        state = "草稿";
    });

    // 7.1 为表单注册提交事件
    $('form').on('submit', function(e) {
        // 7.2 阻止默认提交事件
        e.preventDefault();
        // 7.3 用FormData方式获取数据(需要检查表单中name属性)
        var fd = new FormData(this);
        // 7.4 将state追加到fd中(状态值)
        fd.append('state', state);

        // 编辑富文本之后，需要重新设置fd里面content
        fd.set('content', tinyMCE.activeEditor.getContent());

        // 7.5 剪裁图片，得到canvas画布，并转换成blob格式
        var canvas = $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function(blob) {
            // 将转换的二进图片追加到fd中
            fd.append('cover_img', blob);

            // 遍历fd
            for (var ele of fd) {
                console.log(ele);
            };

            // 7.6 发送ajax请求
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                // 用FormData传入数据不需要设置urlencoded格式
                contentType: false,
                // 用FormData传入数据不需要转成字符串
                processData: false,
                success: function(backData) {
                    layer.msg(backData.message);
                    if (backData.status === 0) {
                        // 添加成功后，直接跳转到文章列表页
                        window.parent.location.href = '/article/article.html';
                    };
                }
            });
        });



    });
});