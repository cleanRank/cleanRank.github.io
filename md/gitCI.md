1、centos
安装gitlab-runner
 curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash // 安装git-runner
 sudo yum install gitlab-runner

 gitlab-runner register

 填写gitlabrunner的url  
 token
 description
 tag
 选择shell

 安装nodejs 
   - npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist

   编写CI脚本

stages:
- 资源拉取
- 构建代码
- 部署程序

# 常量参数
variables:
  # registry
  REGISTRY_PATH: registry-vpc.cn-shanghai.aliyuncs.com
  # deploy file path
  DEPLOY_PATH: /usr/share/wemedia/deploy
  # version information
  VERSION_PATH: /usr/share/wemedia/version
  # build version
  VERSION_PREFIX: TEST_

  IMAGE_TAG: latest
  REPOS_TAG_PREFIX: TEST_

  # sleep wait time
  WAIT_TIME: 5

#cache:
#  paths:
#  - node_modules/

资源拉取:
  stage: 资源拉取
  script:
  - echo "资源拉取开始>>>"
  - npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist
  - echo "资源拉取结束<<<"
  tags:
    - mowan-tag
  when: manual

构建代码:
  stage: 构建代码
  script:
  - echo "构建管理前端代码开始>>>"
  - echo "资源拉取开始>>>"
  - npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist
  - echo "资源拉取结束<<<"
  - echo "构建代码开始>>>"
  - npm run build:test
  - cp -r ./web /opt/webapp/pages/
  - echo "构建代码结束<<<"
  - echo "构建管理前端代码结束<<<"
  tags:
    - mowan-tag
  when: manual

部署程序:
  stage: 部署程序
  script:
  - echo "部署管理前端开始>>>"
  - echo "资源拉取开始>>>"
  - npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist
  - echo "资源拉取结束<<<"
  - echo "构建代码开始>>>"
  - npm run build:test
  - cp -r ./web /opt/webapp/pages/
  - echo "部署业务模块结束<<<"
  - echo "部署管理前端结束<<<"
  tags:
    - mowan-tag
  when: manual
  


cp 时候提示没有权限
更改gitlab -runner 权限
   chown gitlab-runner:gitlab-runner -R ./webapp





   https://my.oschina.net/u/3667677/blog/3050890
   https://my.oschina.net/u/3667677/blog/3051522