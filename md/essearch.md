ElasticSearch是一个基于Lucene的文本检索数据库，或者叫搜索引擎，ElasticSearch在底层利用Lucene完成其索引功能，因此其许多基本概念源于Lucene。

Lucene 是一款高性能的、可扩展的信息检索（IR）工具库，是由Java语言开发的成熟、自由开源的搜索类库，基于Apache协议授权。Lucene只是一个软件类库，如果要发挥Lucene的功能，还需要开发一个调用Lucene类库的应用程序。

文档是Lucene索引和搜索的原子单位，它是包含了一个或多个域的容器，而域的值则是真正被搜索的内容。每个域都有其标识名称，通常为一个文本值或二进制值。将文档加入索引中时，需要首先将数据转换成Lucene能识别的文档和域，域值是被搜索的对象。例如，用户输入搜索内容“title:elasticsearch”时，则表示搜索“标题”域值中包含单词“elasticsearch”的所有文档。

ElasticSearch基本概念

索引(Index)

ES将数据存储于一个或多个索引中，索引是具有类似特性的文档的集合。类比传统的关系型数据库领域来说，索引相当于SQL中的一个数据库，或者一个数据存储方案(schema)。索引由其名称(必须为全小写字符)进行标识，并通过引用此名称完成文档的创建、搜索、更新及删除操作。一个ES集群中可以按需创建任意数目的索引。

类型(Type)

类型是索引内部的逻辑分区(category/partition)，然而其意义完全取决于用户需求。因此，一个索引内部可定义一个或多个类型(type)。一般来说，类型就是为那些拥有相同的域的文档做的预定义。例如，在索引中，可以定义一个用于存储用户数据的类型，一个存储日志数据的类型，以及一个存储评论数据的类型。类比传统的关系型数据库领域来说，类型相当于“表”。

文档(Document)

文档是Lucene索引和搜索的原子单位，它是包含了一个或多个域的容器，基于JSON格式进行表示。文档由一个或多个域组成，每个域拥有一个名字及一个或多个值，有多个值的域通常称为“多值域”。每个文档可以存储不同的域集，但同一类型下的文档至应该有某种程度上的相似之处。

映射(Mapping)

ES中，所有的文档在存储之前都要首先进行分析。用户可根据需要定义如何将文本分割成token、哪些token应该被过滤掉，以及哪些文本需要进行额外处理等等。另外，ES还提供了额外功能，例如将域中的内容按需排序。事实上，ES也能自动根据其值确定域的类型

节点(Node)

运行了单个实例的ES主机称为节点，它是集群的一个成员，可以存储数据、参与集群索引及搜索操作。类似于集群，节点靠其名称进行标识，默认为启动时自动生成的随机Marvel字符名称。用户可以按需要自定义任何希望使用的名称，但出于管理的目的，此名称应该尽可能有较好的识别性。节点通过为其配置的ES集群名称确定其所要加入的集群。

分片(Shard)

ES的“分片(shard)”机制可将一个索引内部的数据分布地存储于多个节点，它通过将一个索引切分为多个底层物理的Lucene索引完成索引数据的分割存储功能，这每一个物理的Lucene索引称为一个分片(shard)。

每个分片其内部都是一个全功能且独立的索引，因此可由集群中的任何主机存储。创建索引时，用户可指定其分片的数量，默认数量为5个。

Shard有两种类型：primary和replica，即主shard及副本shard。Primary shard用于文档存储，每个新的索引会自动创建5个Primary shard，当然此数量可在索引创建之前通过配置自行定义，不过，一旦创建完成，其Primary shard的数量将不可更改。

副本(Replica)

Replica shard是Primary Shard的副本，用于冗余数据及提高搜索性能。每个Primary shard默认配置了一个Replica shard，但也可以配置多个，且其数量可动态更改。ES会根据需要自动增加或减少这些Replica shard的数量。

ES集群可由多个节点组成，各Shard分布式地存储于这些节点上。

ES可自动在节点间按需要移动shard，例如增加节点或节点故障时。简而言之，分片实现了集群的分布式存储，而副本实现了其分布式处理及冗余功能。

ES 6.4版本前，安装需要xpack授权，6.4后自带xpack，这里以 6.2.4 版本安装为列

首先安装64位 openJDK 1.8+

# 安装jdk
yum install java-1.8.0-openjdk* -y

# 验证是否安装成功
java -version
ES不允许root用户运行，必须创建一个新用户和组

# 新建账号和用户组
adduser -m -g elastic 

# 设置新用户密码
passwd elastic

# 切换到新用户
su elastic
下载并解压 ElasticSearch、Kibana, 这两者的版本必须一致，否则安装会出错

# 切换到opt目录
cd /opt

# 下载Elastic 和 Kibana 并重命名，然后解压( O 是大写的)
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.2.4.tar.gz
wget -O kibana-6.2.4.tar.gz https://artifacts.elastic.co/downloads/kibana/kibana-6.2.4-linux-x86_64.tar.gz

# 解压
tar -xzf elasticsearch-6.2.4.tar.gz 
tar -xzf kibana-6.2.4.tar.gz
设置环境变量

# 切换到 root 用户
su root

# 打开 profile 文件
vi /etc/profile

# 新增环境变量
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.201.b09-2.el7_6.x86_64
export CLASS_PATH=$JAVA_HOME/lib/*.*
export PATH=$JAVA_HOME/bin:/opt/elasticsearch-6.2.4/bin:/opt/kibana-6.2.4/bin:$PATH 

# 保存并退出 vim 并刷新环境变量
source /etc/profile
安装 Xpack 到 ES 和 Kibana, 操作顺序不能反了

# 进入 ES 的 bin 目录
cd /opt/elasticsearch-6.2.4/bin

# 安装 XPack 插件
./elasticsearch-plugin install x-pack

# 启动ES
./elasticsearch

# 进入 x-pack 目录
cd x-pack

# 设置用户名和密码
setup-passwords elastic

# 这里设置的时候，顺带设置了 Kibana 和 logstash 的账号密码
# 设置的时候要注意当前的密码究竟是哪个工具的

# 进入 Kibana 的 bin 目录
cd ../../../kibana-6.2.4/bin/

# 安装 x-pack 插件
./kibana-plugin install x-pack

# 进入 Kibana 的 config 目录
cd ../config/

# 打开 kibana 配置文件
vi kibana.yml 

# 修改 ES 的登录账号和密码
elasticsearch.username: "elastic"
elasticsearch.password: "elastic"

# 因为是在本机，所以不必设置 ES 的主机地址，否则也要修改主机地址，0.0.0.0 为任何主机皆可访问
server.host: "0.0.0.0"

# 保存并退出 vim
杀掉正在运行的 ES 的进程，用守护进程的方式启动 Elastic 和 Kibana

nohup elasticsearch &
nohup kibana &
通过浏览器访问 Kibana ，默认端口是 5601，登录 Kibana 后就可以操作 ES 了

DSL 是 Domain Specific Language 的缩写，意思就是特定领域下的语言，与DSL对应的就是通用编程语言，比如Java/C/C++这种。换个通俗易懂的说法，DSL是对模型化的理解和使用方式，为了解决某些特定场景下的任务而专门设计的语言，如：

正则表达式
HTML & CSS
SQL

Elastic 支持 Restful 接口发送的 DSL 语句，操作索引和数据的增删改查

ES 的 Restful 常用操作如下：

方法	说明
PUT	新建或更新索引
POST	新增、修改或删除数据
GET	查询索引或数据
DELETE	删除索引或数据
示例：
修改索引
PUT wenewrs-storage/_mapping/shop-goods
{
"properties": {
    "shopStatus": {
        "type": "integer",
        "store":"false"
    }
}
}
删除数据
POST wenewrs-history-word-dev/history-word/_delete_by_query?refresh
{
    "query": {
        "match_all": {}
    }
}
查询索引信息
GET wenewrs-storage/storage-info/_mapping
查询数据
GET wenewrs-storage/_search
{
"query": {
    "match_all": {}
}
}

Elastic 也是有数据类型的

ES 的类型通常在新建mapping的时候确定，mapping新建成功后，就不允许修改数据类型了。

mapping 字段注意事项

"store":"true" 保存内容,查询可见,如果是不重要的内容,存入ES只是为了作为查询条件,查询时不需要返回则为 false

long 类型如果存时间戳，数字位数多的时候,在 kibana 中查询时精度不准确的问题不用考虑，ES中记录的正确，只是kibana在处理的时候显示错误

date 类型ES保存的也是正确的， 也是 kibana 在处理的时候用的时区不一样，导致展示时少了8小时，也不用考虑

ik分词分两种分析器：ik_smart： 尽可能少的进行分词；ik_max_word： 尽可能多的进行分词

ES 常见类型与 Java 对应关系
ES类型	Java类型	说明
string	String	字符串
text	String	进行分词
keyword	String	不分词
long	Long	64位
integer	Integer	32位
double	Double	64位
float	Float	32位
byte	Byte	8位
boolean	Boolean	布尔值
date	Date	日期
object	Object	对象类型,单个JSON
array	Array	数组对象，JSON数组也可以
geo_point	String	经纬度坐标(用","隔开)，维度在前，经度在后，也可以用数组方式

ES 把数据存放到一个或者多个索引中，我们对数据的增删改查都是基于索引的。
6.x 版本前，每个索引要有 type，相当于关系型数据库的表，但6.x版本后取消了。
ES 不允许修改字段。
创建
DSL 语句

PUT    /indexName
{
  “settings”:{......},
  “mappings”:{“indexType”:{“properties”:{......}}}
}

示例

  PUT /wenewrs-word
  {
      "settings": {
          "number_of_shards": 8,
          "index.refresh_interval": "30s"
      },
      "mappings": {
          "history-word": {
              "properties": {
                  "dataId":{
                      "type":"keyword",
                      "store":"true"
                  },
                  "userId": {
                      "type": "long",
                      "store":"true"
                  },
                  "createTime": {
                      "type": "date",
                      "store":"true",
                      "format":"yyyy-MM-dd HH:mm:ss.SSS"
                  },
                  "goodsWords": {
                      "type": "keyword",
                      "store":"true"
                  },
                  "deleteFlag": {
                      "type": "boolean",
                      "store":"true"
                  }
              }
          }
      }
  }
新增字段
DSL 语句

PUT    /indexName/_mapping/indexType
{
  “properties”:{......}
}

示例

PUT wenewrs-storage/_mapping/shop-goods
{
  "properties": {
     "shopStatus": {
        "type": "integer",
        "store":"false"
      }
  }
}
删除
DSL 语句

DELETE    /indexName

示例

删除指定索引
curl -XDELETE -u elastic:changeme http://localhost:9200/acc-apply-2018.08.09
{"acknowledged":true}
删除多个指定索引，中间用逗号隔开
curl -XDELETE -u elastic:changeme http://localhost:9200/acc-apply-2018.08.09,acc-apply-2018.08.10
模糊匹配删除
curl -XDELETE -u elastic:changeme http://localhost:9200/acc-apply-*
{"acknowledged":true}
使用通配符,删除所有的索引

curl -XDELETE http://localhost:9200/_all 或 curl -XDELETE http://localhost:9200/*
{"acknowledged":true}
_all ,* 通配所有的索引，但通常不建议使用通配符，误删了后果就很严重了，所有的index都被删除了

为了安全起见，禁止通配符，可以在 elasticsearch.yml 配置文件中设置禁用 _all 和 通配符 action.destructive_requires_name = true 这样就不能使用_all和了
ES 的查询比较灵活且功能强大，尤其是高级查询，比如分词查找、地理查找等

DSL 基本关键字说明

query: 用于包含查询使用到的语法

1、 match_all: 最简单的查询，获取索引所有数据，类似搜索 *。如：”query”:{“match_all”:{}}

2、 bool: 复合查询，可以包含多个查询条件，主要有(must,must_not,should)

2.1、 must: 用于包含逻辑与查询条件，即所有查询条件都满足才行
2.2、 must_not: 用于包含逻辑非查询条件，即不包含所有查询的条件数据
2.3、 should: 用于包含逻辑或查询条件，即其中有一个条件满足即可
2.4、 filter: 与must一样，包含的所有条件都要满足，但不会参与计算分值，查询速度上会提升不少

3、 match: 匹配查询，用于匹配指定属性数据，也可以匹配时间，IP等特殊数据

3.1、 注意： match匹配不会解析通配符，匹配的效果受到索引属性类型影响，如果索引属性设置了分词，那么match匹配也会分词匹配，他也不解析”“，但可以设置逻辑关系来处理
3.2、 operator: 匹配逻辑关系，默认是or，可设置为and，这样可达到精确匹配的效果，具体见：https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-match-query.html#query-dsl-match-query-boolean

4、 query_string: 使用查询解析器来解析查询内容，如port:80 AND server:http。注意：此类型请求有很多选项属性，可以设置一些特殊的行为，具体见：https://www.elastic.co/guide/en/elasticsearch/reference/5.6/query-dsl-query-string-query.html

5、 term: 术语查询，查找包含在反向索引中指定的确切术语的文档

6、 terms: 术语查询，筛选具有匹配任何条件的字段，如”terms” : { “user” : [“kimchy”, “elasticsearch”]}

7、 range: 术语查询，将文档与具有特定范围内的字段相匹配。Lucene查询的类型依赖于字段类型，对于字符串字段，即TermRangeQuery，而对于number/date字段，查询是一个数字的范围。如：”range”:{“port”:{“gte”:10,”lte”:20,”boost”:2.0}}

7.1、 gte: 大于或等于
7.2、 gt: 大于
7.3、 lte: 小于或等于
7.4、 lt: 小于
7.5、 boost: 设置查询的boost值，默认值为1.0

8、 exists: 术语查询，返回在原始字段中至少有一个非空值的文档，注意：”“,”-“这些都不算是空值

9、 prefix: 术语查询，匹配包含带有指定前缀字段的字段(没有分析)，前缀查询映射到Lucene前缀查询，如：”prefix” : { “user” : “ki” }，查询user数据前缀为ki的doc

10、 wildcard: 术语查询，匹配具有匹配通配符表达式的字段(未分析)的文档。支持(*通配符)是匹配任何字符序列(包括空的序列)和(?通配符)它匹配任何一个字符。注意，这个查询可能比较慢，因为它需要迭代多个术语。为了防止非常慢的通配符查询，一个通配符项不应该从通配符开始，或者?通配符查询映射到Lucene通配符查询。如：”wildcard” : { “user” : “ki*y” }

11、 regexp: 术语查询，regexp查询允许您使用正则表达式术语查询，意味着Elasticsearch将把regexp应用到该字段的标记器所产生的词汇，而不是该字段的原始文本。regexp查询的性能严重依赖于所选择的正则表达式，通配符往往会降低查询性能。如：”regexp”:{ “name.first”:”s.*y” }

12、 fuzzy: 术语查询，模糊查询使用基于Levenshtein编辑距离的相似性。如：”fuzzy” : { “user” : “ki” }

13、 type: 术语查询，过滤文档匹配所提供的文档/映射类型。如：”type”:{ “value” : “my_type” }

14、 ids: 术语查询，过滤只具有提供的id的文档。注意：这个查询使用了_uid字段，类型是可选的，可以省略，也可以接受一组值。如果没有指定类型，那么将尝试在索引映射中定义的所有类型。如：”ids”:{ “type” : “my_type”,”values” : [“1”,”4”,”100”] }

highlight: 允许在一个或多个字段中突出显示搜索结果，基于lucene plain highlighter。在默认情况下，高亮显示会将高亮显示的文本包装在 and ，可以通过设置pre_tags 与 post_tags来自定义，如：”highlight”:{ “pre_tags” : [““], “post_tags” : [““], “fields” : {“_all”:{}} }

1、 pre_tags: 自定义包含搜索关键字的前缀
2、 post_tags: 自定义包含搜索关键字的后缀
3、 fields: 用于指定要高亮的属性，_all表示所以属性都需要高亮，如：”fields”:{ “_all” : {} }，也可以指定具体属性 “fields”:{ “app” : {} }，也可以给每个属性单独指定设置 “fields”:{ “app” : {“fragment_size” : 150, “number_of_fragments” : 3} }
4、 highlight_query: 可以通过设置highlight_query来突出显示搜索查询之外的查询，通常，最好将搜索查询包含在highlight_query中。如：”highlight_query”:{ “bool”:{“must”:[{“query_string”:{“query”:app:apache,”analyze_wildcard”:True,”all_fields”:True}}]} }
5、 fragment_size: 用于指定高亮显示时，碎片的长度，如果过短，高亮内容会被切分为多个碎片。默认情况下，当使用高亮显示的内容时，碎片大小会被忽略，因为它会输出句子，而不管它们的长度
6、 number_of_fragments 用于指定高亮显示时，碎片的数量，如果指定为0，那么就不会产生任何片段

from: 可以通过使用from和size参数来对结果进行分页，from参数指定您想要获取的第一个结果的偏移量

size: 可以通过使用from和size参数来对结果进行分页，size参数指定要返回结果的最大数量

sort: 允许在特定的字段上添加一个或多个排序，排序是在每个字段级别上定义的，用特殊的字段名来排序，然后根据索引排序进行排序，如”sort”: [ { “date”: { “order”: “desc” } } ]，desc降序，asc升序

aggs: 简单来说，aggs主要用于分类集合，可以将查询的数据按指定属性进行分类集合统计等，如：”aggs”:{ “deviceType”:{ “terms”:{ “field”:”deviceType”, “size”:6 } } }

1、 field: 简单来说，用于指定要分类的属性名称
2、 size: 用于指定分类集合的数量，即只集合前N名

打分机制
ES采用的是lucene的打分算法(ES 5.0之前默认是 lucene4 的 TF/IDF, 5.0之后采用的是 lucene6 默认是 bm2.5)

在实际的运用中，我们采用 Multi-Match 给各个字段设置权重、使用should给特定文档权重或使用更高级的Function_Score来自定义打分，借助于 Elasticsearch 的 explain 功能，我们可以深入地学习一下其中的机制

重打分机制并不会应用到所有的数据中。比如需要查询前10条数据，那么所有的分片先按默认规则查询出前10条数据，然后应用rescore规则进行重打分返回给master节点进行综合排序返回给用户

Lucene的打分模型结合了信息检索中的布尔模型和向量空间模型，文档使用布尔模型核准后再用向量空间模型打分

布尔模型（BM）

TF
一个term在一个doc中出现的次数(出现的次数越多，那么最后给的相关度评分就会越高)

IDF
一个term在所有的doc中出现的次数(出现的次数越多，那么最后给的相关度评分就会越低)

lnorm
(length norm)关键词搜索的那个field的长度（field长度越长，给的相关度评分越低; field长度越短，给的相关度评分越高）低) 一个搜索query会根据query的类型进行分词、语法解析拆分，并且按照类似and这种逻辑操作符，得出bool语句，这样可以先过滤出包含指定term的doc

经过布尔模型的过滤、重组就会得到一堆的term,同时也会得到term和doc之间的关系。

其实lucene的打分过程就是将搜索的关键词的某个term，综合TF，IDF，length norm以及设置的权重对某个文档综合计算出来一个分数。但是往往一个关键词并不是一个term,而是多个term比如hello word会是hell/word/hello word。所以就需要综合计算多个term对一个文档的总分数来作为这个文档对这个关键词的最终得分

空间向量模型（VSM）

对于多个term是如何决定一个文档的分数的以及一个query搜索是如何等到某个文档得分的，lucene采用的是空间向量模型

空间的维
一个维是代表一个term，某个term通过TF/IDF以及字段的长度会计算出一个doc的分数，那么这个分数就是这个文档在这个维的坐标。所以计算出多个term的分值（term1_score;term2_score;term3_score）就相当于确定 了一个文档在多个维的坐标，也就可以画出他的向量
文档向量(doc vector)
假设这个文档包含3个term。也就是说这个文档在空间中有三个维度含有此文档的坐标刻度。可以得出文档在空间中的一个向量
索引向量(query vector) 这个query同样被当成一个文档来看待，同样可以在空间中找到某个term维上的坐标，根据坐标可以构成一个空间向量
query对doc的得分计算 通过计算doc vector和query vector的夹角的cose值作为最终的分数。弧度越大，分数月底; 弧度越小，分数越高
总结打分过程
1、先根据query的语法判断是否对keyword进行分词
2、得出keyword中包含的term
3、根据term去倒排表中找到多个doc
4、根据query的语法，通过boolean模型得到最终的文档集
5、根据TF/RDF算法模型计算每个term对文档、query的分值，得出文档、query在某一维的坐标
6、根据在维度上的坐标画出文档、query的空间向量
7、计算文档以及query空间向量的夹角余弦值，在计算的过程中加入boost，得到最终的得分score
精确检索
SQL 语句

select * from tb where a = '我是谁' and b = 2 order by c desc, d asc limit 0, 10
DSL 语句

GET wenewrs-storage-dev/_search
{
  "from": 0,
  "size": 10,
  "query": {
    "bool": {
      "must":[ {"term": {"a":"我是谁"}} ],
      "filter":[ {"term": {"b":2}} ]
    }
  },
  "sort": [
    {"c": {"order": "desc"}},
    {"d": {"order": "asc"}}
  ]
}
分词检索
SQL 语句

select * from tb where a like '%我是谁%' and b = 2 order by c desc, d asc limit 0, 10
DSL 语句

GET wenewrs-storage-dev/_search
{
  "from": 0,
  "size": 10,
  "query": {
    "bool": {
      "must":[ {"match_phrase": {"a": {"query": "我是谁"}}} ],
      "filter":[ {"term": {"b":2}} ]
    }
  },
  "sort": [
    {"c": {"order": "desc"}},
    {"d": {"order": "asc"}}
  ]
}
地理检索
  GET wenewrs-storage-dev/_search
  {
    "from": 0,
    "size": 10,
    "query": {
        "bool": {
            "filter": [
                {"term": {"branchId": 5}},
                {"term": {"storageStatus": 2}},
                {
                    "geo_distance":{
                        "distance": "10km",
                        "position" : {
                            "lat": 31.34521,
                            "lon": 121.23455
                        }
                    }
                }
            ]
        }
    },
    "sort": [{
        "_geo_distance": {
            "position" : {
                "lat": 31.34521,
                "lon": 121.23455
            },
            "order" : "asc",
            "unit" : "km",
            "distance_type": "plane"
        }
    }]
  }
像地理搜索这种高级查询，尽量减少查询数据的量，越是高级，底层处理越复杂，越耗时

分组聚合
SQL 语句

select c, sum(amt) as amt from tb where a = 1 and b = 2 group by c order by amt desc limit 0, 10
DSL 语句

GET wenewrs-storage-dev/_search
{
  "size": 0,
  "query": {
    "bool": {
      "filter": [
          {"term": {"a": 1}},
          {"term": {"b": 2}}
      ]
    }
  },
  "aggs": {
      "c_group": {
          "terms": {
              "field": "c",
              "size": 10,
              "order": {"amt": "desc"}
          }
      }
  }
}

数据操作都使用 DSL 语句来实现
新增
单个新增
restful 请求
单条插入-指定id
curl -XPOST 'localhost:9200/customer/external/1?pretty' -d' {"name": "John Doe" }'
单条插入-不指定id
curl -XPOST 'localhost:9200/customer/external?pretty' -d' {"name": "Jane Doe" }'
DSL语句
POST /wenewrs-shop-goods/shop-goods/1/_create?refresh
{
    "itemId":1,
    "itemName":"江小白"
}
批量新增
restful 请求

curl -XPOST 'localhost:9200/bank/account/_bulk?refresh' --data-binary “@accounts.json"
文件里面是数组json对象，对象字段与mapping一致

DSL 语句

POST _bulk
{ "create" : { "_index" : "wenewrs-shop-goods-dev" , "_type" : "shop-goods" , "_id" : "3" }}
{"itemId": 3,"itemName": "江小白2"}
{ "create" : { "_index" : "wenewrs-shop-goods-dev" , "_type" : "shop-goods" , "_id" : "4" }}
{"itemId": 4,"itemName": "江小白3"}
修改
单个修改
restful 请求
curl -XPOST 'localhost:9200/customer/external/1/_update?pretty' -d ' {
    "doc": {
        "itemName": "江小白9"
    }
}'
DSL 语句
POST wenewrs-shop-goods-dev/shop-goods/1/_update_by_query?refresh 
{
  "script": "ctx._source.itemName = '江小白9'"
}
批量修改
restful 请求
curl -XPOST 'localhost:9200/customer/external/_update?pretty' -d' {
  "script": "ctx._source.age += 5"
}'
DSL 语句
脚本方式
POST wenewrs-storage/storage-info/_update_by_query?refresh
{
    "query": {
        "match_all": {}
    },
    "script" :{
        "inline": "ctx._source['shopStatus'] = 2"
    } 
}
批量方式
POST _bulk
{ "update" : { "_index" : "wenewrs-shop-goods-dev" , "_type" : "shop-goods" , "_id" : "3" }}
{ "update" : { "_index" : "wenewrs-shop-goods-dev" , "_type" : "shop-goods" , "_id" : "4" }}
删除
单个删除
restful 请求
curl -XDELETE 'localhost:9200/customer/external/2'
DSL 语句
DELETE /wenewrs-shop-goods-dev/shop-goods/1?refresh
批量删除
restful 请求
curl -XPOST 'localhost:9200/customer/external/_delete_by_query' -d '{
  "query": {
      "match": {
          "age": "18"
      }
  }
}'
DSL 语句
全部删除
POST wenewrs-history-word-dev/history-word/_delete_by_query?refresh
{
"query": {
  "match_all": {}
}
}
部分删除
POST _bulk
{ "delete" : { "_index" : "wenewrs-shop-goods-dev" , "_type" : "shop-goods" , "_id" : "3" }}
{ "delete" : { "_index" : "wenewrs-shop-goods-dev" , "_type" : "shop-goods" , "_id" : "4" }}