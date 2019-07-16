ls -a //查看文件目录
free -m //查看内存
sync 
echo 3 > /proc/sys/vm/drop_caches // 释放内存

 ps -ef | grep nginx  // 查看nginx进程




 curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash // 安装git-runner
 sudo yum install gitlab-runner
 