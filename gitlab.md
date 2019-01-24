# centOs7 install gitLab
# centOs7 64bit
# 1、安装软件依赖
yum -y install policycoreutils openssh-server openssh-clients postfix
# 2、设置postfix开机自启，并启动，postfix支持gitlab发信功能
systemctl enable postfix && systemctl start postfix
# 如果安装启动报错
Job for postfix.service failed because the control process exited with error code. See "systemctl status postfix.service" and "journalctl -xe" for details.

# 解决方法
# 修改 /etc/postfix/main.cf的设置
vim /etc/postfix/main.cf

# 按i键底部出现INSERT标识正在编辑模式
# 修改设置
inet_protocols = ipv4  
inet_interfaces = all 

# 按ESC键输入
:wq
# 按ENTER 保存并退出
# 然后在执行
systemctl enable postfix && systemctl start postfix

# 3、下载并安装gitLab
wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-11.7.0-ce.0.el7.x86_64.rpm
rpm gitlab-ce-11.7.0-ce.0.el7.x86_64.rpm

# 4、修改gitlab配置文件指定服务器ip和自定义端口：
vim  /etc/gitlab/gitlab.rb
# 修改文件内容
# external_url '服务器ip地址:端口号'
# 保存并退出

# 5、重置并启动gitLab

gitlab-ctl reconfigure

gitlab-ctl restart

<!-- ok: run: alertmanager: (pid 3340) 1s
ok: run: gitaly: (pid 3348) 0s
ok: run: gitlab-monitor: (pid 3359) 0s
ok: run: gitlab-workhorse: (pid 3363) 0s
ok: run: logrotate: (pid 3380) 0s
ok: run: nginx: (pid 3386) 0s
ok: run: node-exporter: (pid 3395) 0s
ok: run: postgres-exporter: (pid 3401) 1s
ok: run: postgresql: (pid 3409) 0s
ok: run: prometheus: (pid 3411) 1s
ok: run: redis: (pid 3426) 0s
ok: run: redis-exporter: (pid 3430) 1s
ok: run: sidekiq: (pid 3435) 0s
ok: run: unicorn: (pid 3444) 1s -->

# 出现如上信息表示启动成功


#这时候打开浏览器访问ip:端口号 
# 如果不成功可能的原因是阿里云服务器没有开启端口

# 打开阿里云控制台 进入安全组配置-》添加安全组规则-》添加端口

# 再次访问应该可以进入gitlab主页了

# ps gitlab要求最小内存为2G

