# 易读 yireader

## 介绍

易读是一款简单易用的个人小说阅读器，它以网页(web app)的形式提供服务，这样无论你在任何终端上都可以得到一个比较好的体验。

它的核心目标是下面几点：

* 支持书源。这样，可以接入书源，扩充其的能力。
* 良好的阅读体验。

大家可以登录到 [yireader.com:3001](http://yireader.com:3001) 进行体验。目前已经实现出一个实现核心功能的版本，本人已经自用了一段时间。

## 使用介绍

1. 打开网站后，点击右上角的搜索框，尝试搜索想看的小说
2. 等待出现搜索结果，点击想看的书，进入详情页面，试看或则加入书架以方便到首页观看

下面是 iPhone 6/7/8 上界面示例截图

首页

![home](screenshots/home.png)

详情页

![detail](screenshots/detail.png)

章节阅读页

![chapter](screenshots/chapter.png)



## 部署方法

### 命令行

```bash
docker run --name yireader1 -dp 3001:3001 --env NODE_ENV='production' uhziel/yireader
# 如果提示你权限不够，请确保用 root 用户登录后执行，或者在最前面加上 sudo 也可以
```

### 群晖

0. 确保已经安装好 docker 套件并清楚其基本的使用方法
1. 点击左侧页签"注册表"处搜索"yireader"，点击其中的"uhziel/yireader"并进行下载
2. 等待下载成功后，打开页签"映像"，找到刚下载的"uhzie/yireader"并双击来开始生成运行的容器
   1. 点击左下角的"高级设置"，选择"端口设置"页签，将其"本地端口"下的"自动"替换为3001，或则其他你未使用的端口
   2. 其他均默认设置即可，最后点击"应用"让其生效

### 验证是否生效

打开 http://<你的docker电脑ip>:3001，看下是否部署成功。

后续你可能需要做的是开放外网访问，网上教程比较多，各人环境也一样，这里就不复述了。

## 书源

## 良好的阅读体验

## 后续计划

1. 允许用户添加自定义的书源、管理书源
2. 添加账号系统，方便用户跨设备间同步数据
3. 增强界面表现，有一个更好的阅读体验

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
