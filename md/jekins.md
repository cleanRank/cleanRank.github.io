# linux 安装jenkins

1. 安装jdk

-- yum install -y java-1.8.0-openjdk-devel.x86_64
-- java -version // 查看版本
2. 安装git
-- yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker //安装相关基础插件
-- cd /usr/local/git
-- 下载git
-- wget https://github.com/git/git/archive/v2.3.0.zip
-- unzip v2.3.0.zip // unzip command not found 执行 yum install -y unzip zip
-- make prefix=/usr/local/git all
-- make prefix=/usr/local/git install // 编译安装


--vim /etc/profile   // 修改gitpath
--在文件末尾加一行export PATH=/usr/local/git/bin:$PATH
-- source /etc/profile  // 使修改立即生效
注： git --version // 查看版本即为最新安装版本  whereis git 查看git

3. 安装jenkins
 1) 下载 
 -- wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
 2) 安装
 -- rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
 -- yum install jenkins
 -- service jenkins start
 --访问ip+端口号  // 可以通过vim  /etc/sysconfig/jenkins 修改端口号访问不成功查看防火墙
 
