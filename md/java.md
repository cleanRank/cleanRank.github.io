开发环境比较简单，这里列出了主要的环境工具和开发工具，其他诸如 SSH 、FTP、数据库客户端等工具，取用自己习惯的就好。

JDK
MAVEN
GIT
SVN
NODE
版本: 1.8+ x64位

安装完毕，配置JAVA环境变量，建议安装在D盘。

在控制台输入 java -version 查看是否能输出版本号，如果不能则表明环境变量配置错误。

本地开发环境可以使用Oracle的JDK，推荐使用OpenJDK。 测试和生产上使用的是OpenJDK，所以在编码的时候，不要使用OracleJDK特有的工具类。
版本: 3.5+

在官网下载压缩包后，在D盘解压，并配置maven环境变量。

在控制台输入 mvn -v 查看是否能输出版本号，如果不能则表明环境变量配置错误。

在D盘找一个新目录作为maven仓库，修改配置文件的仓库目录。

默认目录在C盘用户名下，使用默认目录，有时候会因权限问题，导致拉取jar失败。
版本: 2.16+

安装的时候，选择安装minigw shell，用于git控制台管理，安装完毕，配置环境变量。

在控制台输入 git --version 查看是否能输出版本号，如果不能则表明环境变量配置错误。

在控制台中设置用户名和个人公司邮箱(email@beadwallet.com)：

    git config --global user.name "username"
    git config --global user.email "userEmail@beadwallet.com"
具体参照 Git修改用户名和邮箱方法

后台开发推荐使用Idea

前端开发推荐使用 vscode 或者 webstorm

IDEA中设置maven时, 注意仓库配置文件，配置文件里面不用设置仓库中心地址 Local Image

IDEA注释设置：
Settings->Editor->File and Code Templates选择Includes标签页,然后在右侧输入

    /**
     * 注释说明
     *
     * @author ${USER}
     * Date: ${DATE} ${HOUR}:${MINUTE}
     */
IDEA插件安装：

Lombok
Alibaba Java Coding Guidelines