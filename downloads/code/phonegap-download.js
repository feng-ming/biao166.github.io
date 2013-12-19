// APk-download
App.DownApk = (function(D){

    var ft,
        dialog,
        percent = 0,
        errList = ['OK', 'NOT_FOUND_ERR', 'SECURITY_ERR', 'ABORT_ERR', 'NOT_READABLE_ERR', 'ENCODING_ERR', 'NO_MODIFICATION_ALLOWED_ERR', 'INVALID_STATE_ERR', 'SYNTAX_ERR', 'INVALID_MODIFICATION_ERR', 'QUOTA_EXCEEDED_ERR', 'TYPE_MISMATCH_ERR', 'PATH_EXISTS_ERR'];

    D.init = function(options){
        // 调用持久化存储
        requestFileSystem(LocalFileSystem.PERSISTENT, options.size, function(fileSystem) {
            console.log('fileSystem', fileSystem);

            fileSystem.root.getFile(options.name, {
                create: true,
                exclusive: false
            }, function(fileEntry) {

                var localPath = fileEntry.fullPath;

                ft = new FileTransfer();

                // 进度回调
                ft.onprogress = D.processing;

                // 弹窗显示进度
                dialog = App.dialog({
                    id: 'downloadApk',
                    html: tpl['downloadApk']({})
                });

                ft.download(options.download, localPath, function(entry) {
                    console.log('fileTransfer done', entry);

                    // 关闭弹窗
                    dialog.close();

                    // 调用 apk 安装
                    _.delay(function(){
                        D.openApk(entry.fullPath);
                    }, 300);

                }, function(error) {
                    console.log("Error downloading APK: " + error.code);
                });

            }, function(error) {
                console.log("Error downloading apk: " + error.code);
            });
        }, function(error) {
            console.log("Error preparing to download apk: ", error.code);
        });
    }

    D.processing = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            // 计算百分比，用于显示进度条
            percent = parseInt((progressEvent.loaded / progressEvent.total) * 100); 
            //换算成MB
            //loaded = (progressEvent.loaded/1024/1024).toFixed(2);
            //total = (progressEvent.total/1024/1024).toFixed(2);

            dialog.container.find(".processing").width(percent + '%');
            dialog.container.find(".percent").html(percent);
        }
    },

    D.openApk = function(path){
        App.openApk({
            apkPath: path.slice(7)
        }, function(){
            console.log('openApk ok');
        }, function(){
            console.log('openApk error');
        });
    }

    return D;

})(App.DownApk || {})