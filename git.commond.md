
# git 常用命令
	git init
	git status
	git add
	git commit
	git clone
	git remote
	git fetch
	git pull
	git push
	git diff
	git rm
	git mv
	git rebase
	git log




# 一般而言，git常用流程为: git init -> git pull -> git add -> git commit -> git push


# git init
	初始化一个本地git缓存


# git status 
	查看文件当前状态
	-s 查看状态的精简版
	--short 查看状态的精简版


# git add <directory/file>
	添加文件到本地git缓存
	
	如 git add a/a.ext
	添加当前目录下子目录a下的a.ext文件到git缓存区
	
	如 git add .
	添加当前目录以及子目录下所有文件到git缓存区


# git commit -m '<本次提交的注释说明语句>'
	git commit -a -m '说明文本' #跳过使用暂存区域的方式，将所有已跟踪过的文件暂存起来一并提交
	git commit --amend #尝试重新提交，为了合并漏掉前的提交，共计一次提交


# git clone <版本库的网址>
	
	如
	git clone https://github.com/jquery/jquery.git
	该命令会在本地主机生成一个目录，与远程主机的版本库同名。如果要指定不同的目录名，可以将目录名作为git clone命令的第二个参数
	
	git clone <版本库的网址> <本地目录名>
	该命令克隆已存在的url指定git仓库到当前目录，当前目录将新建名为name的仓库文件夹（所有数据）

	git clone <版本库的网址> -b <远程分支名> --single-branch <本地目录名>
	该命令克隆已存在的url指定git仓库的指定分支到当前目录，当前目录将新建名为name的仓库文件夹


# git remote
	
	查看
	git remote show <主机名>
	如 git remote show origin
	该命令可以查看别名为origin的远程主机的详细信息
	
	添加
	git remote add <主机名> <git仓库网址>
	如 git remote add origin https://github.com/jquery/jquery.git
	该命令会添加一个远程主机，同时别名为origin

	删除
	git remote rm <主机名>
	如 git remote rm origin
	该命令会删除一个别名为origin的主机

	重命名
	git remote rename <原主机名> <新主机名>
	如 git remote rename origin newname
	该命令会重命名一个别名为origin的主机，新别名为newname	


# git fetch

	默认情况下，git fetch取回所有分支（branch）的更新
	git fetch
	
	如果只想取回特定分支的更新，可以指定分支名
	git fetch <远程主机名>
	如 git fetch origin master
	所取回的更新，在本地主机上要用"远程主机名/分支名"的形式读取，比如origin主机的master，就要用origin/master读取


# git merge branch-name

	合并分支名为branch-name的内容到当前分支


# git branch
	
	查看远程分支
	git branch -r

	查看所有分支
	git branch -a
	如
	git branch -a
	* master
	remotes/origin/master
	上述表示当前分支是master，远程分支是origin/master

	git branch --set-upstream master origin/next
	上述命令会指定master分支跟踪origin/next分支

	git branch branch-name #创建指定名的分支
	git branch -d branch-name #删除本地某分支
	git branch -D branch-name #强制本地删除分支
	git push origin :branch-name #删除远程分支
	git branch --merged|no-merged #查看已合并或未合并的分支列表
	git branch -u remote/branch #修改当前分支的跟踪分支（上游分支）为指定的远程分支（@{u}或者@{upstream}可替代[remote]/[branch]表示）
	git branch branch-name HEAD@{n} #恢复已删除的分支


# git checkout

	切换分支
	git checkout <分支名>
	如 git checkout branch_name
	上述命令会从当前分支切换到branch_name的分支

	git checkout -b <分支名>
	如 git checkout -b branch_name
	上述命令会从当前分支切换到branch_name的分支，如果没有branch_name分支，则新建这个分支

	git checkout -b branch_name origin/master
	上述命令会在本地创建一个新分支，名为branch_name，并跟踪远程指定仓库origin的指定master分支


# git merge
	
	git merge origin/master
	上述命令会在本地当前分支上合并远程origin/master分支


# git rebase
	
	git rebase origin/master
	上述命令会在本地当前分支上合并远程origin/master分支


# git pull <远程主机名> <远程分支名>:<本地分支名>

	git pull origin remote_branch:local_branch
	上述命令会拉取远程origin的remote_branch分支更新，并合并到本地的local_branch分支

	如果远程分支是与当前分支合并，冒号后面的部分可以省略
	如 git pull origin next
	上述命令会拉取远程next分支并合并到当前分支，相当于 git fetch origin 和 git merge origin/next

	如果当前分支与远程分支存在跟踪关系，可以省略远程分支名
	如 git pull origin
	上述命令会拉取与当前分支存在跟踪关系的远程origin下的某个分支

	如果当前分支只有一个跟踪分支，远程主机名也可以省略
	如 git pull
	上述命令表示当前分支自动与唯一一个跟踪分支合并 

	git pull --rebase <远程主机名> <远程分支名>:<本地分支名>

	git pull -p
	等同于
	git fetch --prune origin 和 git fetch -p
	表示在本地删除远程已删除的分支


# git push <远程主机名> <本地分支名>:<远程分支名>

	git push origin local_branch:remote_branch
	上述命令会推送本地local_branch分支到远程origin的remote_branch分支

	git push origin :remote_branch
	上述命令会删除远程origin下的remote_branch分支
	等同于 git push origin --delete remote_branch

	git push origin
	上述命令会推送当前分支到远程origin下与其存在跟踪关系的分支

	git push
	上述命令表示当前分支只跟踪一个远程分支，并推送当前分支内容到远程那个唯一的跟踪分支 

	如果当前分支与多个远程主机存在跟踪关系，则可用-u指定默认主机，后续就不必加任何参数使用git push
	git push -u origin master
	上述命令表示将本地master分支推送到origin主机，同时指定origin为默认主机，后续就不必加任何参数使用git push，默认只推送当前分支，称为simple方式，与之对应还有matching方式

	git push --all origin
	上述命令表示将所有本地分支推送到origin主机
	如果远程主机版本比本地版本新，git报错，要先本地git pull后git push，若要强制推送可以git push --force


# git diff 
	查看文件未暂存状态下更改的详细位置，比较当前文件和暂存区域快照间的差异（即修改后为未暂存的变化内容）
	--cached #查看已暂存将提交的内容


# git rm *.* 从暂存区域中移除某文件
	git rm -f *.* #如删前修改过文件并已放入暂存区域则需强制删除
	git rm --cached *.* #删除git仓库中（即暂存区域），且保留在本磁盘，但不被跟踪
	如：git rm log/\*.log 


# git tag 查看标签
	git tag -l 'v.x.x.*' #查看指定的标签集


# git mv file_from file_to 移动文件，可改名


# git rebase [branch] 
	变基操作，即将指定分支应用了当前分支到其共同祖先的依次修改，然后merge切回之前的那个分支
	git rebase --onto [basebranch] [topicbranch] [subtopicbranch] 
	将忽略topicbranch，并将subtopicbranch中相对topicbranch独有部分应用到basebranch中，后配合 git merge subtopicbranch使用
	git rebase [basebranch] [topicbranch] #将topicbranch的修改应用到basebranch中


# git log [-p] [-2] [--stat] [--pretty[=[online|format:"%h - %an, %ar:%s"|]]]
	查看日志,-p显示每次提交内容差异，-2显示近两次提交差异,--stat查看统计信息

# git reflog
	查看具体分支提交日志

# git reset HEAD *.* 取消暂存某文件

# git reset --hard HEAD~[n]
  重置到某次commit记录


# .gitignore 
     #文件配置，用于帮助git忽略某些不需要版本控制的文件  #开头的行和空行可理解为注释

     # no .a files
     *.a

     # but do track lib.a, even though you're ignoring .a files above
     !lib.a

     # only ignore the TODO file in the current directory, not subdir/TODO
     /TODO

     # ignore all files in the build/ directory
     build/

     # ignore doc/notes.txt, but not doc/server/arch.txt
     doc/*.txt

     # ignore all .pdf files in the doc/ directory
     doc/**/*.pdf
