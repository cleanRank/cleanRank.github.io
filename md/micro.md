本次主要探讨微服务架构及其具体实现（Spring Cloud框架）；主要介绍微服务架构起源，Spring Cloud框架的构成，以及和其他框架的对比，还有一些关键注意点。 
系统架构阶段
单体架构阶段
以单机软件为代表
分层架构阶段
包括B/S，MVC，三层架构「UI(表现层)、BLL:(业务逻辑层)、DAL:(数据访问层)」，多层架构等。
面向服务架构阶段
主要是服务整合协调为目的；
服务分布式化治理，以Dubbo（分布式服务框架）为代表；
以整合集成为核心，以ESB（企业服务总线）为代表。
微服务架构阶段
微服务主要是服务细分和综合治理；微服务从面向服务（SOA）发展进化而来，所以Dubbo演进后算作其中一个框架，但是更为完善作为代表的非spring cloud莫属。
面向未来的架构
主要体现在Serverless和ServiceMesh；server less 不是 service less；service mesh 不是 server mesh；
简要说明
Spring Cloud是基于Spring Boot快速开发框架的一套完善的微服务架构。

Spring Boot封装了各种经常使用的套件，比如数据库访问、缓存、消息队列、定时任务等，赋予快速开发的能力，特别适合构建微服务系统。

Spring Cloud提供一系列组件，如服务注册发现、配置中心、消息总线、负载均衡、断路器、数据监控等； 这些组件用Spring Boot封装，从而做到直接引用后简单配置即可使用，最终给开发者提供一套较为完善的分布式系统开发框架。

Spring技术
Local Image
注册中心
Local Image Spring Cloud Eureka是架构中最为核心和基础的模块，它主要用来实现各个微服务实例的自动化注册和发现。

服务注册
每个服务单元向注册中心登记自己提供的服务，包括服务的主机与端口号、服务版本号、通讯协议等一些附加信息。
注册中心
按照服务名分类组织服务清单，同时还需要以心跳检测的方式去监测清单中的服务是否可用，若不可用需要从服务清单中剔除，以达到排除故障服务的效果。
服务发现
服务间的调用不再通过指定具体的实例地址来实现，而是通过服务名发起请求调用实现。服务调用方通过服务名从服务注册中心的服务清单中获取服务实例的列表清单，通过指定的负载均衡策略取出一个服务实例位置来进行服务调用。
服务拷贝
当注册中心是集群部署的时候，注册中心会相互拷贝已注册的服务，如果一个注册中心中有新服务注册或注销，另外的注册中心也会隔一段时间同步，这个时间是可配置的。

代码和配置
maven引入:

  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
  </dependency>
yml配置:

  #端口号
  server:
  port: 28090

  spring:
    application:
      name: webase-eureka
    # dev:开发配置、test:测试配置、prod: 发布配置;
    profiles:
      active: ${config.active:dev}

  management:
    endpoints:
      web:
        exposure:
          include: "*"

  eureka:
    server:
      # 关闭自我保护模式（缺省为打开）
      enable-self-preservation: false
      # 续期时间，即扫描失效服务的间隔时间（缺省为60*1000ms）
      eviction-interval-timer-in-ms: 10000

    #实例名,集群中根据这里相互识别
    instance:
      # 设置微服务调用地址为IP优先
      prefer-ip-address: true

    #客户端
    client:
      #关闭注册服务(注册自己,以便被其它注册服务发现)
      register-with-eureka: false
      #拉取服务列表关闭
      fetch-registry: false
      #注册中心地址,如果有多个服务,则需要已”,“ 隔开
      service-url:
        defaultZone: http://localhost:${server.port}/eureka/
服务开启:

      import org.springframework.boot.SpringApplication;
      import org.springframework.boot.autoconfigure.SpringBootApplication;
      import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

      @EnableEurekaServer
      @SpringBootApplication
      public class EurekaApplication {

          public static void main(String[] args) {
              SpringApplication.run(EurekaApplication.class,args);
          }

      }

      配置中心
Local Image

Spring Cloud Config支持服务配置来源于本地文件或者在远程仓库中（包含GIT和SVN）。
包含服务端和客户端，服务端集中管理各环境的配置文件，客户端从服务端获取各自服务的配置信息；
配置文件修改之后，可以快速的生效，可以进行版本管理，支持大的并发查询等。
代码和配置
maven引入:

      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
      </dependency>
      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-config-server</artifactId>
      </dependency>
      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-starter-bus-amqp</artifactId>
      </dependency>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-actuator</artifactId>
      </dependency>

      <!--如果是SVN的方式存放配置文件, 则需要引入如下包-->
      <dependency>
          <groupId>org.tmatesoft.svnkit</groupId>
          <artifactId>svnkit</artifactId>
          <version>1.9.0</version>
      </dependency>
yml配置:

  #端口号
  server:
    port: 28092

  spring:
    application:
      name: webase-config
    #设置为本地方式
    profiles:
      # native：本地配置、dev:开发配置、test:测试配置、prod:发布配置;
      active: ${config.active:native}

    #使用BUS自动刷新配置    
    #rabbitmq:
    #  virtual-host: /var/lib/rabbitmq/WENEWRS_DEV
    #  host: 106.14.36.118
    #  port: 5672
    #  username: name
    #  password: pwd  

    cloud:
      #设置为本地方式
      config:
        server:
          native:
            # 配置文件所在目录，classpath（类路径）和（系统文件路径） file两种
            searchLocations: classpath:/config/

      #设置为GIT方式
      #config:
      #  server:
      #      git:
      #        # 配置gitlab仓库的地址，注意，此处必须以.git结尾
      #        uri: http://106.14.36.118:8877/config/config-file.git
      #        # gitlab仓库地址下的相对地址，可以配置多个，用,分割。
      #        search-paths: /wenewrs
      #        username: name
      #        password: pwd

      #设置为SVN方式
      #config:
      #  enabled: true
      #    server:
      #      svn:
      #        uri: http://106.14.61.168:82/svn/project/westore/server/  #westore-authentication/trunk/
      #        username: username
      #        password: password
      #        default-label: config

  eureka:
    instance:
      # 设置微服务调用地址为IP优先
      prefer-ip-address: true
      # 心跳时间，即服务续约间隔时间（缺省为30s）
      lease-renewal-interval-in-seconds: 10
      # 发呆时间，即服务续约到期时间（缺省为90s）
      lease-expiration-duration-in-seconds: 30
    client:
      service-url:
        defaultZone: http://${eureka.host:127.0.0.1}:${eureka.port:28090}/eureka/
开启服务:

  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
  import org.springframework.cloud.config.server.EnableConfigServer;

  @EnableDiscoveryClient
  @EnableConfigServer
  @SpringBootApplication
  public class ConfigApplication {

      public static void main(String[] args) {
          SpringApplication.run(ConfigApplication.class,args);
      }
  }
  消息总线
Local Image

Spring Cloud Bus将分布式的节点和轻量的消息代理连接起来。这可以用于广播配置文件的更改或者其他的管理工作。
消息总线可以为微服务做监控，也可以作为应用程序之间相互通讯。目前主要作用于服务配置的变更、同步和刷新。
在配置中心和各个服务配置Spring Cloud Bus后，可以通过以下步骤刷新各个服务配置:

向配置中心接口/actuator/bus-refresh提交POST请求
配置中心接收到请求并发送给Spring Cloud Bus
Spring Cloud Bus接到消息并通知给其它服务
其它服务接收到通知，请求配置中心获取最新配置
获取配置后刷新服务自身相应的配置
代码配置 maven引入

  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-bus-amqp</artifactId>
  </dependency>
  <!-- 需要actuator包支持 -->
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
yml配置

  spring.rabbitmq.virtual-host: /var/lib/rabbitmq/WENEWRS_DEV
  spring.rabbitmq.host: 106.14.36.118
  spring.rabbitmq.port: 5672
  spring.rabbitmq.username: name
  spring.rabbitmq.password: pwd
刷新配置

  import cn.com.waterelephant.wenewrs.common.excepion.CacheException;
  import org.apache.commons.lang.StringUtils;
  import org.springframework.beans.factory.annotation.Value;
  import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
  import org.springframework.cloud.context.config.annotation.RefreshScope;
  import org.springframework.dao.DataAccessException;
  import org.springframework.data.redis.connection.RedisConnection;
  import org.springframework.data.redis.core.RedisCallback;
  import org.springframework.data.redis.core.RedisTemplate;
  import org.springframework.lang.Nullable;
  import org.springframework.scheduling.annotation.Async;
  import org.springframework.stereotype.Component;

  import javax.annotation.Resource;
  import java.io.Serializable;
  import java.util.Collection;
  import java.util.List;
  import java.util.Map;
  import java.util.Set;
  import java.util.concurrent.TimeUnit;

  @Component
  @RefreshScope
  @ConditionalOnProperty(prefix = "cache", name = "enable", havingValue = "true")
  public class CacheAsyncService {

      @Value("${cache.enable}")
      private Boolean enable = false;

      @Resource
      private RedisTemplate redisTemplate;

      public boolean exists(String key){
          if (!enable) return false;
          try {
              return redisTemplate.hasKey(key);
          } catch (Exception ex) {
                  return false;
          }
      }
  }
  消息驱动
Local Image

Spring Cloud Stream就是使用了基于消息系统的微服务架构。
应用程序通过inputs或者outputs来与Spring Cloud Stream中binder交互，而binder负责与中间件交互。
Binder是一个抽象概念，是应用与消息中间件之间的桥梁。目前Spring Cloud Stream实现了Kafka和Rabbit MQ的binder。
核心内容
Publish-Subscribe
消息的发布（Publish）和订阅（Subscribe）是事件驱动的经典模式。Spring Cloud Stream 的数据交互也是基于这个思想。生产者把消息通发出去。消费者通过订阅获取消息来触发业务的执行。

Consumer Groups
微服务根据性能及可用性要求，并行分布式动态伸缩是常有的。对于这种情况，同一个消息防止被重复消费，并行多个同一应用归于同一个分组中，就能够保证消息只会被其中一个应用消费一次。

Durability
消息事件的持久化是必不可少的。Spring Cloud Stream 可以动态的选择一个消息队列是持久化，还是 present。

Bindings
通过配置把应用和spring cloud stream 的 binder 绑定在一起，之后我们只需要修改 binding 的配置来达到动态修改topic、exchange、type等一系列信息而不需要修改一行代码。

负载均衡
Local Image

Spring Cloud Ribbon是基于HTTP和TCP的客户端负载工具，它是基于Netflix Ribbon实现的。
Spring Cloud Feign在Ribbon基础上做了进一步的封装，Feign是一种声明式、模板化的HTTP客户端。
Ribbon和Feign都是用于调用其他服务的，不过方式不同。
启动类使用的注解不同
Ribbon用的是@RibbonClient，Feign用的是@EnableFeignClients。

服务的指定位置不同
Ribbon是在@RibbonClient注解上声明，Feign则是在定义抽象方法的接口中使用@FeignClient声明。

Ribbon调用方式复杂
Ribbon需要自己构建http请求并自动转换成客户端负载均衡服务调用，使用RestTemplate发送给其他服务。

Feign采用接口的方式
Feign则是在Ribbon的基础上进行了封装和改进，采用接口的方式，将需要调用的其他服务的方法定义成抽象方法即可，不需要自己构建http请求。 使得请求远程服务时能与调用本地方法一样的编码体验。不过要注意的是抽象方法的注解、方法签名要和提供服务的方法完全一致。

代码与配置(Feign方式)
maven引入:

   <!--内部包含了Ribbon的包了-->
   <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-openfeign</artifactId>
   </dependency>
yml配置:

   #feign配置
   feign:
     hystrix:
       enabled: true
     compression:
       request.enabled: true
       response.enabled: true  
   #ribbon的超时重试
   ribbon:
     eureka:
       enabled: true
     ReadTimeout: 6000
     ConnectTimeout: 6000
     MaxAutoRetries: 1 #同一台实例最大重试次数,不包括首次调用
     MaxAutoRetriesNextServer: 1 #重试负载均衡其他的实例最大重试次数,不包括首次调用
     OkToRetryOnAllOperations: false  #是否所有操作都重试
开启feign功能

   import org.mybatis.spring.annotation.MapperScan;
   import org.springframework.boot.SpringApplication;
   import org.springframework.cloud.client.SpringCloudApplication;
   import org.springframework.cloud.client.loadbalancer.LoadBalanced;
   import org.springframework.cloud.openfeign.EnableFeignClients;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.ComponentScan;
   import org.springframework.scheduling.annotation.EnableAsync;
   import org.springframework.web.client.RestTemplate;  
   @EnableAsync  
   @EnableFeignClients  
   @SpringCloudApplication  
   public class CustomerApplication {  
      @LoadBalanced  
      @Bean  
      public RestTemplate restTemplate() {  
         return new RestTemplate();
      }  
      public static void main(String[] args) {
         SpringApplication.run(CustomerApplication.class, args);
      }  
   }
编写feign接口

   import cn.com.waterelephant.wenewrs.domain.common.bo.PageBo;
   import cn.com.waterelephant.wenewrs.domain.common.vo.PageVo;
   import cn.com.waterelephant.wenewrs.domain.common.vo.RestVo;
   import cn.com.waterelephant.wenewrs.domain.customer.bo.CustomerSalesOrderBo;
   import cn.com.waterelephant.wenewrs.domain.sales.vo.CustomerSalesOrderCountVo;
   import cn.com.waterelephant.wenewrs.domain.sales.vo.PubSalesorderDocVo;
   import io.swagger.annotations.ApiParam;
   import org.springframework.cloud.openfeign.FeignClient;
   import org.springframework.web.bind.annotation.RequestBody;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RequestParam;  
   @FeignClient(name = "wenewrs-service-sales", path = "/sales/customer/      salesorder")  
   public interface CustomerOrderApi {    
      @ApiOperation(value = "获取订单分页数据", notes = "订单", produces =    "application/json; charset=utf-8")  
      @PosstMapping("page")  
      public RestVo<PageVo<PubSalesorderDocVo>> queryOrderPage(
         @ApiParam(name = "bo", value = "数据", required = true) 
         @RequestBody PageBo<CustomerSalesOrderBo> bo
      ); 
      @ApiOperation(value = "获取用户订单数量", notes = "订单", produces =    "application/json; charset=utf-8")  
      @GetMapping("count")  
      public RestVo<CustomerSalesOrderCountVo> countOrder(
         @ApiParam(name = "userId", value = "用户ID", required = true)
         @RequestParam(value = "userId") Long userId
      );  
   }
调用feign接口

   import cn.com.waterelephant.wenewrs.common.feign.sales.CustomerOrderApi;
   import cn.com.waterelephant.wenewrs.domain.common.bo.PageBo;
   import cn.com.waterelephant.wenewrs.domain.common.vo.PageVo;
   import cn.com.waterelephant.wenewrs.domain.common.vo.RestVo;
   import cn.com.waterelephant.wenewrs.domain.customer.bo.CustomerSalesOrderBo;
   import cn.com.waterelephant.wenewrs.domain.customer.vo.PubUserVo;
   import cn.com.waterelephant.wenewrs.domain.sales.vo.CustomerSalesOrderCountVo;
   import cn.com.waterelephant.wenewrs.domain.sales.vo.PubSalesorderDocVo;
   import cn.com.waterelephant.wenewrs.server.controller.BaseController;
   import io.swagger.annotations.Api;
   import io.swagger.annotations.ApiOperation;
   import io.swagger.annotations.ApiParam;
   import lombok.extern.slf4j.Slf4j;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.web.bind.annotation.*;  
   @Slf4j  
   @RestController("customer-detail")  
   @Api(value = "customer-detail", description = "用户详情相关业务控制器")  
   @RequestMapping(value = "/customer/detail")  
   public class CustomerDetailController extends BaseController {  
      @Autowired
      private CustomerOrderApi customerOrderApi;   
      @ApiOperation(value = "获取会员订单分页信息", notes="获取会员订单分页信息", produces = "application/json; charset=utf-8")
      @RequestMapping(value="salesorder/page", method = RequestMethod.POST)
      public RestVo<PageVo<PubSalesorderDocVo>> queryOrderPage(
               @ApiParam(name = "bo", value = "数据", required = true) 
               @RequestBody PageBo<CustomerSalesOrderBo> bo){
         return customerOrderApi.queryOrderPage(bo);
      }  
      @ApiOperation(value = "获取会员订单消费统计信息", notes="获取会员订单消费统计信     息", produces = "application/json; charset=utf-8")
      @RequestMapping(value="salesorder/count", method = RequestMethod.GET)
      public RestVo<CustomerSalesOrderCountVo> countOrder(
               @ApiParam(name = "userId", value = "用户ID", required = true)
               @RequestParam Long userId){
         return customerOrderApi.countOrder(userId);
      }  

   }
   服务断路
Local Image

由于所有服务并不能保证百分百可靠可用，如果单个服务出现问题，调用这个服务就出现线程阻塞，此时若有大量的请求涌入，线程资源就会被消耗完毕导致服务瘫痪。
服务与服务之间的依赖性，故障会传播，会对整个微服务系统造成不可估量的严重后果，这就是常说的服务故障的“雪崩效应”。
为了解决这个问题，有人就提出了一种解决问题的思路，断路器模型。就是每一个调用服务的接口处加一个断路器，默认是关闭的，当对服务调用时，不可用的次数达到一个阀值时，断路器就会打开，通过回调方法迅速返回一个值结束调用，避免出现连锁故障。
熔断策略
断路
正常情况下，断路器处于关闭状态，如果调用持续出错或者超时，电路被打开进入熔断状态(Open)，后续一段时间内的所有调用都会被拒绝(Fail Fast)，

恢复
一段时间以后，保护器会尝试进入半熔断状态(Half-Open)，允许少量请求进来尝试，如果调用仍然失败，则回到熔断状态，如果调用成功，则回到电路闭合状态;

代码配置
maven引入

  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
  </dependency>
yml配置

  #hystrix的超时时间，默认是1秒
  hystrix:
    command:
      default:
        execution:
          timeout:
          enabled: true
          isolation:
            thread:
              timeoutInMilliseconds: 18000


              Local Image
Spring Cloud Gateway旨在为微服务架构提供一种简单而有效的统一的接口路由管理方式。
Spring Cloud Gateway基于Filter链的方式提供了网关基本的功能，例如：安全，监控/埋点，和限流等。
Spring Cloud Gateway使用的是高性能IO模式Reactor
代码和配置
maven引入

  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-openfeign</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-config</artifactId>
  </dependency>

  <!-- gateway是用过webflux实现，在项目中请不要引webmvc，否则初始化会报错 -->
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webflux</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-gateway</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
  </dependency>

  <!-- 基于redis限流需要 -->
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
  </dependency>
yml配置:

  #设置服务启动的端口号
  server.port: 28095

  spring:
    application:
      name: wenewrs-gateway
    # dev:开发配置、test:测试配置、prod: 发布配置;
    profiles:
      active: ${config.active:dev}

    cloud:
      config:
        name: wenewrs-gateway-server,wenewrs-gateway-route
        # 通过链接地址访问配置中心
        uri: http://${config.host:127.0.0.1}:${config.port:28092}
        enabled: true

  management:
    endpoints:
      web:
        exposure:
          include: "*"
  eureka:
    instance:
      preferIpAddress: true
      leaseRenewalIntervalInSeconds: 3
      leaseExpirationDurationInSeconds: 10
  client:
      registryFetchIntervalSeconds: 5
      service-url:
        defaultZone: http://${eureka.host:127.0.0.1}:${eureka.port:28090}/eureka
路由配置:

  spring:
    cloud:
      gateway:
        #默认为false，设为true便开启通过服务中心自动根据 serviceId 创建路由的功能。
        discovery:
          locator:
            enabled: true

      routes:
        # 会员端接口
        - id: wenewrs-service-customer
          uri: lb://wenewrs-service-customer
          predicates:
          - Path=/customer/bonus/**
        - id: wenewrs-service-customer
          uri: lb://wenewrs-service-customer
          predicates:
          - Path=/customer/detail/**
        # 店员端接口
        - id: wenewrs-service-salesman
          uri: lb://wenewrs-service-salesman
          predicates:
          - Path=/salesman/**
开启服务

  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.cloud.openfeign.EnableFeignClients;
  import org.springframework.scheduling.annotation.EnableAsync;

  @EnableAsync
  @EnableFeignClients
  @SpringBootApplication
  public class GatewayApplication {

      public static void main(String[] args) {
          SpringApplication.run(GatewayApplication.class, args);
      }
  }
  服务追踪
Local Image

Spring Cloud Sleuth提供了一套完整的服务跟踪的解决方案。 每次链路请求都会添加一串追踪信息，格式是[server-name,main-traceId,sub-spanId,boolean]

server-name
服务节点名称

main-traceId
一条链路唯一的ID，叫TraceID

sub-spanId
链路中每一环的ID，叫做SpanID

boolean
是否将信息输出到Zipkin等服务收集和展示

追踪

一条链路上的所有处理给统一的TraceID，通过这个唯一标识就可以找到完整的处理链路。 每一环的微服务结点处理时我们再给一个独立的SpanID，这样请求何时到达结点、离开结点都有追踪的依据，就可以判断出每一跳的延时情况。

抽样

日志采集的越多，追踪越全面，但是消耗也越大；反之日志追踪不够多也就失去了意义。 到底追踪多少日志才是平衡点？Spring Cloud Sleuth把这个问题交给了使用者，通过配置spring.sleuth.sampler.percentage=0.1这个参数来决定了日志记录发送给采集器的概率，0-1交给使用者自己配置。 开发阶段和运行初期，一般配置成1全量收集日志，到了上线后可以慢慢降低这一概率。

代码配置参见链路监控


服务监控（spring boot admin）
由于服务构成数量多，需要实时掌握服务状态和服务配置已经资源使用情况

链路监控（zipkin结合Sleuth）
调用情况收集存储、分析及图形化的展示，日志采集并积累到一定体量后，就会具备可分析的价值。 例如一个请求链会经历ABC3个微服务结点，我们通过分析A、B、C服务结点处理时长的变化可以提前发现某个环节的处理能力不足需要扩展结点。 Zipkin提供了这样的图形化分析工具，只需要开启一个服务结点，打开收集端口，将此接口添加到所有业务服务结点上就可以实现这一需求。

断路监控（Turbine结合Hystrix）
Turbine是聚合服务器发送事件流数据的一个工具，Hystrix的监控中，只能监控单个节点，实际生产中都为集群，因此可以通过Turbine来监控集群下Hystrix的metrics情况。

定时任务（Spring Cloud Task）
Spring Cloud Task为应用程序提供创建短运行期微服务的功能。 在Spring Cloud Task中，我们可以灵活地动态运行任何任务，按需分配资源并在任务完成后检索结果。 但是在分布式环境中缺少像服务中心和配置中心这样的集中管理方式，所以不能灵活的配置和手动触发任务。 所有需要采用其他具有集中管理的分布式任务系统。


Local Image 

Spring Boot Admin 提供了很多功能，如显示 name、id 和 version，显示在线状态，Loggers 的日志级别管理，Threads 线程管理，Environment 管理，详细的Health信息、内存信息、JVM信息、垃圾回收信息、各种配置信息等。在 Spring Boot 项目中，Spring Boot Admin 作为 Server 端，其他的要被监控的应用作为 Client 端。
Spring Boot Admin 是一个管理和监控Spring Boot 应用程序的开源软件。每个应用都认为是一个客户端，通过HTTP或者使用 Eureka注册到admin server中进行展示，Spring Boot Admin UI部分使用AngularJs将数据展示在前端。
服务端使用配置
引入maven

  <dependency>
      <groupId>de.codecentric</groupId>
      <artifactId>spring-boot-admin-starter-server</artifactId>
      <version>2.0.1-SNAPSHOT</version>
  </dependency>
开启Admin服务

  @Configuration
  @EnableAutoConfiguration
  @EnableAdminServer
  public class SpringBootAdminApplication {
      public static void main(String[] args) {
          SpringApplication.run(SpringBootAdminApplication.class, args);
      }
  }
yml配置文件设置端口

  server.port: 8888

  management:
    endpoints:
      web:
        exposure:
          include: "*"
    endpoint:
      health:
        show-details: ALWAYS

  #获取客户端注册的服务
  eureka:
    instance:
      preferIpAddress: true
      leaseRenewalIntervalInSeconds: 3
      leaseExpirationDurationInSeconds: 10
      health-check-url-path: /actuator/health
      metadata-map:
        startup: ${random.int}
    client:
      registryFetchIntervalSeconds: 5
      service-url:
        defaultZone: http://${eureka.host:127.0.0.1}:${eureka.port:28090}/eureka
客户端配置
引入maven

  <dependency>
      <groupId>de.codecentric</groupId>
      <artifactId>spring-boot-admin-starter-client</artifactId>
      <version>2.0.0</version>
  </dependency>
yml配置文件设置端口

  management.endpoints.web.exposure.include: "*"

  eureka:
    instance:
      preferIpAddress: true
      leaseRenewalIntervalInSeconds: 3
      leaseExpirationDurationInSeconds: 10
    client:
      registryFetchIntervalSeconds: 5
      service-url:
        defaultZone: http://${eureka.host:127.0.0.1}:${eureka.port:28090}/eureka


        链路监控
Local Image

sleuth 是对 zipkin 的封装，对应Span,Trace等信息的生成、接入http request,以及向Zipkin server发送采集信息等全部自动化完成。
目前主流的链路追踪组件有：google的Dapper,Twitter的zipkin和阿里的Eagleeye(鹰眼)。
sleuth 主要功能是在分布式系统中提供追踪解决方案，并且兼容支持了zipkin(提供了链路追踪的可视化功能)

提供链路追踪 
  通过sleuth可以很清楚的看出一个请求都经过了哪些服务；可以很方便的理清服务间的调用关系。
可视化错误 
  对于程序未捕捉的异常，可以结合zipkin分析。
分析耗时 
  通过sleuth可以很方便的看出每个采样请求的耗时，分析出哪些服务调用比较耗时。当服务调用的耗时随着请求量的增大而增大时，也可以对服务的扩容提供一定的提醒作用。
优化链路 
  对于调用频繁的服务，可以并行调用或针对业务做一些优化措施等。

sleuth采样率默认为0.1，值越大收集越及时，但性能影响也越大

缺陷：
1：zipkin客户端向zipkin-server程序发送数据使用的是http的方式通信，每次发送的时候涉及到连接和发送过程。
2：当我们的zipkin-server程序关闭或者重启过程中，因为客户端收集信息的发送采用http的方式会被丢失。

改进：
1、通信采用socket或者其他效率更高的通信方式。
2、客户端数据的发送尽量减少业务线程的时间消耗，采用异步等方式发送收集信息。
3、客户端与zipkin-server之间增加缓存类的中间件，例如redis、MQ等，在zipkin-server程序挂掉或重启过程中，客户端依旧可以正常的发送自己收集的信息。

zipkin 在服务调用的请求和响应中加入ID,表明上下游请求的关系。利用这些信息，可以可视化地分析服务调用链路和服务间的依赖关系。
分布式服务跟踪系统主要包括下面三个关键点： Trace 、Span 、Annotation

TraceId 
  它是由一组有相同Trace ID的Span串联形成一个树状结构。为了实现请求跟踪，当请求请求到分布式系统的入口端点时，只需要服务跟踪框架为该请求创建一个唯一的跟踪标识（即前文提到的Trace ID），同时在分布式系统内部流转的时候，框架始终保持传递该唯一标识，直到返回请求为止，我们通过它将所有请求过程中的日志关联起来

SpanId 
  它代表了一个基础的工作单元，例如服务调用。为了统计各处理单元的时间延迟，当前请求到达各个服务组件时，也通过一个唯一标识（即前文提到的Span ID）来标记它的开始、具体过程以及结束。通过span的开始和结束的时间戳，就能统计该span的时间延迟，除此之外，我们还可以获取如事件名称、请求信息等元数据

Annotation 
  它用于记录一段时间内的事件。内部使用的最重要的注释是：

cs-Client Sent 客户端发送一个请求，这个注解描述了这个Span的开始。
sr-Server Received 服务端获得请求并准备开始处理它，其中（sr – cs） 时间戳便可得到网络传输的时间。
ss-Server Sent （服务端发送响应） 该注解表明请求处理的完成(当请求返回客户端)，（ss – sr）时间戳就可以得到服务器请求的时间。
cr-Client Received （客户端接收响应） 表明此时Span的结束，（cr – cs）时间戳便可以得到整个请求所消耗的时间。

Sleuth 与 ZipKin 代码配置

springcloud 2.0 不需要单独写zipkin服务，只需要引入jar即可

maven引入:

     <dependency>
         <groupId>org.springframework.cloud</groupId>
         <artifactId>spring-cloud-starter-sleuth</artifactId>
     </dependency>
     <dependency>
         <groupId>org.springframework.cloud</groupId>
         <artifactId>spring-cloud-sleuth-zipkin</artifactId>
     </dependency>
     <dependency>
         <groupId>org.springframework.cloud</groupId>
         <artifactId>spring-cloud-starter-zipkin</artifactId>
     </dependency>
yml配置:

spring:
  zipkin:
    service:
      name: ${spring.application.name}
    sender:
      type: web
    base-url: http://${zipkin.host:127.0.0.1}:${zipkin.port:39411}
  sleuth:
    sampler:
      percentage: 1.0
演示图片
Local Image

Local Image 

Turbine 可以将每个服务Hystrix Dashboard数据进行整合，统一展示
访问界面说明
Local Image 

监控参数说明
Local Image 

代码配置
maven引入

<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-config</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-turbine</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-netflix-turbine</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
yml配置

management:
  endpoints:
    web:
      exposure:
        include: "*"
  security:
    enabled: false
turbine:
  clusterNameExpression: new String("default")
  aggregator:
    clusterConfig: default
  appConfig: >
    wenewrs-service-active,wenewrs-service-count,
    wenewrs-service-customer,wenewrs-service-customer,
    wenewrs-service-goods,wenewrs-service-manage,
    wenewrs-service-market,wenewrs-service-purchase,
    wenewrs-service-sales,wenewrs-service-salesman,
    wenewrs-service-search,wenewrs-service-storage,
    wenewrs-service-supplier,wenewrs-service-system
启动代码

@SpringBootApplication
@EnableHystrixDashboard
@EnableTurbine
@EnableDiscoveryClient
public class TurbineApplication {
    public static void main(String[] args) throws IllegalAccessException, InstantiationException {
        SpringApplication.run(TurbineApplication.class, args);
    }

    @Bean
    @LoadBalanced
    RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ServletRegistrationBean getServlet(){
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/actuator/hystrix.stream");
        registrationBean.setName("HystrixMetricsStreamServlet");
        return registrationBean;
    }
}

Scheduled

是 springboot 自带的定时任务

支持fixedRate、cron和fixedDelay等定时方式

fixedRate
是从上一次方法执行开始的时间算起，如果上一次方法阻塞住了，下一次也是不会执行，但是在阻塞这段时间内累计应该执行的次数，当不再阻塞时，一下子把这些全部执行掉，而后再按照固定速率继续执行。 任务时长超过 fixedRate 时不会启动多个任务实例， 会在上次任务执行完后立即启动下一轮。除非这个 方法用 @Async 注解了，使得任务不在线程池中执行，而是每次创建新线程来执行
fixedDelay
是以上一次方法执行完开始算起，如上一次方法执行阻塞住了，那么直到上一次执行完，并间隔给定的时间后，执行下一次
cron
这是一个时间表达式，可以通过简单的配置就能完成各种时间的配置;一个cron表达式有至少6个（或7个）有空格分隔的时间元素

使用方式
1.开启Scheduling
2.在Component中的方法上新增@Scheduled注解,并传入定时方式参数

代码:
开启定时任务:

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpringBootScheduledApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootScheduledApplication.class, args);
    }
}
使用定时任务:

import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ExampleTimer {
     SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

        @Scheduled(fixedRate = 10000)
        public void timerRate() {
            System.out.println(dateFormat.format(new Date()));
        }

        //第一次延迟1秒执行，当执行完后2秒再执行
        @Scheduled(initialDelay = 1000, fixedDelay = 2000)
        public void timerInit() {
            System.out.println("init : "+dateFormat.format(new Date()));
        }

        //每天20点16分50秒时执行
        @Scheduled(cron = "50 16 20 * * ?")
        public void timerCron() {
            System.out.println("current time : "+ dateFormat.format(new Date()));
        }
}
cron表达式说明
从左到右依次是

秒 0-59 , - /
分 0-59 , - /
小时 0-23 , - /
日期 1-31 , - ? / L W C
月份 1-12 或者 JAN-DEC , - /
星期 1-7 或者 SUN-SAT , - ? / L C #
年（可选） 留空, 1970-2099 , - * /

* 字符代表所有可能的值
/ 字符用来指定数值的增量
- 代表在指定的范围内触发，比如”25-45”代表从25秒开始触发到45秒结束触发，每隔1秒触发1次
, 代表在指定的秒数触发，比如”0,15,45”代表0秒、15秒和45秒时触发任务
？ 字符仅被用于天（月）和天（星期）两个子表达式，表示不指定值当2个子表达式其中之一被指定了值以后，为了避免冲突，需要将另一个子表达式的值设为“？”
L 字符仅被用于天（月）和天（星期）两个子表达式，它是单词“last”的缩写如果在“L”前有具体的内容，它就具有其他的含义了。例如：“6L”表示这个月的倒数第６天 注意：在使用“L”参数时，不要指定列表或范围，因为这会导致问题
W 字符代表着平日(Mon-Fri)，并且仅能用于日域中。它用来指定离指定日的最近的一个平日。。
C 代表“Calendar”的意思。它的意思是计划所关联的日期，如果日期没有被关联，则相当于日历中所有日期。例如5C在日期字段中就相当于日历5日以后的第一天。1C在星期字段中相当于星期日后的第一天

例:
“30 ?” 每半分钟触发任务
“30 10 ?” 每小时的10分30秒触发任务
“30 10 1 ?” 每天1点10分30秒触发任务
15,30,45 ?” 每15秒，30秒，45秒时触发任务
“15-45 ?” 15到45秒内，每秒都触发任务
“15/5 ?” 每分钟的每15秒开始触发，每隔5秒触发一次
“15-30/5 ?” 每分钟的15秒到30秒之间开始触发，每隔5秒触发一次
“0 0/3 ?” 每小时的第0分0秒开始，每三分钟触发一次
“0 15 10 ? MON-FRI” 星期一到星期五的10点15分0秒触发任务
“0 15 10 L ?” 每个月最后一天的10点15分0秒触发任务
“0 15 10 LW ?” 每个月最后一个工作日的10点15分0秒触发任务
“0 15 10 ? 5L” 每个月最后一个星期四的10点15分0秒触发任务
“0 15 10 ? * 5#3” 每个月第三周的星期四的10点15分0秒触发任务


注册中心
作为服务注册中心，Eureka比Zookeeper对比 著名的CAP理论指出，一个分布式系统不可能同时保证（指的是优先考虑，不是一定要100%的）C(一致性)、A(可用性)和P(分区容错性)。由于分区容错性在是分布式系统中必须要保证的，因此我们只能在A和C之间进行权衡。
Zookeeper保证CP
当向注册中心查询服务列表时，我们可以容忍注册中心返回的是几分钟以前的注册信息，但不能接受服务直接down掉不可用。也就是说，服务注册功能对可用性的要求要高于一致性。但是zk会出现这样一种情况，当master节点因为网络故障与其他节点失去联系时，剩余节点会重新进行leader选举。问题在于，选举leader的时间太长，30 ~ 120s, 且选举期间整个zookeeper集群都是不可用的，这就导致在选举期间注册服务瘫痪。在云部署的环境下，因网络问题使得zk集群失去master节点是较大概率会发生的事，虽然服务能够最终恢复，但是漫长的选举时间导致的注册长期不可用是不能容忍的。

Eureka保证AP
Eureka在设计时就优先保证可用性。Eureka各个节点都是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务。而Eureka的客户端在向某个Eureka注册或时如果发现连接失败，则会自动切换至其它节点，只要有一台Eureka还在，就能保证注册服务可用(保证可用性)，只不过查到的信息可能不是最新的(不保证强一致性)。

Eureka还有一种自我保护机制，如果在15分钟内超过85%的节点都没有正常的心跳，那么Eureka就认为客户端与注册中心出现了网络故障，此时会出现以下几种情况：
Eureka默认不从注册列表中移除因为长时间没收到心跳而可能过期的服务 （可以配置移除，不移除和集群动态伸缩不符）
Eureka仍然能够接受新服务的注册和查询请求，但是不会被同步到其它节点上(即保证当前节点依然可用)
当网络稳定时，当前实例新的注册信息会被同步到其它节点中。 因此，Eureka可以很好的应对因网络故障导致部分节点失去联系的情况，而不会像zookeeper那样使整个注册服务瘫痪。


通信方式
了解RPC/gRPC/HTTP/REST相关概念
RPC是远端过程调用，其调用协议通常包含传输协议和编码协议。
HTTP严格来说跟RPC不是一个层级的概念，HTTP本身也可以作为RPC的传输层协议。
传输协议包含: 如著名的gRPC使用的HTTP 2.0协议，也有如Dubbo一类的自定义报文的TCP协议。
编码协议包含: 如基于文本编码的XML或Json，也有二进制编码的ProtoBuf或Binpack等。
所谓的效率优势是针对HTTP 1.1协议来讲的，HTTP 2.0协议已经优化编码效率问题，像gRPC这种RPC库使用的就是 HTTP 2.0协议。
在跨语言调用的时候，REST风格直接把HTTP作为应用协议（直接和服务打交道），不同语言之间调用比较方便。
为什么Dubbo比Spring Cloud性能要高
因为Dubbo采用单一长连接和NIO异步通讯（保持连接/轮询处理），使用自定义报文的TCP协议，并且序列化使用定制Hessian2框架， 适合于小数据量大并发的服务调用，以及服务消费者机器数远大于服务提供者机器数的情况，但不适用于传输大数据的服务调用。
而Spring Cloud直接使用HTTP协议（但也不是强绑定，也可以使用RPC库，或者采用HTTP 2.0+长链接方式，Fegin可以灵活设置）。
时间设定
请求过程时间设定

Hystrix超时间的计算公式
timeoutInMilliseconds = (1 + MaxAutoRetries + MaxAutoRetriesNextServer) * ReadTimeout

配置

  # Ribbon的超时重试
  ribbon:
    eureka:
      enabled: true
    ReadTimeout: 6000
    ConnectTimeout: 6000
    MaxAutoRetries: 1                 # 同一台实例最大重试次数,不包括首次调用
    MaxAutoRetriesNextServer: 1       # 重试负载均衡其他的实例最大重试次数,不包括首次调用
    OkToRetryOnAllOperations: false   # 是否所有操作都重试

  # Hystrix超时断路
  hystrix:
    command:
      default:
        execution:
          timeout:
            enabled: true
          isolation:
            thread:
              timeoutInMilliseconds: 18000
注意：
当ribbon超时后且hystrix没有超时，便会采取重试机制。当OkToRetryOnAllOperations设置为false时，只会对get请求进行重试。 如果设置为true，便会对所有的请求进行重试，如果是put或post等写操作，如果服务器接口没做幂等性，会产生不好的结果， 所以OkToRetryOnAllOperations慎用。

容器设定
常规基础镜像是openjdk:8-jre-alpine；但是此基础镜像缺少字体，所以在一些需要字体操作的服务中需要在此基础镜像上附加字体使用；

事务探讨
首先无法保证分布式系统中处理过程在一个事务中；
其次如果要保证强一致性必然会对可用性造成影响。
对于微服务中如何保证系统可用性和数据的一致性，有以下实践方案：
先记录：记录处理过程，处理前就要初始处理记录
可查询：处理状态要可以随时查询；
能重复：处理可以重复执行，保证处理幂等；
不强制：不在长时间处理上使用强一致性事务；
后定时：定时处理没有达到最终状态的的记录；
要排队：使用消息队列削减定时集中处理的冲击。
如果一定要使用事物，最好将增删改操作单独抽出一个方法处理，且该方法要保证不能被循环调用
版本区别
springCloud 1.x 的zull网关组件, 在2.0中使用 gateway 代替
springboot 2.x 基于spring 5.x, 自带异步非阻塞IO操作
从 1.x 升级到 2.x 时，使用migrator组件，可以在启动的时候提示差异或修改方案
maven引入
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-properties-migrator</artifactId>
  </dependency>