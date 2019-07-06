本次主要探讨swarm搭建docker集群服务；主要介绍Swarm集群管理工具、docker服务集群搭建、docker-compose部署文件编写、gitlab-ci实现项目自动化部署，以及安装过程中关键注意点分析。 
了解集群
了解集群
集群是一组运行 Docker 的计算机组成，其中部分机器是集群管理机（Swarm Manager） ，其他的是工作机（Worker）。在集群中，在 Manager 机器上使用 Docker 命令，会在群集上执行。群集中的机器可以是物理机或虚拟机。加入群集后，它们被统称节点（Node）。
Swarm管理机可以使用几种策略来运行容器，例如“最空闲节点”- 容器会填充最少使用的机器。或“全局策略”，它确保每个机器能只能获得指定容器的一个实例。您可以将这些策略写在 docker-compose.yml 这样的服务组合定义文件中，Swarm管理机会按策略部署。
Swarm Manager是群集中唯一可以执行 docker 命令的机器，或授权其他机器作为工人机（worker）加入群集。worker 只是提供能力，没有权力指挥其他机器工作。
如果您已经熟悉单主机中使用Docker。现在，可切换到 Docker 集群模式。启用群组模式（swarm mode）使当前的机器成为群组管理机。这时，这台 Docker 将运行管理这个群集的指令，而不再是在当前的机器上运行。
主要概念
Swarm Manager 集群的管理者
worker 集群中的执行者
Node 集群中任意的docker机器
Swarm mode 集群模式，docker机器的状态
Swarm集群架构
Swarm是Docker官方提供的一款集群管理工具，其主要作用是把若干台Docker主机抽象为一个整体，并且通过一个入口统一管理这些Docker主机上的各种Docker资源。
如下图作为一个整体实际上都处于一个所谓的集群中，它可能对应了一到多台的实际服务器。每台服务器上都装有Docker并且开启了基于HTTP的DockerAPI。这个集群中有一个SwarmManager的管理者，用来管理集群中的容器资源。管理者的管理对象不是服务器层面而是集群层面的，也就是说通过Manager，我们只能笼统地向集群发出指令而不能具体到某台具体的服务器上要干什么（这也是Swarm的根本所在）。至于具体的管理实现方式，Manager向外暴露了一个HTTP接口，外部用户通过这个HTTP接口来实现对集群的管理。对于稍微大一点的集群，最好是拿出一台实际的服务器作为专门的管理者，作为学习而言，也可以把管理者和被管理者放在一台服务器上。 Local Image

简要说明
Swarm简介
Swarm是Docker公司在2014年12月初发布的一套较为简单的工具，用来管理Docker集群，它将一群Docker宿主机变成一个单一的，虚拟的主机。Swarm使用标准的Docker API接口作为其前端访问入口，换言之，各种形式的Docker Client(docker client in go, docker_py, docker等)均可以直接与Swarm通信。Swarm几乎全部用Go语言来完成开发，Swarm0.2发布，相比0.1版本，0.2版本增加了一个新的策略来调度集群中的容器，使得在可用的节点上传播它们，以及支持更多的Docker命令以及集群驱动。
Portainer图形界面管理服务集群，Portainer是Docker的图形化管理工具，提供状态显示面板、应用模板快速部署、容器镜像网络数据卷的基本操作（包括上传下载镜像，创建容器等操作）、事件日志显示、容器控制台操作、Swarm集群和服务等集中管理和操作、登录用户管理和控制等功能。功能十分全面，基本能满足中小型单位对容器管理的全部需求。 Local Image
Visualizer查看节点信息及服务状态（红色：服务异常，绿色：服务正常） Local Image
docker简介
简单的说，Docker是一个能够把开发的应用程序自动部署到容器的开源引擎。
Docker 包括三个基本概念：镜像(Image)、容器(Container)、仓库(Repository)
镜像(Image)
Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等） 。镜像不包含任何动态数据，其内容在构建之后也不会被改变。
容器(Container)
镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
仓库(Repository)
镜像构建完成后，可以很容易的在当前宿主上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry 就是这样的服务。一个 Docker Registry 中可以包含多个仓库（Repository） ；每个仓库可以包含多个标签（Tag） ；每个标签对应一个镜像。
ansible简介
Ansible提供一种最简单的方式用于发布、管理和编排计算机系统的工具，可在数分钟内搞定。Ansible由Python语言开发， 默认通过 SSH 协议管理机器。只要ssh连接ok 被控制节点不需要安装任何工具，就可以实现远程连接执行任何操作支持多节点发布、远程任务执行。
Ansible工作原理 Local Image 用一句话总结就是一台管理主机，根据定义的 Inventory host 清单或者 playbook ，调用特定的模块通过 openssh 协议在远程主机执行相关命令并返回结果。
gitlab-ci简介
GitLab CI 是 GitLab 为了提升其在软件开发工程中作用，完善 DevOps 理念所加入的 CI/CD 基础功能。可以便捷的融入软件开发环节中。通过 GitLab CI 可以定义完善的 CI/CD Pipeline。
Pipeline 相当于一个构建任务，里面可以包含多个流程，如依赖安装、编译、测试、部署等。
Stage 表示构建的阶段。
Job 是 Stage 中的任务。
Runner 是任务的实际执行者 Local Image

集群场景
假定用于集群的服务器为3台，一台为私有镜像仓库（Registry），一台为docker集群管理机（test-m1），一台为docker集群工作机（test-w1），两台服务器的具体信息如下：

主机名称	外网IP	内网IP	说明
test-m1	106.14.99.84	10.30.6.0	集群管理机、ansible主机、gitlab主机
test-w1	106.14.241.216	10.30.5.246	集群工作机
Registry	47.101.169.150	10.0.0.56	资源服务器、Docker私服仓库

资源服务器
资源服务器简介

资源服务器可以选择安装，如果已有docker Registry资源服务器，可以直接使用，但是该私服镜像仓库必须配置ansible到项目集群服务器的免密登录访问。
资源服务主要安装docker Registry私有仓库镜像仓库、ansible命令。
docker Registry私有仓库镜像仓库，主要存放需要的镜像文件。
ansible用于资源机免密访问其他服务器（具体安装方法后续有说明），资源机ansible一般情况下对各台docker 服务器都要进行免密访问。
安装epel第三方源

Epel解释
EPEL的全称叫 Extra Packages for Enterprise Linux 。EPEL是由 Fedora 社区打造，为 RHEL 及衍生发行版如 CentOS、Scientific Linux 等提供高质量软件包的项目。装上了 EPEL之后，就相当于添加了一个第三方源。
安装epel-release
执行命令：yum -y install epel-release
资源服务器Ansible安装及配置

安装命令 
yum -y install ansible
查看ansible版本命令 
ansible --version
资源机生成密钥 
ssh-keygen
下发资源机密钥到客户集群机 
在服务机（ansible安装机器）运行以下命令、复制公钥到客户机（如有多台客户机，每一台都要执行），执行命令如下：
ssh-copy-id -i ~/.ssh/id_rsa.pub -p 22 客户机用户帐号@客户机IP (如果内网可以访问，尽量使用内网)
如图: Local Image
在服务机用ssh连接客户机，输入客户机用户名和密码，验证登录是否成功，如果登录成功，表示免密操作已成功，接着使用exit退出客户机，返回服务主机。
编辑ansible hosts文件建立服务主机和客户主机关系

执行命令：vim /etc/ansible/hosts
添加服务主机和客户机配置如图： Local Image
验证ansible免密登录到各台客户机是否成功

执行命令：ansible 客户机IP映射名称 -m ping
如图： Local Image
资源服务器Docker安装

执行命令：yum -y install docker
查看docker版本：docker -v
安装docker-compose执行命令：curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
docker-compose添加权限 
执行命令：chmod +x /usr/local/bin/docker-compose
资源服务器Docker Registry搭建及配置

下载registry镜像
执行命令：docker pull registry
默认情况下，会将仓库存放于容器内的/tmp/registry目录下，这样如果容器被删除，则存放于容器中的镜像也会丢失，所以我们一般情况下会指定本地一个目录挂载到容器内的/tmp/registry下。
启动容器：docker run -d -p 5000:5000 -v /opt/data/registry:/tmp/registry registry
挂载位置
执行命令：find / -name registry 
如图：
Local Image 
可以看到registry 挂载目录是 在 /var/lib/registry 下。
重新启动registry
执行命令：docker run -d -p 5000:5000 -v /opt/data/registry:/var/lib/registry -v /data/config.yml:/etc/docker/registry/config.yml registry
config.yml这里需要说明一点，在启动仓库时，需在配置文件中的storage配置中增加delete=true配置项，允许删除镜像。默认的镜像是没有这个参数。 
如图：
Local Image
可能出现的问题
push失败，因为Docker从1.3.X之后，与docker registry交互默认使用的是https，然而此处搭建的私有仓库只提供http服务，所以当与私有仓库交互时就会报上面的错误。为了解决这个问题需要在启动docker server时增加启动参数为默认使用http访问。
修改docker启动配置文件
执行命令：vim /usr/lib/systemd/system/docker.service
找到 ExecStart 添加 --insecure-registry 资源机IP:5000 
如图
Local Image
重启docker
重启Docker命令： 
systemctl daemon-reload 
systemctl restart docker
配置通过hostname访问
执行命令：vi /etc/hosts 
如图：
Local Image
Docker Registry资料
参考资料：https://www.cnblogs.com/Tempted/p/7768694.html

集群管理服务器配置
集群管理服务器指docker主机，也就是swarm集群中docker manage机器。

Epel安装
Epel解释
EPEL的全称叫 Extra Packages for Enterprise Linux 。EPEL是由 Fedora 社区打造，为 RHEL 及衍生发行版如 CentOS、Scientific Linux 等提供高质量软件包的项目。装上了 EPEL之后，就相当于添加了一个第三方源。
安装epel-release
执行命令：yum -y install epel-release
GitLab安装
GitLab-Runner简介

GitLab-Runner是配合GitLab-CI进行使用的。一般地，GitLab里面的每一个工程都会定义一个属于这个工程的软件集成脚本，用来自动化地完成一些软件集成工作。当这个工程的仓库代码发生变动时，比如有人push了代码，GitLab就会将这个变动通知GitLab-CI。这时GitLab-CI会找出与这个工程相关联的Runner，并通知这些Runner把代码更新到本地并执行预定义好的执行脚本。所以，GitLab-Runner就是一个用来执行软件集成脚本的东西。你可以想象一下：Runner就像一个个的工人，而GitLab-CI就是这些工人的一个管理中心，所有工人都要在GitLab-CI里面登记注册，并且表明自己是为哪个工程服务的。当相应的工程发生变化时，GitLab-CI就会通知相应的工人执行软件集成脚本。 
如图GitLab-CI与GitLab-Runner关系示意图:
Lcoal Image
安装gitlab-ci-multi-runner

下载安装包：curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.rpm.sh | sudo bash
执行安装：yum install gitlab-ci-multi-runner
登录gitlab查找需要使用runner用户的项目，获取token等信息，如图： Local Image

注册runner用户

执行命令：gitlab-ci-multi-runner register
输入gitlab-ci coordinator URL地址
输入gitlab-ci token for this runner所属token
输入gitlab-ci description for this runner名称 
如图: Local Image
查看gitlab-runner配置信息 执行命令：vi /etc/gitlab-runner/config.toml 
如图: Local Image
查看runner用户集合 执行命令：gitlab-ci-multi-runner list 
如图： Lcoal Image
配置安装weim-test配置运行环境

执行卸载命令：gitlab-ci-multi-runner uninstall
安装执行命令：gitlab-ci-multi-runner install weim-test --working-directory /home/gitlab-runner --config /etc/gitlab-runner/config.toml --service gitlab-runner --user root
安装执行命令介绍

-c, --config选项
这个选项是用来指定配置文件路径的。如果你想同时运行多个Runner，你必须得知道你要运行哪些Runner以及这些Runner运行时所需要的信息。而前面我们说过，配置文件里面就存放着Runner运行时所需要的信息。而且一个配置文件是可以存放多个Runner的信息的。如果不指定这个选项，就会使用默认的配置文件。
-n, --service选项
这个选项是用来指定服务的别名的。为什么要有这个选项呢？指定别名有什么意义呢？我们从上一个选项可以看出来，一次只能运行一批Runner，因为一次只能指定一个配置文件。那如果我有多个配置文件，我要运行多批Runner，那是不是给每一次批量运行服务取不同的别名来区分更好一点呢。
-d, --working-directory选项
这个选项是用来指定此次批量运行服务的工作目录的。如果自己没有指定builds_dir的话，此次运行起来的Runner会把builds_dir放到这个目录里面。
-u, --user选项
这个选项很重要，它指定了该以什么用户权限来运行Runner。为了安全，我认为不应该给运行Runner的用户过高的权限，更不应该以root用户来运行Runner。
--syslog选项
如果指定了这个选项，则把日志记录到系统日志。

systemctl加入自建服务 执行命令：vi /etc/systemd/system/gitlab-runner.service

如图： Local Image

重新加载自建服务 执行命令：systemctl daemon-reload
启动gitlab-ci-multi-runner 执行命令：gitlab-ci-multi-runner run
启动指定runner weim-test 执行命令：gitlab-ci-multi-runner start weim-test
常用gitlab-runner命令

停止：gitlab-ci-multi-runner stop
启动：gitlab-ci-multi-runner start
查看：gitlab-ci-multi-runner list
卸载：gitlab-ci-multi-runner uninstall
设置指示此运行器是否可以在没有标记的情况下选择作业 
如图： Local Image

gitlab跨服务器拉取代码（如果存在跨服务器拉取代码，需要在服务器执行如下命令）

创建项目存放在服务器目录 
执行命令：mkdir -p 项目文档目录
克隆拉取代码 
执行命令：git clone 项目git地址 
输入git帐号 
输入git帐号密码
免密登录 
执行命令：git config credential.helper store
切换分支 
执行命令：git checkout 分支名称
查看分支 
执行命令：git branch
拉取代码 
执行命令：git pull

Ansible安装
集群管理服务器Ansible安装及配置(test-m1)

安装命令 
yum -y install ansible
查看ansible版本命令 
ansible --version
资源机生成密钥 
ssh-keygen
下发集群管理服务器密钥到客户集群机 
在服务机（ansible安装机器）运行以下命令、复制公钥到客户机（如有多台客户机，每一台都要执行），执行命令如下：
ssh-copy-id -i ~/.ssh/id_rsa.pub -p 22 客户机用户帐号@客户机IP (如果内网可以访问，尽量使用内网)
如图: Local Image
在服务机用ssh连接客户机，输入客户机用户名和密码，验证登录是否成功，如果登录成功，表示免密操作已成功，接着使用exit退出客户机，返回服务主机。
编辑ansible hosts文件建立服务主机和客户主机关系

执行命令：vim /etc/ansible/hosts
添加服务主机和客户机配置如图： Local Image
验证ansible免密登录到各台客户机是否成功

执行命令：ansible 客户机IP映射名称 -m ping
如图： Local Image

Docker安装
集群管理服务器Docker安装

执行命令：yum -y install docker
查看docker版本：docker -v
安装docker-compose执行命令：curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
docker-compose添加权限

执行命令：chmod +x /usr/local/bin/docker-compose

配置docker REGISTRY 私有镜像仓库

执行命令：vi /etc/sysconfig/docker
新增如下配置 
ADD_REGISTRY='--add-registry registry-srv:5000' 
DOCKER_OPTS="--insecure-registry registry-srv:5000" 
INSECURE_REGISTRY='--insecure-registry registry-srv:5000' 
如图： Local Image
配置docker REGISTRY 私有镜像仓库hosts地址
执行命令：vi /etc/hosts
新增如下配置（IP内网和外网都可以，建议如果资源机在可以使用内网，尽量使用内网） 
Docker Registry(镜像仓库) IP地址 registry-srv

如图： Local Image
启动docker
执行启动命令：systemctl start docker
设置开机启动：systemctl enable docker
获取docker服务器主机swarm node节点token信息 执行命令：docker swarm init --advertise-addr Docker集群管理机IP地址（建议使用内网） 
如图： Lcoal Image
docker服务器主机swarm node节点token信息，建议最好保存下来，后续客户服务器会使用到此token进行集群
查看已配置的swarm 节点信息 执行命令：docker node list 
如图： Local Image

注意事项 
gitlab-ci.yml自动部署文件涉及docker compose中涉及文件目录的一定要在集群服务器各台服务进行新建目录，特别volumes中设计的目录。

Maven安装
maven安装(可选安装)
安装epel-apache-maven 
执行命令：yum-config-manager --add-repo http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo 
如图： Local Image
查看是否开启epel-apache-maven仓库 
执行命令：yum-config-manager --enable epel-apache-maven 
如图： Local Image
安装apache-maven 
执行命令：yum install -y apache-maven 
如图： Local Image
查看maven版本 
执行命令：mvn -version
maven环境变量 
Maven环境变量一般安装完成后默认的配置就可以，如不适用默认配置，可以自己根据情况对环境变量进行设置

Nodejs安装
Nodejs安装(可选安装)
安装Nodejs 
执行命令：yum install -y nodejs
强制清除npm缓存（可选执行）： 
执行命令：npm cache clean --force
全局安装node n模块 
执行命令：npm install -g n 
如图： Local Image
升级node.js到最新稳定版
执行命令：n stable
命令解释： 
stable：最新稳定版本 
n后面也可以跟随版本号比如： 
n v0.10.26
查看nodejs版本 
执行命令：node -v
安装npm 
执行命令：npm install -g npm
查看npm版本 
npm -v

集群工作服务器
集群工作服务器指集群的所有已添加到集群节点的服务，这些服务的管理者为集群管理服务器，每一个集群工作服务器都相当于集群管理服务器的一个node。

Dokcer安装
集群工作服务器Dokcer安装
安装docker
执行命令：yum -y install docker
查看docker版本：docker -v
下载docker-compose
执行命令
curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
docker-compose设置执行权限
chmod +x /usr/local/bin/docker-compose
配置docker REGISTRY 私有镜像仓库hosts地址
执行命令
vi /etc/hosts
新增如下配置（IP内网和外网都可以，建议如果资源机在可以使用内网，尽量使用内网）
Dokcer Registry(镜像仓储)IP地址 registry-srv 
如图： Local Image
配置docker REGISTRY 私有镜像仓库
执行命令
vi /etc/sysconfig/docker
新增如下配置

ADD_REGISTRY='--add-registry registry-srv:5000' 
DOCKER_OPTS="--insecure-registry registry-srv:5000" 
INSECURE_REGISTRY='--insecure-registry registry-srv:5000' 
如图： Local Image
启动docker
启动命令：systemctl start docker
设置开机启动：systemctl enable docker
添加swarm node节点
执行命令：docker swarm join-token worker
在集群管理服务机（test-m1）执行命令后将输出的内容复制到docker client机进行执行，添加swarm docker node
如图（集群管理服务机test-m1）： Lcoal Image
集群工作服务器（client 服务器）执行完成后台，在集群管理服务机（test-m1）查看集群节点信息（具体命令见下一步骤）
集群管理服务机查看集群节点
执行命令：docker node list
如图： Local Image
重启docker
重启原因 
添加docker REGISTRY 私有镜像仓库、swarm node节点，docker集群配置发生改变，可能会导致集群后node节点已加入集群管理，但是在发布时部署的服务(service)无法选择此节点，因此需要重启客户集群服务器docker容器。
重启命令： 
systemctl daemon-reload 
systemctl restart docker
如果上面的命令执行后服务依然无法加入此节点，可以使用如下命令 
reboot 
systemctl daemon-reload 
systemctl restart docker
注意事项 
gitlab-ci.yml自动部署文件涉及docker compose中涉及文件目录的一定要在集群服务器各台服务进行新建目录，特别volumes中设计的目录。

Dockerfile简介
Dockerfile是由一系列命令和参数构成的脚本，这些命令应用于基础镜像并最终创建一个新的镜像。它们简化了从头到尾的流程并极大的简化了部署工作。Dockerfile从FROM命令开始，紧接着跟随者各种方法，命令和参数。其产出为一个新的可以用于创建容器的镜像。
Dockerfile 语法示例
代码配置 
Dockerfile服务端实例
FROM openjdk:8-jre-alpine
VOLUME /tmp
ADD im-service-message-1.0.0.jar app.jar
ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -jar /app.jar"]
Dockerfile前端实例
FROM nginx
MAINTAINER bmd <https://github.com/bmd080>
RUN rm /etc/nginx/conf.d/default.conf
ADD nginx/prod.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
COPY ./cert /usr/share/nginx/cert
EXPOSE 443
Dockerfile 命令

ADD

ADD命令有两个参数，源和目标。它的基本作用是从源系统的文件系统上复制文件到目标容器的文件系统。如果源是一个URL，那该URL的内容将被下载并复制到容器中。
Usage: ADD [source directory or URL] [destination directory] 
ADD /my_app_folder /my_app_folder 

CMD

和RUN命令相似，CMD可以用于执行特定的命令。和RUN不同的是，这些命令不是在镜像构建的过程中执行的，而是在用镜像构建容器后被调用。

ENTRYPOINT
配置容器启动后执行的命令，并且不可被 docker run 提供的参数覆盖。
每个 Dockerfile 中只能有一个 ENTRYPOINT，当指定多个时，只有最后一个起效。
ENTRYPOINT 帮助你配置一个容器使之可执行化，如果你结合CMD命令和ENTRYPOINT命令，你可以从CMD命令中移除“application”而仅仅保留参数，参数将传递给ENTRYPOINT命令。

ENV
ENV命令用于设置环境变量。这些变量以”key=value”的形式存在，并可以在容器内被脚本或者程序调用。这个机制给在容器中运行应用带来了极大的便利。
Usage: ENV key value 
ENV SERVER_WORKS 4 

EXPOSE
EXPOSE用来指定端口，使容器内的应用可以通过端口和外界交互。
Usage: EXPOSE [port] 
EXPOSE 8080

FROM
FROM命令可能是最重要的Dockerfile命令。改命令定义了使用哪个基础镜像启动构建流程。基础镜像可以为任意镜 像。如果基础镜像没有被发现，Docker将试图从Docker image index来查找该镜像。FROM命令必须是Dockerfile的首个命令。
Usage: FROM [image name] 
FROM ubuntu 

MAINTAINER
建议这个命令放在Dockerfile的起始部分，虽然理论上它可以放置于Dockerfile的任意位置。这个命令用于声明作者，并应该放在FROM的后面。
Usage: MAINTAINER [name] 
MAINTAINER authors_name 

RUN
RUN命令是Dockerfile执行命令的核心部分。它接受命令作为参数并用于创建镜像。不像CMD命令，RUN命令用于创建镜像（在之前commit的层之上形成新的层）。
Usage: RUN [command] 
RUN aptitude install -y riak 

USER
USER命令用于设置运行容器的UID。
Usage: USER [UID] 
USER 751 

VOLUME
VOLUME命令用于让你的容器访问宿主机上的目录。
Usage: VOLUME ["/dir_1", "/dir_2" ..] 
VOLUME ["/my_files"] 

WORKDIR
WORKDIR命令用于设置CMD指明的命令的运行目录。 Usage: WORKDIR /path WORKDIR ~/

gitlab-ci实例
gitlab-ci文件在项目的根目录下，CI文件主要功能是实现自动化部署的脚本。.gitlab-ci.yml文件被用来管理项目的runner 任务。 Local Image 代码配置 gitlab-ci.yml实例

stages:
- 清理环境
- 准备环境
- 程序构建
- 镜像推送
- 服务发布
- 单独发布

# 常量参数
variables:
  # registry
  REGISTRY_PATH: registry-srv:5000

  # logs path
  LOGS_PATH: /usr/share/im-service/logs

  # elk
  ELASTIC_DATA: /root/docker/elastic/data
  LOGSTASH_CONF: /root/docker/logstash/conf

  # deploy file path
  DEPLOY_PATH: /root/docker/service

  # sleep wait time
  WAIT_TIME: 10
  WAIT_TIME_DEFINE: 15

# 清理环境
101清理代码:
  stage: 清理环境
  script:
  - echo "清理代码开始>>>"
  - mvn clean
  - echo "清理代码结束<<<"
  when: manual

102清理服务:
  stage: 清理环境
  script:
  - echo "清理服务开始>>>"
  - echo "清理前服务列表-->"
  - ansible weim-master -m shell -a "docker service list" -u root
  - ansible weim-master -m shell -a "docker service list|grep im-service|awk '{print \$1 }'|sort -u|xargs -r docker service rm" -u root
  - echo "清理后服务列表-->"
  - ansible weim-master -m shell -a "docker service list" -u root
  - echo "清理服务结束<<<"
  when: manual

103清理容器:
  stage: 清理环境
  script:
  - echo "清理容器开始>>>"
  - echo "清理前容器列表-->"
  - ansible weim-client -m shell -a "docker container list" -u root
  - ansible weim-client -m shell -a "docker container list|grep im-service|awk '{print \$1 }'|sort -u|xargs -r docker container stop" -u root
  - ansible weim-client -m shell -a "docker container list -a|grep im-service|awk '{print \$1 }'|sort -u|xargs -r docker container rm" -u root
  - echo "清理后容器列表-->"
  - ansible weim-client -m shell -a "docker container list" -u root
  - echo "清理容器结束<<<"
  when: manual

104清理镜像:
  stage: 清理环境
  script:
  - echo "清理镜像开始>>>"
  - echo "清理前资源机镜像列表-->"
  - ansible weim-master -m shell -a "docker image list" -u root
  - ansible weim-master -m shell -a "docker images|grep none|awk '{print \$3 }'|sort -u|xargs -r docker rmi --force" -u root
  - ansible weim-master -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-master -m shell -a "docker images|grep im-service|awk '{print \$3 }'|sort -u|xargs -r docker rmi --force" -u root
  - ansible weim-master -m command -a "sleep $WAIT_TIME_DEFINE" -u root
  - echo "清理后资源主机镜像列表-->"
  - ansible weim-master -m shell -a "docker image list" -u root
  - echo "清理前部署机上镜像列表-->"
  - ansible weim-client -m shell -a "docker image list" -u root
  - ansible weim-client -m shell -a "docker images|grep none|awk '{print \$3 }'|sort -u|xargs -r docker rmi --force" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-client -m shell -a "docker images|grep im-service|awk '{print \$3 }'|sort -u|xargs -r docker rmi --force" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME_DEFINE" -u root
  - echo "清理后部署机镜像列表-->"
  - ansible client -m shell -a "docker image list" -u root
  - echo "清理镜像结束<<<"
  when: manual

105清理网络:
  stage: 清理环境
  script:
  - echo "清理网络开始>>>"
  - echo "清理前网络列表-->"
  - ansible weim-master -m shell -a "docker network list" -u root
  # - ansible weim-master -m shell -a "docker network list|grep monitor|awk '{print \$1 }'|sort -u|xargs -r docker network rm" -u root
  - ansible weim-master -m shell -a "docker network list|grep im-service|awk '{print \$1 }'|sort -u|xargs -r docker network rm" -u root
  - echo "清理后网络列表-->"
  - ansible weim-master -m shell -a "docker network list" -u root
  - echo "清理网络结束<<<"
  when: manual

# 准备环境
201准备路径:
  stage: 准备环境
  script:
  - echo "准备环境开始>>>"
  # logs path
  - echo $LOGS_PATH
  - ansible weim-client -m shell -a "mkdir -m 777 -p $LOGS_PATH" -u root
  - echo "准备环境结束<<<"
  when: manual

202创建网络:
  stage: 准备环境
  script:
  - echo "创建网络开始>>>"
  - echo "创建前网络列表-->"
  - ansible weim-master -m shell -a "docker network list" -u root
  # - ansible weim-master -m shell -a "docker network create -d overlay monitor-network" -u root
  - ansible weim-master -m shell -a "docker network create -d overlay im-service-network" -u root
  - echo "创建后网络列表-->"
  - ansible weim-master -m shell -a "docker network list" -u root
  - echo "创建网络结束<<<"
  when: manual

# 程序构建
301构建代码:
  stage: 程序构建
  script:
  - echo "构建代码开始>>>"
  - mvn clean install -DskipTests -DskipDocker
  - echo "构建代码结束<<<"
  when: manual

302打包镜像:
  stage: 程序构建
  script:
  - echo "打包镜像开始>>>"
  - echo "打包镜像前镜像列表-->"
  - docker image list
  - mvn clean install -DskipTests
  - echo "打包镜像后镜像列表-->"
  - docker image list
  - echo "打包镜像结束<<<"
  when: manual

# 镜像推送
401推送镜像:
  stage: 镜像推送
  script:
  - echo "推送镜像开始>>>"
  - echo "推送前镜像列表-->"
  - docker image list
  - docker tag im-service/im-service-message:latest $REGISTRY_PATH/im-service/im-service-message:latest
  - docker push $REGISTRY_PATH/im-service/im-service-message:latest
  - docker tag im-service/im-service-user:latest $REGISTRY_PATH/im-service/im-service-user:latest
  - docker push $REGISTRY_PATH/im-service/im-service-user:latest

  - echo "推送后镜像列表-->"
  - docker image list
  - echo "推送镜像结束<<<"
  when: manual

# 服务发布
501部署各业务服务模块:
  stage: 服务发布
  script:
  - echo "部署业务服务模块开始>>>"
  - echo "部署前服务列表-->"
  - ansible weim-master -m shell -a "docker service list|grep 'im-service'|awk '{print \$1 }'|sort -u|xargs -r docker service rm" -u root
  - ansible weim-master -m command -a "sleep $WAIT_TIME_DEFINE" -u root
  - ansible weim-client -m shell -a "docker container list -a|grep 'im-service'|awk '{print \$1 }'|sort -u|xargs -r docker container rm" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME_DEFINE" -u root
  - ansible weim-client -m shell -a "docker images|grep 'im-service'|awk '{print \$3 }'|sort -u|xargs -r docker rmi --force" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME_DEFINE" -u root
  - ansible weim-master -m shell -a "docker stack deploy -c $DEPLOY_PATH/0003-im-service-step-001.yml im-service" -u root
  - echo "部署后服务列表-->"
  - ansible weim-master -m shell -a "docker service list" -u root
  - echo "部署业务服务模块结束<<<"
  when: manual

601单独部署消息模块:
  stage: 单独发布
  script:
  - echo "单独部署消息模块开始>>>"
  - echo "构建代码和镜像开始>>>"
  - cd ./im-service/im-service-message
  - mvn clean install -DskipTests
  - cd ../..
  #  - ls -lah
  - echo "构建代码和镜像结束>>>"
  - echo "推送镜像到私服开始>>>"
  - echo "推送前镜像列表-->"
  - docker image list
  - docker tag im-service/im-service-message:latest $REGISTRY_PATH/im-service/im-service-message:latest
  - docker push $REGISTRY_PATH/im-service/im-service-message:latest
  - echo "推送后镜像列表-->"
  - docker image list
  - echo "推送镜像到私服结束<<<"
  - echo "部署业务服务模块开始>>>"
  - echo "部署前服务列表-->"
  - ansible weim-master -m shell -a "docker service list|grep 'im-service-message'|awk '{print \$1 }'|sort -u|xargs -r docker service rm" -u root
  - ansible weim-master -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-client -m shell -a "docker container list -a|grep 'im-service-message'|awk '{print \$1 }'|sort -u|xargs -r docker container rm" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-client -m shell -a "docker images|grep 'im-service-message'|awk '{print \$3 }'|sort -u|xargs -r docker rmi --force" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-master -m shell -a "docker service list" -u root
  - ansible weim-master -m shell -a "docker stack deploy -c $DEPLOY_PATH/0601-im-service-message.yml im-service" -u root
  - echo "部署后服务列表-->"
  - ansible weim-master -m shell -a "docker service list" -u root
  - echo "部署业务服务模块结束<<<"
  - echo "单独部署消息模块结束<<<"
  when: manual

602单独部署用户模块:
  stage: 单独发布
  script:
  - echo "单独部署用户模块开始>>>"
  - echo "构建代码和镜像开始>>>"
  - cd ./im-service/im-service-user
  - mvn clean install -DskipTests
  - cd ../..
  #  - ls -lah
  - echo "构建代码和镜像结束>>>"
  - echo "推送镜像到私服开始>>>"
  - echo "推送前镜像列表-->"
  - docker image list
  - docker tag im-service/im-service-user:latest $REGISTRY_PATH/im-service/im-service-user:latest
  - docker push $REGISTRY_PATH/im-service/im-service-user:latest
  - echo "推送后镜像列表-->"
  - docker image list
  - echo "推送镜像到私服结束<<<"
  - echo "部署业务服务模块开始>>>"
  - echo "部署前服务列表-->"
  - ansible weim-master -m shell -a "docker service list|grep 'im-service-user'|awk '{print \$1 }'|sort -u|xargs -r docker service rm" -u root
  - ansible weim-master -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-client -m shell -a "docker container list -a|grep 'im-service-user'|awk '{print \$1 }'|sort -u|xargs -r docker container rm" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-client -m shell -a "docker images|grep 'im-service-user'|awk '{print \$3 }'|sort -u|xargs -r docker rmi --force" -u root
  - ansible weim-client -m command -a "sleep $WAIT_TIME" -u root
  - ansible weim-master -m shell -a "docker service list" -u root
  - ansible weim-master -m shell -a "docker stack deploy -c $DEPLOY_PATH/0602-im-service-user.yml im-service" -u root
  - echo "部署后服务列表-->"
  - ansible weim-master -m shell -a "docker service list" -u root
  - echo "部署业务服务模块结束<<<"
  - echo "单独部署用户模块结束<<<"
  when: manual


  基础服务Portainer和Visualizer实例
Portainer Swram集群可视化管理界面 Local Image
Visualizer 集群服务可视化节点状态界面 Lcoal Image
代码配置 docker compose Portainer和Visualizer实例

# docker view
version: "3"

services:
  visualizer:
    image: dockersamples/visualizer:latest
    environment:
      - TZ=Asia/Shanghai
    networks:
      monitor-network:
        aliases:
        - visualizer
    ports:
    - "38080:8080"
    volumes:
    - "/var/run/docker.sock:/var/run/docker.sock"
    deploy:
      replicas: 1
      placement:
        constraints: [node.role == manager]

  portainer_agent:
    image: portainer/agent:latest
    environment:
      - TZ=Asia/Shanghai
      - AGENT_CLUSTER_ADDR=tasks.portainer_agent
#      - AGENT_PORT: 9001
#      - LOG_LEVEL: debug
    networks:
      monitor-network:
        aliases:
        - portainer_agent
#    ports:
#      - target: 9001
#        published: 9001
#        protocol: tcp
#        mode: host
    volumes:
    - "/var/run/docker.sock:/var/run/docker.sock"
    - "/var/lib/docker/volumes:/var/lib/docker/volumes"
    deploy:
      mode: global
      placement:
        constraints: [node.platform.os == linux]

  portainer:
    image: portainer/portainer:latest
    environment:
      - TZ=Asia/Shanghai
    command: -H tcp://tasks.portainer_agent:9001 --tlsskipverify
    networks:
      monitor-network:
        aliases:
        - portainer
    ports:
    - "39000:9000"
    restart: always
    volumes:
    - /root/docker/portainer/data:/data
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints: [node.role == manager]

networks:
  monitor-network:
    external:
      name: monitor-network

# docker network create --driver overlay --attachable monitor-network

docker compose实例
代码配置

注意事项 
gitlab-ci.yml自动部署文件涉及docker compose中涉及文件目录的一定要在集群服务器各台服务进行新建目录，特别volumes中设计的目录。
docker compose实例

# 05 modules service
version: "3"

services:
# 0601 消息服务
  im-service-message:
    image: "registry-srv:5000/im-service/im-service-message:latest"
    hostname: im-service-message
    environment:
    - TZ=Asia/Shanghai
    - config.active=test
    - zipkin.host=customer-zipkin
    - zipkin.port=9411
    ports:
    - "8081:8081"
    networks:
      im-service-network:
        aliases:
        - im-service-message:latest
    volumes:
    - /usr/share/im-service/logs:/home/im/logs
#    logging:
#      driver: syslog
#      options:
#        syslog-address: 'tcp://10.0.0.17:35000'
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.10'
          memory: 64M
      replicas: 1
      restart_policy:
        condition: any

networks:
  im-service-network:
    external: true


    Ansible常用命令
ansible介绍
ansible 默认提供了很多模块来供我们使用。在 Linux 中，我们可以通过 ansible-doc -l 命令查看到当前 ansible 都支持哪些模块，通过 ansible-doc -s 模块名 又可以查看该模块有哪些参数可以使用。
我们常用的几个模块
copy、file、cron、group、user、yum、service、script、ping、command、raw、get_url、synchronize
常用命令
检查主机连接：ansible test -m ping
执行远程命令：ansible test -m command -a 'uptime'
执行主控端脚本：ansible test -m script -a '/etc/ansible/script/test.sh'
执行远程主机的脚本： ansible test -m shell -a 'ps aux|grep zabbix'
类似shell：ansible test -m raw -a "ps aux|grep zabbix|awk '{print $2}'"
创建软链接：ansible test -m file -a "src=/etc/resolv.conf dest=/tmp/resolv.conf state=link"
删除软链接：ansible test -m file -a "path=/tmp/resolv.conf state=absent"
复制文件到远程服务器：ansible test -m copy -a "src=/etc/ansible/ansible.cfg dest=/tmp/ansible.cfg owner=root group=root mode=0644"
指定主机：ansible -i /etc/ansible/hosts all -m copy -a "src=test.conf dest=/etc/test.conf owner=root group=root mode=0644"

Docker常用命令
Docker常用命令
查看容器：docker container list
查看服务：docker service list
查看镜像：docker image list
查看日志：docker logs 容器ID
查看节点：docker node list
查看网络：docker network list
删除节点：docker node rm 需要删除的node ID
启动一个或多个已经被停止的容器: docker start [OPTIONS] CONTAINER [CONTAINER...]
停止一个运行中的容器: docker stop [OPTIONS] CONTAINER [CONTAINER...]
重启容器: docker restart [OPTIONS] CONTAINER [CONTAINER...]
删除一个或多少容器：docker rm [OPTIONS] CONTAINER [CONTAINER...]
列出容器：docker ps
从镜像仓库中拉取或者更新指定镜像：docker pull [OPTIONS] NAME[:TAG|@DIGEST]
将本地的镜像上传到镜像仓库,要先登陆到镜像仓库：docker push [OPTIONS] NAME[:TAG]
从Docker Hub查找镜像：docker search [OPTIONS] TERM
标记本地镜像，将其归入某一仓库：docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]
Docker常用命令资料
参考资料地址
https://www.runoob.com/docker/docker-command-manual.html
